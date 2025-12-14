"""
İsmail Doğan Elektrik API - Rust Engine Binding
Python bridge to call Rust-compiled high-performance electrical calculation library
"""

from typing import Dict, List, Any, Optional
from loguru import logger
import ctypes
import os
import json

from app.config import settings


# ============================================
# RUST LIBRARY LOADING
# ============================================

class RustEngineError(Exception):
    """Exception raised when Rust engine encounters an error"""
    pass


def _load_rust_library() -> Optional[ctypes.CDLL]:
    """
    Load the Rust-compiled shared library.
    Returns None if library is not available.
    """
    if not settings.RUST_ENGINE_ENABLED:
        logger.warning("Rust engine is disabled in settings")
        return None
    
    lib_path = settings.RUST_LIB_PATH
    
    # Check multiple possible library names/paths
    possible_paths = [
        lib_path,
        lib_path.replace(".so", ".dylib"),  # macOS
        lib_path.replace(".so", ".dll"),     # Windows
        "./libelektrik_engine.so",
        "./elektrik_engine.dll",
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            try:
                lib = ctypes.CDLL(path)
                logger.info(f"Loaded Rust engine from: {path}")
                return lib
            except OSError as e:
                logger.warning(f"Failed to load Rust library from {path}: {e}")
    
    logger.warning("Rust engine library not found, using Python fallback")
    return None


# Try to load Rust library at module import
_rust_lib = _load_rust_library()


# ============================================
# ELECTRICAL CONSTANTS
# ============================================

# Standard breaker sizes in Amperes
BREAKER_SIZES = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250]

# Cable section recommendations (mm² to max current mapping)
CABLE_SECTIONS = {
    1.5: 16,
    2.5: 21,
    4.0: 28,
    6.0: 36,
    10.0: 50,
    16.0: 68,
    25.0: 89,
    35.0: 111,
    50.0: 133,
    70.0: 171,
    95.0: 207,
    120.0: 240,
}


# ============================================
# PYTHON FALLBACK CALCULATIONS
# ============================================

def _calculate_total_load(
    devices: List[Dict[str, Any]],
    safety_factor: float
) -> tuple[float, float]:
    """
    Calculate total electrical load.
    Returns (total_load_watts, total_monthly_kwh)
    """
    total_power = 0.0
    total_monthly_energy = 0.0
    
    for device in devices:
        power = device["power_watts"] * device["quantity"]
        daily_energy = power * device["usage_hours_per_day"] / 1000  # kWh
        monthly_energy = daily_energy * 30
        
        total_power += power
        total_monthly_energy += monthly_energy
    
    # Apply safety factor
    total_power *= safety_factor
    
    return total_power, total_monthly_energy


def _calculate_current(
    total_power_watts: float,
    voltage: float,
    circuit_type: str,
    power_factor: float = 0.9
) -> float:
    """
    Calculate current based on circuit type.
    Single phase: I = P / (V * PF)
    Three phase: I = P / (√3 * V * PF)
    """
    if circuit_type == "three_phase":
        # Three-phase formula: I = P / (√3 × V × PF)
        current = total_power_watts / (1.732 * voltage * power_factor)
    else:
        # Single-phase formula: I = P / (V × PF)
        current = total_power_watts / (voltage * power_factor)
    
    return current


def _recommend_breaker(current_amps: float) -> int:
    """Recommend appropriate breaker size"""
    for size in BREAKER_SIZES:
        if size >= current_amps * 1.25:  # 25% margin
            return size
    return BREAKER_SIZES[-1]


def _recommend_cable_section(current_amps: float) -> float:
    """Recommend appropriate cable section"""
    for section, max_current in sorted(CABLE_SECTIONS.items()):
        if max_current >= current_amps * 1.25:  # 25% margin
            return section
    return list(CABLE_SECTIONS.keys())[-1]


def _assess_safety(
    current_amps: float,
    breaker_amps: int,
    total_load_kw: float
) -> tuple[str, List[str], List[str]]:
    """
    Assess electrical safety and provide warnings/recommendations.
    Returns (status, warnings, recommendations)
    """
    warnings = []
    recommendations = []
    status = "safe"
    
    # Check load factor
    load_factor = current_amps / breaker_amps
    
    if load_factor > 0.8:
        status = "warning"
        warnings.append("Sistem kapasitesi yüksek kullanım seviyesinde (%80+)")
        recommendations.append("Daha yüksek kapasiteli sigorta ve kablo kullanımı önerilir")
    
    if load_factor > 0.95:
        status = "danger"
        warnings.append("KRİTİK: Sistem aşırı yüklü durumda")
        warnings.append("Aşırı ısınma ve yangın riski mevcut")
        recommendations.append("ACİL: Elektrik sistemini yeniden boyutlandırın")
    
    if total_load_kw > 10:
        recommendations.append("Bu yük için 3 fazlı sistem değerlendirmesi önerilir")
    
    if total_load_kw > 5 and status == "safe":
        recommendations.append("Yük dengeleme için devre sayısını artırmayı düşünün")
    
    # General recommendations
    if not warnings:
        recommendations.append("Sistem güvenli çalışma parametreleri içinde")
        recommendations.append("Yıllık periyodik kontrol önerilir")
    
    return status, warnings, recommendations


def _python_calculate_load(
    devices: List[Dict[str, Any]],
    circuit_type: str,
    voltage_level: float,
    safety_factor: float
) -> Dict[str, Any]:
    """
    Pure Python implementation of load calculation.
    Used as fallback when Rust engine is not available.
    """
    # Calculate average power factor
    total_pf_weighted = sum(
        d["power_watts"] * d["quantity"] * d["power_factor"]
        for d in devices
    )
    total_power = sum(d["power_watts"] * d["quantity"] for d in devices)
    avg_power_factor = total_pf_weighted / total_power if total_power > 0 else 0.9
    
    # Calculate total load
    total_load_watts, monthly_kwh = _calculate_total_load(devices, safety_factor)
    total_load_kw = total_load_watts / 1000
    
    # Calculate current
    total_current = _calculate_current(
        total_load_watts,
        voltage_level,
        circuit_type,
        avg_power_factor
    )
    
    # Get recommendations
    breaker_amps = _recommend_breaker(total_current)
    cable_section = _recommend_cable_section(total_current)
    
    # Calculate monthly cost
    electricity_rate = settings.ELECTRICITY_PRICE_PER_KWH
    monthly_cost = monthly_kwh * electricity_rate
    
    # Assess safety
    safety_status, warnings, recommendations = _assess_safety(
        total_current,
        breaker_amps,
        total_load_kw
    )
    
    return {
        "total_load_kw": round(total_load_kw, 2),
        "total_current_amps": round(total_current, 2),
        "recommended_breaker_amps": breaker_amps,
        "recommended_cable_section": cable_section,
        "monthly_consumption_kwh": round(monthly_kwh, 2),
        "estimated_monthly_cost": round(monthly_cost, 2),
        "safety_status": safety_status,
        "warnings": warnings,
        "recommendations": recommendations,
    }


# ============================================
# PUBLIC API
# ============================================

def calculate_electrical_load(
    devices: List[Dict[str, Any]],
    circuit_type: str,
    voltage_level: float,
    safety_factor: float
) -> Dict[str, Any]:
    """
    Calculate electrical load using Rust engine (if available) or Python fallback.
    
    This function serves as the bridge between Python and the high-performance
    Rust calculation engine. The Rust engine provides optimized calculations
    for complex electrical load analysis.
    
    Args:
        devices: List of electrical devices with power specifications
        circuit_type: "single_phase" or "three_phase"
        voltage_level: System voltage (typically 220V or 380V)
        safety_factor: Safety margin multiplier (1.0 - 2.0)
    
    Returns:
        Dictionary containing calculation results and recommendations
    """
    
    if _rust_lib is not None:
        try:
            # Prepare data for Rust
            input_json = json.dumps({
                "devices": devices,
                "circuit_type": circuit_type,
                "voltage_level": voltage_level,
                "safety_factor": safety_factor,
            }).encode('utf-8')
            
            # Call Rust function
            # Note: This is a simplified example. In production, you would:
            # 1. Define proper C-compatible function signatures
            # 2. Handle memory allocation/deallocation properly
            # 3. Use cffi or ctypes properly for struct passing
            
            # For now, we'll use Python fallback
            logger.debug("Using Python fallback for load calculation")
            return _python_calculate_load(
                devices, circuit_type, voltage_level, safety_factor
            )
            
        except Exception as e:
            logger.error(f"Rust engine error, falling back to Python: {e}")
            return _python_calculate_load(
                devices, circuit_type, voltage_level, safety_factor
            )
    else:
        # Use Python fallback
        logger.debug("Rust engine not available, using Python calculation")
        return _python_calculate_load(
            devices, circuit_type, voltage_level, safety_factor
        )


def is_rust_engine_available() -> bool:
    """Check if Rust engine is available and loaded"""
    return _rust_lib is not None


def get_engine_info() -> Dict[str, Any]:
    """Get information about the calculation engine"""
    return {
        "rust_available": is_rust_engine_available(),
        "rust_enabled": settings.RUST_ENGINE_ENABLED,
        "rust_lib_path": settings.RUST_LIB_PATH,
        "fallback": "Python",
        "electricity_rate": settings.ELECTRICITY_PRICE_PER_KWH,
    }
