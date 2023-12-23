# sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/install-website.sh)"

sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/helpers/download-github-asset.sh)" -- website.zip /bin/node-teslausb

echo "Installing required modules for website... "
cd /bin/node-teslausb/build/website && npm i --omit=dev

cat << EOF > /lib/systemd/system/node-teslausb-www.service
[Unit]
Description=node-teslausb-www
DefaultDependencies=no

[Service]
Type=simple
Environment="PORT=80"
ExecStart=/usr/bin/node /bin/node-teslausb/build/website/index.js
WorkingDirectory=/bin/node-teslausb
StandardOutput=append:/logs/website.log
StandardError=inherit
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "Configuring website service..."

# Enable the service
systemctl enable node-teslausb-www.service

# Restart website (need to test whether this will just start if not running)
systemctl restart node-teslausb-www

# Refresh the systemd daemon
systemctl daemon-reload

echo "Website service configured"