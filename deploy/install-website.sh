# sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/install-website.sh)"

cd /bin/node-teslausb/src/website
npm i
npm run build

cat << EOF > /lib/systemd/system/node-teslausb-www.service
[Unit]
Description=node-teslausb-www
DefaultDependencies=no

[Service]
Type=simple
ExecStart=PORT=80 /usr/bin/node /bin/node-teslausb/build/website/index.js
WorkingDirectory=/bin/node-teslausb
StandardOutput=append:/logs/node-teslausb-www.log
StandardError=inherit
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
systemctl enable node-teslausb-www.service
# Not sure if this next line is needed
systemctl start node-teslausb-www.service

# Refresh the systemd daemon
systemctl daemon-reload
