# To run:
# cd /bin/node-teslausb/deploy && sudo chmod +x upgrade.sh && sudo ./upgrade.sh

cd /bin/node-teslausb
git fetch --all
git reset --hard origin/main

systemctl restart node-teslausb

# journalctl -u node-teslausb.service

# reboot
