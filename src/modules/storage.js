import { logWithTimestamp, errorWithTimestamp } from "./log"
import { executeBashCommand } from "./bash"

export const mountTeslaCamAsReadOnly = async () => {
    logWithTimestamp("Mounting TeslaCam")
    await executeBashCommand("sudo mount -o ro /vusb/TeslaCam /mnt/TeslaCam && systemctl daemon-reload")
}

export const unmountTeslaCam = async () => {
    logWithTimestamp("Unmounting TeslaCam")
    await executeBashCommand("sudo umount /mnt/TeslaCam && systemctl daemon-reload")
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