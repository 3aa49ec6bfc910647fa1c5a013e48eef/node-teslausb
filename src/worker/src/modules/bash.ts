import { logWithTimestamp, errorWithTimestamp } from "./log.js";
import util from 'util';
import { exec } from 'child_process';

// TODO: Fix stdout / stderr output in log files
export const executeBashCommand = async (command, outputToConsole = true) => {
    try {
        const { stdout, stderr } = await util.promisify(exec)(command);
        if (stdout && outputToConsole) {
            logWithTimestamp(`stdout: ${stdout}`);
        }

        if (stderr && outputToConsole) {
            errorWithTimestamp(`stderr: ${stderr}`);
        }

        return stdout;
    } catch (error) {
        if (outputToConsole) {
            errorWithTimestamp(`Error: ${error.message}`);
        }
        throw error;
    }
};