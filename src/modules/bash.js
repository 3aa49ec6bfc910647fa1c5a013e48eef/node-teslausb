import { logWithTimestamp, errorWithTimestamp } from "./log.js";
import util from 'util';
import { exec } from 'child_process';

// TODO: Fix stdout / stderr output in log files
export const executeBashCommand = async (command) => {
    try {
        const { stdout, stderr } = await util.promisify(exec)(command);
        logWithTimestamp(`stdout: ${stdout}`);

        if (stderr) {
            errorWithTimestamp(`stderr: ${stderr}`);
        }

        return stdout;
    } catch (error) {
        errorWithTimestamp(`Error: ${error.message}`);
        throw error;
    }
};