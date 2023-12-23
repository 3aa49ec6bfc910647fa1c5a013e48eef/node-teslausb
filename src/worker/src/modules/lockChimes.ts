import { logWithTimestamp } from "./log.js";
import { mountTeslaCamAsReadWrite, mountUsbDriveToHost, unmountTeslaCam, unmountUsbDriveFromHost, runFskOnVirtualDisk } from "./storage.js";
import { executeBashCommand } from "./bash.js";
import fs from 'fs';

export const checkLockChime = async () => {
    const configPath = '/tmp/LockChime.wav';
    if (fs.existsSync(configPath) === false) return

    logWithTimestamp(`LockChime.wav found, installing...`)
    await installLockChime();

    logWithTimestamp(`LockChime.wav installed, removing /tmp/LockChime.wav...`)
    await executeBashCommand(`rm /tmp/LockChime.wav`)

    logWithTimestamp(`LockChime.wav removed.`)

}

const installLockChime = async () => {
    await unmountTeslaCam();
    await unmountUsbDriveFromHost();
    await mountTeslaCamAsReadWrite();
    logWithTimestamp(`Copying LockChime.wav to USB drive`)
    await executeBashCommand(`cp /tmp/LockChime.wav /mnt/TeslaCam/LockChime.wav && chmod 777 /mnt/TeslaCam/LockChime.wav`)
    await unmountTeslaCam();
    await runFskOnVirtualDisk();
    await mountUsbDriveToHost();
}