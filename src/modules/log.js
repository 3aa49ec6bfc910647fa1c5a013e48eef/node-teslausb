const getTimestamp = () => {
    return new Date().toISOString();
};

export const logWithTimestamp = (...args) => {
    console.log(getTimestamp(), ...args);
};

export const errorWithTimestamp = (...args) => {
    console.error(getTimestamp(), ...args);
};