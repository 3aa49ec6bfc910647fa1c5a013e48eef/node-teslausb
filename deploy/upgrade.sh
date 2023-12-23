# To run:
# cd /bin/node-teslausb/deploy && sudo chmod +x upgrade.sh && sudo ./upgrade.sh
# Alternatively:
# sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/upgrade.sh)"

cd /bin/node-teslausb
git fetch --all
git reset --hard origin/main

# Get worker build
USER="3aa49ec6bfc910647fa1c5a013e48eef"
REPO="node-teslausb"
FILENAME="worker.zip"

# Fetch the latest release asset URL
ASSET_URL=$(curl -s https://api.github.com/repos/$USER/$REPO/releases/latest \
| jq -r ".assets[] | select(.name == \"$FILENAME\") | .browser_download_url")

# Check if the URL is valid
if [ -z "$ASSET_URL" ]; then
    echo "Asset URL not found."
    exit 1
fi

# Download the file to /tmp/worker.zip
echo "Downloading worker.zip..."
curl -L $ASSET_URL -o /tmp/worker.zip

# Remove existing worker directory
sudo rm -rf /bin/node-teslausb/build/worker

# Extract the file to /bin/node-teslausb/build/worker (this is risky to unzip to root, fix later)
unzip -o /tmp/worker.zip -d /bin/node-teslausb

# Install required modules for worker
cd /bin/node-teslausb/build/worker && npm i --production

cat << EOF > /lib/systemd/system/node-teslausb.service
[Unit]
Description=node-teslausb
DefaultDependencies=no

[Service]
Type=simple
ExecStartPre=/bin/sleep 10
ExecStart=/usr/bin/node /bin/node-teslausb/build/worker/index.js
WorkingDirectory=/bin/node-teslausb
StandardOutput=append:/logs/worker.log
StandardError=inherit
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Install website
sudo chmod +x /bin/node-teslausb/deploy/install-website.sh && sudo /bin/node-teslausb/deploy/install-website.sh

systemctl daemon-reload

echo "Restarting node-teslausb service..."
systemctl restart node-teslausb

echo "Restarting node-teslausb-www service..."
systemctl restart node-teslausb-www

# journalctl -u node-teslausb.service

# reboot
