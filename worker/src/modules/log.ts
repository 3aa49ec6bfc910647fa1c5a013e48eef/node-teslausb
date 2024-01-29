const getTimestamp = () => {
    return new Date().toString();
};

export const logWithTimestamp = (...args) => {
    console.log(getTimestamp(), ...args);
};

export const errorWithTimestamp = (...args) => {
    console.error(getTimestamp(), ...args);
};