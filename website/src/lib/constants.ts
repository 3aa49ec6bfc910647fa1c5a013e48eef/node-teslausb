export const isDevMode = process.env.NODE_ENV === 'development';

export const logNameToPathMapping: { [key: string]: string } = {
    'rclone': isDevMode ? '/Users/blake/logs/rclone.log' : '/logs/rclone.log',
    'worker': '/logs/worker.log',
    'website': '/logs/website.log',
    'resources': '/logs/resources.log',
};

export const configNameToPathMapping: { [key: string]: string } = {
    'rclone': isDevMode ? '/Users/blake/logs/rclone.log' : '/root/.config/rclone/rclone.conf',
    'node-teslausb': isDevMode ? '/Users/blake/config/node-teslausb.json' : '/config/node-teslausb.json',
};