#!/bin/bash

# Check if the hotspot is already active
if ip addr show wlan0 | grep -q "192.168.220.1/24"; then
    echo "Hotspot is already active."
    exit 0
fi

# Configure and start hostapd
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd

# Configure and start dnsmasq
sudo systemctl enable dnsmasq
sudo systemctl start dnsmasq

# Assign a static IP address to wlan0
sudo ip addr add 192.168.220.1/24 dev wlan0

# Enable IP forwarding
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# Add NAT rule
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

echo "Hotspot mode enabled."
