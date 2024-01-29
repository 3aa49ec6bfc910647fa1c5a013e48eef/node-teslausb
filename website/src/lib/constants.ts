export const isDevMode = process.env.NODE_ENV === 'development';

export const logNameToPathMapping: { [key: string]: string } = {
    'worker': '/logs/worker.log',
    'rclone': isDevMode ? '~/logs/rclone.log' : '/logs/rclone.log',
    'website': '/logs/website.log',
    'resources': '/logs/resources.log',
};

export const configNameToPathMapping: { [key: string]: string } = {
    'rclone': isDevMode ? '~/logs/rclone.log' : '/root/.config/rclone/rclone.conf',
    'node-teslausb': isDevMode ? '~/etc/node-teslausb.json' : '/etc/node-teslausb/node-teslausb.json',
};