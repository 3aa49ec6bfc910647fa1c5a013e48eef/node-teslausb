#!/bin/bash

# Assign parameters to variables
FILENAME=$1
TARGET_DIR=$2

# Check if both arguments are provided
if [ -z "$FILENAME" ] || [ -z "$TARGET_DIR" ]; then
    echo "Usage: $0 <filename> <target-directory>"
    exit 1
fi

USER="3aa49ec6bfc910647fa1c5a013e48eef"
REPO="node-teslausb"

echo "Downloading $FILENAME and extracting to $TARGET_DIR"

# Fetch the latest release asset URL
ASSET_URL=$(curl -s https://api.github.com/repos/$USER/$REPO/releases/latest \
| jq -r ".assets[] | select(.name == \"$FILENAME\") | .browser_download_url")

# Check if the URL is valid
if [ -z "$ASSET_URL" ]; then
    echo "Asset URL not found."
    exit 1
fi

# Download the file to /tmp/website.zip
curl -L $ASSET_URL -o /tmp/$FILENAME

# Extract the file to /bin/node-teslausb/build/website (this is risky to unzip to root, fix later)
unzip -o /tmp/$FILENAME -d $TARGET_DIR