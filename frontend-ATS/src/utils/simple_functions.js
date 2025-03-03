// This file contains commonly reused functions. Can be used in any component.
// Please add proper comments to explain the functions.

// Function to get key by value for any JSON object with arrays as values
function getKeyByValue(object, value) {
    // Get array of value arrays (every key has a corresponding array)
    const values = Object.values(object);
    // Get array of object keys
    const keys = Object.keys(object);

    let index = -1

    // Iterate through the values array to find if value is included in any of the arrays
    for (let i = 0; i < values.length; i++) {
        if (values[i].includes(value)) {
            index = i;
            break
        }
        else continue
    }

    if (index !== -1) {
        return keys[index];
    }
    return null;
}

export { getKeyByValue };