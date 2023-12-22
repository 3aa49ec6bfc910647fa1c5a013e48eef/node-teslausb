# sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/install-website.sh)"

# cd /bin/node-teslausb/src/website
# npm i
# npm run build

USER="3aa49ec6bfc910647fa1c5a013e48eef"
REPO="node-teslausb"
FILENAME="website.zip"

# Fetch the latest release asset URL
ASSET_URL=$(curl -s https://api.github.com/repos/$USER/$REPO/releases/latest \
| jq -r ".assets[] | select(.name == \"$FILENAME\") | .browser_download_url")

# Check if the URL is valid
if [ -z "$ASSET_URL" ]; then
    echo "Asset URL not found."
    exit 1
fi

# Download the file to /tmp/website.zip
curl -L $ASSET_URL -o /tmp/website.zip

# Remove existing website directory
sudo rm -rf /bin/node-teslausb/build/website

# Extract the file to /bin/node-teslausb/build/website (this is risky to unzip to root, fix later)
unzip -o /tmp/website.zip -d /bin/node-teslausb

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

cat << EOF >> /bin/node-teslausb/build/website/package.json
{
  "name": "website",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cheerio": "^1.0.0-rc.12"
  }
}
EOF

cd /bin/node-teslausb/build/website
npm i

# Enable the service
systemctl enable node-teslausb-www.service

# Restart website (need to test whether this will just start if not running)
systemctl restart node-teslausb-www

# Refresh the systemd daemon
systemctl daemon-reload
