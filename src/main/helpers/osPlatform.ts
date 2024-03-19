const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isLinux = process.platform === "linux";

export const osPlatform = { isLinux, isMac, isWindows };
