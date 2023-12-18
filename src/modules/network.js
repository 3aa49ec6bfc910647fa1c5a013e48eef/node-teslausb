import { logWithTimestamp, errorWithTimestamp } from "./log.js";

export const restartWifi = async () => {
    logWithTimestamp("Restarting wifi")
    await executeBashCommand("ifconfig wlan0 down && ifconfig wlan0 up")
}

export const checkIfArchiveIsReachable = async (archiveServer) => {

    try {
        const res = await ping.promise.probe(archiveServer, {
            timeout: 5,  // Timeout in seconds
            extra: ["-c", "1"],  // Sends only 1 packet
        });

        logWithTimestamp(`${archiveServer} is ${res.alive ? 'reachable' : 'not reachable'}`);
        return res.alive;
    } catch (error) {
        errorWithTimestamp('Error pinging archive server:', error);
        return false;
    }
};