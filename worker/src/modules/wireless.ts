interface WirelessNetwork { // some default values, to be refined
    ssid: string
    bssid: string
    channel: number
    frequency: number
    signalLevel: number
    security: string
    securityFlags: string
}

/*
// Behaviour:
    2) scan wifi networks every wireless.refreshInterval minutes
    3) if a network is found in wireless.networks networks, connect to it based upon priority
    4) if no networks are found, enable hotspot mode as per wireless.networks.hotspot
    5) every wireless.refreshInterval, if no clients are connected to the hotspot, go to step 2
*/


export const scanWirelessNetworks = async (): Promise<WirelessNetwork[]> => {
    return []
}

export const connectToWirelessNetwork = async (ssid: string, password: string): Promise<boolean> => {
    return false
}

export const disconnectFromWirelessNetwork = async (): Promise<boolean> => {
    return false
}

export const getWirelessHotspotStatus = async (): Promise<boolean> => {
    return false
}

export const enableWirelessHotspot = async (ssid: string, password: string): Promise<boolean> => {
    return false
}

export const disableWirelessHotspot = async (): Promise<boolean> => {
    return false
}