cd /bin/node-teslausb/website
npm i
npm run build

cat << EOF > /lib/systemd/system/node-teslausb-www.service
[Unit]
Description=node-teslausb-www
DefaultDependencies=no

[Service]
Type=simple
ExecStartPre=/bin/sleep 10
ExecStart=/usr/bin/node /bin/node-teslausb/src/website/build/index.js
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
