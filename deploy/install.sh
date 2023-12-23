# sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/install.sh)"

# Install git and clone the repo to the local system
# TODO: Migrate away from this in the future (done for worker and website)
apt update && apt install git jq -y
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
cd /bin/node-teslausb/src/worker/configure && npm i && node .

# Create log directory
mkdir /logs

# Clean unused packages
# sudo apt-get autoremove --purge

# Create TeslaCam folder on USB volume
sudo mount -o rw /vusb/TeslaCam /mnt/TeslaCam && mkdir /mnt/TeslaCam/TeslaCam && sudo umount /mnt/TeslaCam

# Install worker
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/install-worker.sh)"

# Install website
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/install-website.sh)"

# We're done
reboot

# Mount the volume (temporarily)
# sudo mount -o ro /vusb/TeslaCam /mnt/TeslaCam && systemctl daemon-reload
# rclone copy /mnt/TeslaCam/TeslaCam node-teslausb:teslausb/TeslaCam -v --multi-thread-streams --no-update-modtime --partial-suffix .partial
# sudo umount /mnt/TeslaCam