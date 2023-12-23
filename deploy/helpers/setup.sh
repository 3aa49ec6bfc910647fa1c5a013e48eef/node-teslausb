sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/helpers/download-github-asset.sh)" -- setup.zip /bin/node-teslausb

echo "Running nodejs setup scripts..."
cd /bin/node-teslausb/build/setup && npm i --omit=dev && node .
