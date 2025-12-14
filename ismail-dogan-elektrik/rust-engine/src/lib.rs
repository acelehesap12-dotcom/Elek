//! # Elektrik Engine
//!
//! High-performance electrical load calculation library for İsmail Doğan Elektrik.
//!
//! This Rust library provides optimized calculations for:
//! - Electrical load analysis
//! - Cable sizing recommendations
//! - Breaker selection
//! - Safety assessments
//! - Energy consumption estimates
//!
//! ## Architecture
//!
//! The library is designed to be called from Python via PyO3 bindings,
//! providing significant performance improvements for complex calculations.

use pyo3::prelude::*;
use pyo3::types::PyDict;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// ============================================
// CONSTANTS
// ============================================

/// Standard breaker sizes in Amperes
const BREAKER_SIZES: &[u32] = &[6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];

/// Cable sections (mm²) with their maximum current capacity
const CABLE_SECTIONS: &[(f64, f64)] = &[
    (1.5, 16.0),
    (2.5, 21.0),
    (4.0, 28.0),
    (6.0, 36.0),
    (10.0, 50.0),
    (16.0, 68.0),
    (25.0, 89.0),
    (35.0, 111.0),
    (50.0, 133.0),
    (70.0, 171.0),
    (95.0, 207.0),
    (120.0, 240.0),
];

/// Electricity price per kWh (TRY)
const ELECTRICITY_PRICE: f64 = 3.5;

/// Safety thresholds
const LOAD_WARNING_THRESHOLD: f64 = 0.8;
const LOAD_DANGER_THRESHOLD: f64 = 0.95;

// ============================================
// DATA STRUCTURES
// ============================================

/// Represents an electrical device
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Device {
    pub name: String,
    pub power_watts: f64,
    pub quantity: u32,
    pub usage_hours_per_day: f64,
    pub power_factor: f64,
}

/// Circuit type enumeration
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CircuitType {
    SinglePhase,
    ThreePhase,
}

impl Default for CircuitType {
    fn default() -> Self {
        CircuitType::SinglePhase
    }
}

/// Safety status enumeration
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SafetyStatus {
    Safe,
    Warning,
    Danger,
}

/// Input parameters for load calculation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoadCalculationInput {
    pub devices: Vec<Device>,
    pub circuit_type: CircuitType,
    pub voltage_level: f64,
    pub safety_factor: f64,
}

/// Result of load calculation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoadCalculationResult {
    pub total_load_kw: f64,
    pub total_current_amps: f64,
    pub recommended_breaker_amps: u32,
    pub recommended_cable_section: f64,
    pub monthly_consumption_kwh: f64,
    pub estimated_monthly_cost: f64,
    pub safety_status: SafetyStatus,
    pub warnings: Vec<String>,
    pub recommendations: Vec<String>,
}

// ============================================
// CORE CALCULATIONS
// ============================================

/// Calculate the total power load from devices
fn calculate_total_power(devices: &[Device], safety_factor: f64) -> f64 {
    devices
        .par_iter()
        .map(|d| d.power_watts * d.quantity as f64)
        .sum::<f64>()
        * safety_factor
}

/// Calculate monthly energy consumption in kWh
fn calculate_monthly_energy(devices: &[Device]) -> f64 {
    devices
        .par_iter()
        .map(|d| {
            let daily_kwh = (d.power_watts * d.quantity as f64 * d.usage_hours_per_day) / 1000.0;
            daily_kwh * 30.0
        })
        .sum()
}

/// Calculate weighted average power factor
fn calculate_avg_power_factor(devices: &[Device]) -> f64 {
    let total_weighted: f64 = devices
        .iter()
        .map(|d| d.power_watts * d.quantity as f64 * d.power_factor)
        .sum();
    
    let total_power: f64 = devices
        .iter()
        .map(|d| d.power_watts * d.quantity as f64)
        .sum();
    
    if total_power > 0.0 {
        total_weighted / total_power
    } else {
        0.9 // Default power factor
    }
}

/// Calculate current based on circuit type
fn calculate_current(power_watts: f64, voltage: f64, circuit_type: CircuitType, power_factor: f64) -> f64 {
    match circuit_type {
        CircuitType::ThreePhase => {
            // I = P / (√3 × V × PF)
            power_watts / (1.732 * voltage * power_factor)
        }
        CircuitType::SinglePhase => {
            // I = P / (V × PF)
            power_watts / (voltage * power_factor)
        }
    }
}

/// Recommend appropriate breaker size
fn recommend_breaker(current_amps: f64) -> u32 {
    let target = current_amps * 1.25; // 25% margin
    
    BREAKER_SIZES
        .iter()
        .find(|&&size| size as f64 >= target)
        .copied()
        .unwrap_or(*BREAKER_SIZES.last().unwrap())
}

/// Recommend appropriate cable section
fn recommend_cable_section(current_amps: f64) -> f64 {
    let target = current_amps * 1.25; // 25% margin
    
    CABLE_SECTIONS
        .iter()
        .find(|(_, max_current)| *max_current >= target)
        .map(|(section, _)| *section)
        .unwrap_or(CABLE_SECTIONS.last().unwrap().0)
}

/// Assess safety and generate warnings/recommendations
fn assess_safety(
    current_amps: f64,
    breaker_amps: u32,
    total_load_kw: f64,
) -> (SafetyStatus, Vec<String>, Vec<String>) {
    let mut warnings = Vec::new();
    let mut recommendations = Vec::new();
    let mut status = SafetyStatus::Safe;
    
    let load_factor = current_amps / breaker_amps as f64;
    
    // Check load factor thresholds
    if load_factor > LOAD_DANGER_THRESHOLD {
        status = SafetyStatus::Danger;
        warnings.push("KRİTİK: Sistem aşırı yüklü durumda".to_string());
        warnings.push("Aşırı ısınma ve yangın riski mevcut".to_string());
        recommendations.push("ACİL: Elektrik sistemini yeniden boyutlandırın".to_string());
    } else if load_factor > LOAD_WARNING_THRESHOLD {
        status = SafetyStatus::Warning;
        warnings.push(format!(
            "Sistem kapasitesi yüksek kullanım seviyesinde ({:.0}%)",
            load_factor * 100.0
        ));
        recommendations.push("Daha yüksek kapasiteli sigorta ve kablo kullanımı önerilir".to_string());
    }
    
    // High load recommendations
    if total_load_kw > 10.0 {
        recommendations.push("Bu yük için 3 fazlı sistem değerlendirmesi önerilir".to_string());
    }
    
    if total_load_kw > 5.0 && status == SafetyStatus::Safe {
        recommendations.push("Yük dengeleme için devre sayısını artırmayı düşünün".to_string());
    }
    
    // General recommendations for safe systems
    if warnings.is_empty() {
        recommendations.push("Sistem güvenli çalışma parametreleri içinde".to_string());
        recommendations.push("Yıllık periyodik kontrol önerilir".to_string());
    }
    
    (status, warnings, recommendations)
}

/// Main calculation function
pub fn calculate_load(input: LoadCalculationInput) -> LoadCalculationResult {
    // Calculate power factor
    let power_factor = calculate_avg_power_factor(&input.devices);
    
    // Calculate total power with safety factor
    let total_power_watts = calculate_total_power(&input.devices, input.safety_factor);
    let total_load_kw = total_power_watts / 1000.0;
    
    // Calculate current
    let total_current = calculate_current(
        total_power_watts,
        input.voltage_level,
        input.circuit_type,
        power_factor,
    );
    
    // Get recommendations
    let breaker_amps = recommend_breaker(total_current);
    let cable_section = recommend_cable_section(total_current);
    
    // Calculate energy consumption
    let monthly_kwh = calculate_monthly_energy(&input.devices);
    let monthly_cost = monthly_kwh * ELECTRICITY_PRICE;
    
    // Assess safety
    let (safety_status, warnings, recommendations) =
        assess_safety(total_current, breaker_amps, total_load_kw);
    
    LoadCalculationResult {
        total_load_kw: (total_load_kw * 100.0).round() / 100.0,
        total_current_amps: (total_current * 100.0).round() / 100.0,
        recommended_breaker_amps: breaker_amps,
        recommended_cable_section: cable_section,
        monthly_consumption_kwh: (monthly_kwh * 100.0).round() / 100.0,
        estimated_monthly_cost: (monthly_cost * 100.0).round() / 100.0,
        safety_status,
        warnings,
        recommendations,
    }
}

// ============================================
// PYTHON BINDINGS
// ============================================

/// Calculate electrical load from Python
#[pyfunction]
#[pyo3(signature = (devices, circuit_type, voltage_level, safety_factor=1.2))]
fn calculate_electrical_load(
    py: Python,
    devices: Vec<HashMap<String, PyObject>>,
    circuit_type: &str,
    voltage_level: f64,
    safety_factor: f64,
) -> PyResult<PyObject> {
    // Parse devices
    let parsed_devices: Vec<Device> = devices
        .iter()
        .map(|d| {
            Device {
                name: d.get("name")
                    .and_then(|v| v.extract::<String>(py).ok())
                    .unwrap_or_default(),
                power_watts: d.get("power_watts")
                    .and_then(|v| v.extract::<f64>(py).ok())
                    .unwrap_or(0.0),
                quantity: d.get("quantity")
                    .and_then(|v| v.extract::<u32>(py).ok())
                    .unwrap_or(1),
                usage_hours_per_day: d.get("usage_hours_per_day")
                    .and_then(|v| v.extract::<f64>(py).ok())
                    .unwrap_or(8.0),
                power_factor: d.get("power_factor")
                    .and_then(|v| v.extract::<f64>(py).ok())
                    .unwrap_or(0.9),
            }
        })
        .collect();
    
    // Parse circuit type
    let circuit = match circuit_type {
        "three_phase" => CircuitType::ThreePhase,
        _ => CircuitType::SinglePhase,
    };
    
    // Create input
    let input = LoadCalculationInput {
        devices: parsed_devices,
        circuit_type: circuit,
        voltage_level,
        safety_factor,
    };
    
    // Calculate
    let result = calculate_load(input);
    
    // Convert to Python dict
    let dict = PyDict::new(py);
    dict.set_item("total_load_kw", result.total_load_kw)?;
    dict.set_item("total_current_amps", result.total_current_amps)?;
    dict.set_item("recommended_breaker_amps", result.recommended_breaker_amps)?;
    dict.set_item("recommended_cable_section", result.recommended_cable_section)?;
    dict.set_item("monthly_consumption_kwh", result.monthly_consumption_kwh)?;
    dict.set_item("estimated_monthly_cost", result.estimated_monthly_cost)?;
    dict.set_item("safety_status", format!("{:?}", result.safety_status).to_lowercase())?;
    dict.set_item("warnings", result.warnings)?;
    dict.set_item("recommendations", result.recommendations)?;
    
    Ok(dict.into())
}

/// Get library version
#[pyfunction]
fn version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

/// Check if library is functional
#[pyfunction]
fn health_check() -> bool {
    true
}

/// Python module definition
#[pymodule]
fn elektrik_engine(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(calculate_electrical_load, m)?)?;
    m.add_function(wrap_pyfunction!(version, m)?)?;
    m.add_function(wrap_pyfunction!(health_check, m)?)?;
    Ok(())
}

// ============================================
// TESTS
// ============================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_total_power() {
        let devices = vec![
            Device {
                name: "Klima".to_string(),
                power_watts: 2500.0,
                quantity: 2,
                usage_hours_per_day: 8.0,
                power_factor: 0.85,
            },
            Device {
                name: "Buzdolabı".to_string(),
                power_watts: 150.0,
                quantity: 1,
                usage_hours_per_day: 24.0,
                power_factor: 0.9,
            },
        ];
        
        let total = calculate_total_power(&devices, 1.0);
        assert!((total - 5150.0).abs() < 0.1);
    }

    #[test]
    fn test_calculate_current_single_phase() {
        let current = calculate_current(2200.0, 220.0, CircuitType::SinglePhase, 1.0);
        assert!((current - 10.0).abs() < 0.1);
    }

    #[test]
    fn test_calculate_current_three_phase() {
        let current = calculate_current(11000.0, 380.0, CircuitType::ThreePhase, 0.9);
        // I = 11000 / (1.732 * 380 * 0.9) ≈ 18.57 A
        assert!((current - 18.57).abs() < 0.1);
    }

    #[test]
    fn test_recommend_breaker() {
        assert_eq!(recommend_breaker(10.0), 16);  // 10 * 1.25 = 12.5, next is 16
        assert_eq!(recommend_breaker(20.0), 32);  // 20 * 1.25 = 25, but 25 is exact so next is 32
        assert_eq!(recommend_breaker(50.0), 80);  // 50 * 1.25 = 62.5, next is 80
    }

    #[test]
    fn test_recommend_cable_section() {
        assert_eq!(recommend_cable_section(10.0), 1.5);   // 10 * 1.25 = 12.5, 1.5mm² handles 16A
        assert_eq!(recommend_cable_section(30.0), 10.0);  // 30 * 1.25 = 37.5, need 10mm² (50A)
    }

    #[test]
    fn test_full_calculation() {
        let input = LoadCalculationInput {
            devices: vec![
                Device {
                    name: "Klima".to_string(),
                    power_watts: 2500.0,
                    quantity: 2,
                    usage_hours_per_day: 8.0,
                    power_factor: 0.85,
                },
            ],
            circuit_type: CircuitType::SinglePhase,
            voltage_level: 220.0,
            safety_factor: 1.2,
        };
        
        let result = calculate_load(input);
        
        assert!(result.total_load_kw > 0.0);
        assert!(result.total_current_amps > 0.0);
        assert!(result.recommended_breaker_amps > 0);
        assert!(result.recommended_cable_section > 0.0);
    }

    #[test]
    fn test_safety_assessment() {
        // Test safe condition
        let (status, warnings, _) = assess_safety(10.0, 32, 2.2);
        assert_eq!(status, SafetyStatus::Safe);
        assert!(warnings.is_empty());
        
        // Test warning condition (>80%)
        let (status, warnings, _) = assess_safety(28.0, 32, 6.16);
        assert_eq!(status, SafetyStatus::Warning);
        assert!(!warnings.is_empty());
        
        // Test danger condition (>95%)
        let (status, warnings, _) = assess_safety(31.0, 32, 6.82);
        assert_eq!(status, SafetyStatus::Danger);
        assert!(!warnings.is_empty());
    }
}
