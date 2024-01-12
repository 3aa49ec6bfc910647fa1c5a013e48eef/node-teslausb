# sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/uninstall.sh)"

# This is not a full uninstall script, but it's a start

systemctl stop node-teslausb
systemctl disable node-teslausb
rm /etc/systemd/system/node-teslausb.service

systemctl stop node-teslausb-www
systemctl disable node-teslausb-www
rm /etc/systemd/system/node-teslausb-www.service

# Remove the worker
rm -rf /bin/node-teslausb

# Remove the worker config
rm -rf /etc/node-teslausb.json
