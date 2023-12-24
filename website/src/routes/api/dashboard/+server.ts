import { json, text } from '@sveltejs/kit';
import { exec } from 'child_process';
import { promisify } from 'util';

export async function GET({ request }) {
	const uptime = await getOperatingSystemUptime();
	const lastRcloneLogEntry = await getLastRcloneLogEntry();
	return json({ uptime, lastRcloneLogEntry });
}

const isDevMode = process.env.NODE_ENV === 'development';

const execAsync = promisify(exec);

const getOperatingSystemUptime = async (): Promise<string> => {
	if (isDevMode) return "1 day, 2 hours, 3 minutes";
	const { stdout } = await execAsync('uptime -p');
	return stdout.replace("up ", "").trim();
};

const getLastRcloneLogEntry = async (): Promise<string> => {
	if (isDevMode) return "2021/09/05 21:45:00 INFO  : Local file system at /Users/blake/Downloads: Waiting for checks to finish";
	const { stdout } = await execAsync('tail -n 1 /logs/rclone.log');
	return stdout.trim();
}

interface DashboardData {
	uptime: string;
	lastRcloneLogEntry: string;
}