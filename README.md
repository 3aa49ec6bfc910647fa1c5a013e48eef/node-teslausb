# node-teslausb

**This project was inspired by [teslausb](https://github.com/cimryan/teslausb/tree/master)**.

**node-teslausb in its current form it has far less functionality than teslausb**.  However it is intended to be an easily extensible solution, orchestrated by [Node.js](https://nodejs.org/en) and more features will be added over time.  It should be noted that there is only limited hardware support with [Raspberry Pi Zero 2 W](https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/) being the only supported device.

**Warning, this is pre-alpha - use at your own risk, it has undergone very limited testing**

## Installation

### Pre-requisites:

1. Raspberry Pi Zero 2 W (128GB SD card recommended).
2. Any OS default image should work, but limited testing has occurred and only with [2023-12-11-raspios-bookworm-arm64-lite.img](https://downloads.raspberrypi.com/raspios_lite_arm64/images/raspios_lite_arm64-2023-12-11/2023-12-11-raspios-bookworm-arm64-lite.img.xz).
3. SSH access enabled.
4. ```rclone``` installed and configured with a profile named node-teslausb (test that your config is working using ```rclone mkdir node-teslausb:TeslaCam```).

```
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/install.sh)"
```

## Upgrading to the latest version

```
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/upgrade.sh)"
```

## To-do

- [ ] Perform some more extensive testing to validate that it works and works reliably
- [ ] Add support for using rclone providers other than SMB
- [ ] Provide validation of rclone config during setup
- [ ] Delete files at source once copied
- [ ] Migrate from Javascript to TypeScript
- [ ] Fix project structure
- [ ] Clean up the install and configuration process
- [ ] Package the project properly (e.g. NPM)
- [ ] Add web server for configuration, status and statistics
- [ ] Add functionality to handle scenarios such as keeping car awake for transfers
- [ ] Add hotspot functionality to allow devices to connect to the device and browse the SD card using samba
- [ ] Add support for secondary wifi networks (e.g. so that it can be hot-spotted to a phone while away from home network)
- [ ] Get all relevant information included in logs
