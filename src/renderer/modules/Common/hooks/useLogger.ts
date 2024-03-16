// debug.enable("*");
// debug.disable();

export function useLogger(ns: string) {
  // const log = debug(ns);
  // const warn = debug(ns);
  // const info = debug(ns);

  // warn.log = console.warn.bind(console);
  // info.log = console.info.bind(console);

  // if (isDev)

  return { log: console.log, warn: console.warn, info: console.info };
}
