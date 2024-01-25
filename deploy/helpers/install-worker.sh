# sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/helper/install-worker.sh)"

sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/helpers/download-github-asset.sh)" -- worker.zip /bin/node-teslausb

echo "Installing required modules for worker..."
cd /bin/node-teslausb/build/worker && npm i --omit=dev

cat << EOF > /lib/systemd/system/node-teslausb.service
[Unit]
Description=node-teslausb
DefaultDependencies=no

[Service]
Type=simple
ExecStartPre=/bin/sleep 10
ExecStart=/usr/bin/node --max-old-space-size=200 /bin/node-teslausb/build/worker/index.js
WorkingDirectory=/bin/node-teslausb
StandardOutput=append:/logs/worker.log
StandardError=inherit
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "Configuring worker service..."

# Enable the service
systemctl enable node-teslausb.service

# Restart website (need to test whether this will just start if not running)
systemctl restart node-teslausb

# Refresh the systemd daemon
systemctl daemon-reload

echo "Worker service configured"