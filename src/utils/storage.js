const STORAGE_KEY = 'stride_app_data';

/**
 * Load data from localStorage
 */
export function loadData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
        return null;
    }
}

/**
 * Save data to localStorage
 */
export function saveData(data) {
    try {
        // Remove initialized flag before saving
        const { initialized, ...dataToSave } = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
    }
}

/**
 * Clear all stored data
 */
export function clearData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}

/**
 * Export data as JSON string for backup
 */
export function exportData() {
    const data = loadData();
    return data ? JSON.stringify(data, null, 2) : null;
}

/**
 * Import data from JSON string
 */
export function importData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        saveData(data);
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
}
