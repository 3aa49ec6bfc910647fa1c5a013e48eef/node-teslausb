import { logWithTimestamp, errorWithTimestamp } from "./log.js";
import ping from "ping";
import { executeBashCommand } from "./bash.js";
import { getRcloneConfig } from "./rclone.js";

export const restartWifi = async () => {
    logWithTimestamp("Restarting wifi")
    await executeBashCommand("ifconfig wlan0 down && ifconfig wlan0 up")
}

export const checkIfArchiveIsReachable = async () => {

    const config = getRcloneConfig()
    const connectivityTestType = getConnectivityTestType(config)

    if (connectivityTestType === ConnectivityTestType.internetConnected) {
        return await testInternetConnected()
    }

    if (connectivityTestType === ConnectivityTestType.pingHost) {
        return await testPingHost(config.host)
    }

};

const testPingHost = async (host: string) => {
    try {
        const res = await ping.promise.probe(host, {
            timeout: 5,  // Timeout in seconds
            extra: ["-c", "1"],  // Sends only 1 packet
        });

        logWithTimestamp(`${host} is ${res.alive ? 'reachable' : 'not reachable'}`);
        return res.alive;
    } catch (error) {
        errorWithTimestamp('Error pinging host:', error);
        return false;
    }
}

const testInternetConnected = async () => {
    try {
        const res = await ping.promise.probe("google.com", {
            timeout: 5,  // Timeout in seconds
            extra: ["-c", "1"],  // Sends only 1 packet
        });

        logWithTimestamp(`Internet is ${res.alive ? 'reachable' : 'not reachable'}`);
        return res.alive;
    } catch (error) {
        errorWithTimestamp('Error pinging google.com:', error);
        return false;
    }
}

enum ConnectivityTestType {
    pingHost = "pingHost",
    internetConnected = "internetConnected",
}

const getConnectivityTestType = (config: any) => {
    let connectivityTestType: ConnectivityTestType;
    switch (config.type) {
        case "smb":
            connectivityTestType = ConnectivityTestType.pingHost
        default:
            connectivityTestType = ConnectivityTestType.internetConnected
    }
    return connectivityTestType
}