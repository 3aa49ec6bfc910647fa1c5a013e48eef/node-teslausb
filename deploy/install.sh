# Install git and clone the repo to the local system
# TODO: Make this a better process in future
apt update && apt install git -y
git clone https://github.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb.git /bin/node-teslausb

# Install nodejs
apt install nodejs npm rclone -y

# Make root directory for virtual USB volumes
mkdir /vusb

# Create backing file
touch /vusb/TeslaCam

# Get the size of the root file system in bytes
export root_size=$(df --output=size / | tail -n 1 | tr -d ' ')
echo Root volume size: $root_size

# Calculate the size for the new volume (subtracting 10GB)
export new_size=$(((root_size - 20 * 1024 * 1024) * 1024))
# export new_size=$(((100 * 1024 * 1024) * 1024))
echo New volume size: $new_size

# Create the new volume with the calculated size
sudo fallocate -l $new_size /vusb/TeslaCam

# Format as exfat
sudo mkfs.exfat -n TeslaCam /vusb/TeslaCam

# Create mount point
mkdir /mnt/TeslaCam

# Configure
cd /bin/node-teslausb/worker/src/configure && npm i && node .

# Install required modules for worker
cd /bin/node-teslausb/worker/src && npm i

# Create log directory
mkdir /logs

# Configure node-teslausb as systemd service
cat << EOF > /lib/systemd/system/node-teslausb.service
[Unit]
Description=node-teslausb
DefaultDependencies=no

[Service]
Type=simple
ExecStartPre=/bin/sleep 10
ExecStart=/usr/bin/node /bin/node-teslausb/worker/index.js
WorkingDirectory=/bin/node-teslausb
StandardOutput=append:/logs/worker.log
StandardError=inherit
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
systemctl enable node-teslausb.service
# Not sure if this next line is needed
systemctl start node-teslausb.service

# Refresh the systemd daemon
systemctl daemon-reload

# Clean unused packages
# sudo apt-get autoremove --purge

# Create TeslaCam folder on USB volume
sudo mount -o rw /vusb/TeslaCam /mnt/TeslaCam && mkdir /mnt/TeslaCam/TeslaCam && sudo umount /mnt/TeslaCam

# We're done
reboot

# Mount the volume (temporarily)
# sudo mount -o ro /vusb/TeslaCam /mnt/TeslaCam && systemctl daemon-reload
# rclone copy /mnt/TeslaCam/TeslaCam node-teslausb:teslausb/TeslaCam -v --multi-thread-streams --no-update-modtime --partial-suffix .partial
# sudo umount /mnt/TeslaCam