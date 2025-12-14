//! Benchmark tests for electrical calculations
//!
//! Run with: cargo bench

use criterion::{black_box, criterion_group, criterion_main, Criterion};
use elektrik_engine::{calculate_load, CircuitType, Device, LoadCalculationInput};

fn create_test_devices(count: usize) -> Vec<Device> {
    (0..count)
        .map(|i| Device {
            name: format!("Device {}", i),
            power_watts: 1000.0 + (i as f64 * 100.0),
            quantity: 1,
            usage_hours_per_day: 8.0,
            power_factor: 0.9,
        })
        .collect()
}

fn benchmark_small_load(c: &mut Criterion) {
    let devices = create_test_devices(5);
    let input = LoadCalculationInput {
        devices,
        circuit_type: CircuitType::SinglePhase,
        voltage_level: 220.0,
        safety_factor: 1.2,
    };

    c.bench_function("load_calculation_5_devices", |b| {
        b.iter(|| calculate_load(black_box(input.clone())))
    });
}

fn benchmark_medium_load(c: &mut Criterion) {
    let devices = create_test_devices(50);
    let input = LoadCalculationInput {
        devices,
        circuit_type: CircuitType::ThreePhase,
        voltage_level: 380.0,
        safety_factor: 1.2,
    };

    c.bench_function("load_calculation_50_devices", |b| {
        b.iter(|| calculate_load(black_box(input.clone())))
    });
}

fn benchmark_large_load(c: &mut Criterion) {
    let devices = create_test_devices(500);
    let input = LoadCalculationInput {
        devices,
        circuit_type: CircuitType::ThreePhase,
        voltage_level: 380.0,
        safety_factor: 1.2,
    };

    c.bench_function("load_calculation_500_devices", |b| {
        b.iter(|| calculate_load(black_box(input.clone())))
    });
}

fn benchmark_industrial_load(c: &mut Criterion) {
    // Simulating a real industrial scenario
    let devices = vec![
        Device {
            name: "Asenkron Motor 1".to_string(),
            power_watts: 15000.0,
            quantity: 4,
            usage_hours_per_day: 16.0,
            power_factor: 0.85,
        },
        Device {
            name: "Kompresör".to_string(),
            power_watts: 7500.0,
            quantity: 2,
            usage_hours_per_day: 20.0,
            power_factor: 0.8,
        },
        Device {
            name: "CNC Tezgahı".to_string(),
            power_watts: 5000.0,
            quantity: 10,
            usage_hours_per_day: 12.0,
            power_factor: 0.9,
        },
        Device {
            name: "Kaynak Makinesi".to_string(),
            power_watts: 8000.0,
            quantity: 3,
            usage_hours_per_day: 6.0,
            power_factor: 0.7,
        },
        Device {
            name: "Aydınlatma".to_string(),
            power_watts: 100.0,
            quantity: 200,
            usage_hours_per_day: 10.0,
            power_factor: 0.95,
        },
        Device {
            name: "Klima Santrali".to_string(),
            power_watts: 25000.0,
            quantity: 2,
            usage_hours_per_day: 12.0,
            power_factor: 0.9,
        },
    ];

    let input = LoadCalculationInput {
        devices,
        circuit_type: CircuitType::ThreePhase,
        voltage_level: 380.0,
        safety_factor: 1.25,
    };

    c.bench_function("industrial_load_calculation", |b| {
        b.iter(|| calculate_load(black_box(input.clone())))
    });
}

criterion_group!(
    benches,
    benchmark_small_load,
    benchmark_medium_load,
    benchmark_large_load,
    benchmark_industrial_load
);
criterion_main!(benches);
