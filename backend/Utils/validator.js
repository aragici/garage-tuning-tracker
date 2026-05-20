function validateCarInput(brand, model, year) {
    if (!brand || brand.trim() === '') return { isValid: false, message: 'Brand cannot be empty' };
    if (!model || model.trim() === '') return { isValid: false, message: 'Model cannot be empty' };
    
    const currentYear = new Date().getFullYear();
    if (!year || year < 1900 || year > currentYear + 1) {
        return { isValid: false, message: 'Invalid manufacturing year' };
    }
    
    return { isValid: true, message: 'Valid input' };
}

function validatePartInput(partName, cost) {
    if (!partName || partName.trim() === '') return { isValid: false, message: 'Part name cannot be empty' };
    if (cost === undefined || cost === null || cost < 0) {
        return { isValid: false, message: 'Cost cannot be negative' };
    }
    return { isValid: true, message: 'Valid input' };
}

module.exports = { validateCarInput, validatePartInput };