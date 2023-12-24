# node-teslausb

**This project was inspired by [teslausb](https://github.com/marcone/teslausb)**.

**node-teslausb in its current form it has far less functionality than teslausb**.  However it is intended to be an easily extensible solution, orchestrated by [Node.js](https://nodejs.org/en) and more features will be added over time.  It should be noted that there is only limited hardware support with [Raspberry Pi Zero 2 W](https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/) being the only supported device.

## Installation

### Pre-requisites:

1. Raspberry Pi Zero 2 W (128GB SD card recommended).
2. Any OS default image should work, but limited testing has occurred and only with [2023-12-11-raspios-bookworm-arm64-lite.img](https://downloads.raspberrypi.com/raspios_lite_arm64/images/raspios_lite_arm64-2023-12-11/2023-12-11-raspios-bookworm-arm64-lite.img.xz).
* _Install and run [Raspberry Pi Imager](https://www.raspberrypi.com/software/)_
* _Select 'Raspberry Pi Zero 2 W' as device and then 'Use custom' for Operating System_
* _Choose the 2023-12-11-raspios-bookworm-arm64-lite.img image_
* _Select your storage device_
3. SSH and wifi enabled.
* _Configure SSH as well as the device name (e.g. node-teslausb.local) and your wifi network settings before writing to SD card (note: I had a lot of issues with password authentication and had to use a SSH key in order to login)_
4. Once you have booted the device, install ```rclone``` via ```apt install rclone``` and configure it with a profile named node-teslausb (```rclone config```). Test that your config is working using ```rclone mkdir node-teslausb:TeslaCam```).

```
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/install.sh)"
```

## Upgrading to the latest version

```
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/upgrade.sh)"
```

## To-do

- [ ] Perform some actual testing to validate that it works and works reliably
- [x] Add support for using rclone providers other than SMB
- [ ] Provide validation of rclone config during setup
- [x] Migrate from Javascript to TypeScript
- [x] Fix project structure
- [x] Clean up the install process
- [x] Clean up the configuration process
- [x] Package the project
- [ ] Package the project properly
- [ ] Add lifecycle management for destination (retention policy etc)
- [ ] Add web server for configuration (managing rclone, network settings), status (system, network, copy, usb host) and statistics (uptime, copy, storage)
- [ ] Add functionality to handle scenarios such as keeping car awake for transfers
- [ ] Add hotspot functionality to allow devices to connect to the device and browse the SD card using samba
- [ ] Add support for secondary wifi networks (e.g. so that it can be hot-spotted to a phone while away from home network)
- [ ] Get all relevant information included in logs
- [ ] Backup and restore config
- [ ] Flash LED to represent different states
- [x] Add support for saving lock chimes
