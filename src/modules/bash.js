import { logWithTimestamp, errorWithTimestamp } from "./log";

// TODO: Fix stdout / stderr output in log files
const executeBashCommand = async (command) => {
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