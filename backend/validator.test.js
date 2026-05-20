const { validateCarInput, validatePartInput } = require('./utils/validator');

describe('Garage Tuning Tracker - Business Logic Unit Tests', () => {
    
    test('Should fail if brand is empty', () => {
        const result = validateCarInput('', 'Clio', 2024);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Brand cannot be empty');
    });

    test('Should fail if year is unrealistic', () => {
        const result = validateCarInput('Renault', 'Clio', 1850);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Invalid manufacturing year');
    });

    test('Should pass with correct car details', () => {
        const result = validateCarInput('Renault', 'Clio Esprit Alpine', 2024);
        expect(result.isValid).toBe(true);
    });

    test('Should fail if part name is missing', () => {
        const result = validatePartInput('', 500);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Part name cannot be empty');
    });

    test('Should fail if modification cost is negative', () => {
        const result = validatePartInput('Spoiler', -100);
        expect(result.isValid).toBe(false);
        expect(result.message).toBe('Cost cannot be negative');
    });

    test('Should pass with valid part configuration', () => {
        const result = validatePartInput('Rims', 1200);
        expect(result.isValid).toBe(true);
    });
});