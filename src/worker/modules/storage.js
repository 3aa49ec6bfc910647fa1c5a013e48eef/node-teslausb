import { logWithTimestamp, errorWithTimestamp } from "./log.js"
import { executeBashCommand } from "./bash.js"

export const mountTeslaCamAsReadOnly = async () => {
    logWithTimestamp("Mounting TeslaCam as ro")
    await executeBashCommand("sudo mount -o ro /vusb/TeslaCam /mnt/TeslaCam && systemctl daemon-reload")
}

export const mountTeslaCamAsReadWrite = async () => {
    logWithTimestamp("Mounting TeslaCam as rw - this can corrupt data if also being written to the by the host")
    await executeBashCommand("sudo mount -o rw /vusb/TeslaCam /mnt/TeslaCam && systemctl daemon-reload")
}

export const unmountTeslaCam = async () => {
    logWithTimestamp("Unmounting TeslaCam")
    await executeBashCommand("sudo umount /mnt/TeslaCam && systemctl daemon-reload")
}

export const unmountUsbDriveFromHost = async () => {
    logWithTimestamp("Unmounting USB drive from host")
    await executeBashCommand("sudo rmmod g_mass_storage")
}

export const mountUsbDriveToHost = async () => {
    logWithTimestamp("Mounting USB drive to host")
    await executeBashCommand("sudo modprobe g_mass_storage file=/vusb/TeslaCam")
}

// Not in use - leaving for now as it may be useful later
// async function listFolderContents(folderPath, recursive = false) {
//     let entries = [];
//     try {
//         entries = await fspromises.readdir(folderPath, { withFileTypes: true });
//     } catch (error) {
//         return [];
//     }
//     let files = [];

//     for (const entry of entries) {
//         const entryPath = path.join(folderPath, entry.name);

//         if (entry.isDirectory()) {
//             if (recursive) {
//                 const subdirectoryFiles = await listFolderContents(entryPath, true);
//                 files = files.concat(subdirectoryFiles);
//             } else {
//                 files.push({ path: entryPath, type: 'directory' });
//             }
//         } else {
//             files.push({ path: entryPath, type: 'file' });
//         }
//     }

//     return files;
// }