import fs from 'fs';
import ini from 'ini';
import { exec } from 'child_process';

const setPermissions = (accessLevel = 755, path = '/etc/rc.local') => {
    const command = `sudo chmod ${accessLevel} ${path}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }

        console.log(`Permissions set successfully: ${stdout}`);
    });
};

const addDtOverlayToBootConfig = () => {
    const bootConfigPath = '/boot/config.txt';

    // Read the contents of the file
    const configContent = fs.readFileSync(bootConfigPath, 'utf-8');

    // Parse the INI content
    const config = ini.parse(configContent);

    // Check if the 'dtoverlay=dwc2' line exists under the [all] heading
    const allSection = config.all || {};
    const existingLine = allSection['dtoverlay'] === 'dwc2';

    if (!existingLine) {
        // Add the line if it doesn't exist
        if (!allSection['dtoverlay']) {
            allSection['dtoverlay'] = 'dwc2';
        } else {
            allSection['dtoverlay'] += ',dwc2';
        }

        // Convert the updated configuration back to INI format
        const updatedConfigContent = ini.stringify(config);

        // Write the updated content back to the file
        fs.writeFileSync(bootConfigPath, updatedConfigContent, 'utf-8');

        console.log('dtoverlay=dwc2 added to /boot/config.txt');
    } else {
        console.log('dtoverlay=dwc2 already exists in /boot/config.txt');
    }
};

// TODO: Add validation so this will only be added if it doesn't already exist
const addModProbeToRcLocal = () => {
    const filePath = '/etc/rc.local';

    try {
        // Read the current contents of rc.local
        let rcLocalContent = fs.readFileSync(filePath, 'utf-8');

        // Find the last occurrence of "exit 0" and insert the modprobe line above it
        const modProbeLine = 'modprobe g_mass_storage file=/vusb/TeslaCam &';
        rcLocalContent = rcLocalContent.replace(/exit 0(?!.*exit 0)/s, `${modProbeLine}\nexit 0`);

        // Write the modified content back to rc.local
        fs.writeFileSync(filePath, rcLocalContent, 'utf-8');

        console.log('modprobe line added to rc.local successfully.');
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

addDtOverlayToBootConfig();
addModProbeToRcLocal();
setPermissions();

