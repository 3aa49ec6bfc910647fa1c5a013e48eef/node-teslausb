# To run:
# cd /bin/node-teslausb/deploy && sudo chmod +x upgrade.sh && sudo ./upgrade.sh
# Alternatively:
# sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/upgrade.sh)"

cd /bin/node-teslausb
git fetch --all
git reset --hard origin/main

systemctl restart node-teslausb

# journalctl -u node-teslausb.service

# reboot
