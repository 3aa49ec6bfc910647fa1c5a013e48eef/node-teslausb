const getTimestamp = (): string => {
    const date: Date = new Date();
    const offset: number = date.getTimezoneOffset() * 60000; // Convert offset to milliseconds
    const localISOTime: string = new Date(date.getTime() - offset).toISOString().slice(0, -1);
    return localISOTime
};

export const logWithTimestamp = (...args: any[]) => {
    console.log(getTimestamp(), ...args);
};

export const errorWithTimestamp = (...args: any[]) => {
    console.error(getTimestamp(), ...args);
};