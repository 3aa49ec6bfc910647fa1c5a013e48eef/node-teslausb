export const isDevMode = process.env.NODE_ENV === 'development';

export const logNameToPathMapping: { [key: string]: string } = {
    'rclone': isDevMode ? '/Users/blake/logs/rclone.log' : '/logs/rclone.log',
    'worker': '/logs/worker.log',
    'website': '/logs/website.log',
    'resources': '/logs/resources.log',
};