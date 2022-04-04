import os from 'os';
function getInfo() {
    const info = {
        args: process.argv.slice(2) != '' ? process.argv.slice(2) : 'No args',
        platform: process.platform,
        numCPUs: os.cpus().length,
        version: process.version,
        memoryReserved: parseFloat(
            process.memoryUsage().rss / (1024 * 1024)
        ).toFixed(2),
        execPath: process.execPath,
        pid: process.pid,
        cwd: process.cwd(),
    };
    return info;
}
export default getInfo;
