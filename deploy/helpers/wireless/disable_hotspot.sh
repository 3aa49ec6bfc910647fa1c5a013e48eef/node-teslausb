#!/bin/bash

# Check if the hotspot is not active
if ! ip addr show wlan0 | grep -q "192.168.220.1/24"; then
    echo "Hotspot is not active."
    exit 0
fi

# Stop and disable hostapd and dnsmasq
sudo systemctl stop hostapd
sudo systemctl disable hostapd
sudo systemctl stop dnsmasq
sudo systemctl disable dnsmasq

# Remove static IP address from wlan0
sudo ip addr del 192.168.220.1/24 dev wlan0

# Disable IP forwarding
echo 0 | sudo tee /proc/sys/net/ipv4/ip_forward

# Remove NAT rule
sudo iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

echo "Hotspot mode disabled. Reverted to AP client mode."
