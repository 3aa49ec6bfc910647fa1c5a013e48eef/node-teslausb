# To run:
# cd /bin/node-teslausb/deploy && sudo chmod +x upgrade.sh && sudo ./upgrade.sh
# Alternatively:
# sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/upgrade.sh)"

cd /bin/node-teslausb
git fetch --all
git reset --hard origin/main
cd /bin/node-teslausb/src/worker && npm i

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

echo "Restarting node-teslausb service..."

systemctl restart node-teslausb

# journalctl -u node-teslausb.service

# reboot
