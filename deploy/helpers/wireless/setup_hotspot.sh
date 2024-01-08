#!/bin/bash

# Check if hostapd is already installed
if ! command -v hostapd >/dev/null 2>&1; then
    echo "Installing hostapd and dnsmasq..."
    sudo apt-get update
    sudo apt-get install -y hostapd dnsmasq
else
    echo "hostapd already installed."
fi

# Stop the services to prevent them from interfering with setup
sudo systemctl stop hostapd
sudo systemctl stop dnsmasq

# Create hostapd configuration if not exists
if [ ! -f /etc/hostapd/hostapd.conf ]; then
    cat <<EOF | sudo tee /etc/hostapd/hostapd.conf
interface=wlan0
ssid=node-teslausb
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=hotspotmode
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
EOF
fi

# Create dnsmasq configuration if not exists
if [ ! -f /etc/dnsmasq.conf ]; then
    cat <<EOF | sudo tee /etc/dnsmasq.conf
interface=wlan0
dhcp-range=192.168.220.10,192.168.220.100,255.255.255.0,24h
EOF
fi

echo "Setup complete. You can now enable hotspot mode with enable_hotspot.sh."
