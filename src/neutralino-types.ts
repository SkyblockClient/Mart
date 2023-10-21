/** Basic authentication token */
declare const NL_TOKEN: string;

/** Operating system name: Linux, Windows, or Darwin */
declare const NL_OS: "Linux" | "Windows" | "Darwin";

/** Application identifier */
declare const NL_APPID: string;

/** Application port */
declare const NL_PORT: number;

/** Mode of the application: window, browser, or cloud */
declare const NL_MODE: "window" | "browser" | "cloud";

/** Neutralinojs server version */
declare const NL_VERSION: string;

/** Neutralinojs client version */
declare const NL_CVERSION: "3.12.0";

/** Current working directory */
declare const NL_CWD: string;

/** Application path */
declare const NL_PATH: string;

/** Command-line arguments */
declare const NL_ARGS: string[];

/** Current process's identifier */
declare const NL_PID: number;

/** Release commit of the client library */
declare const NL_CCOMMIT: string;

/** An array of custom methods */
declare const NL_CMETHODS: string[];
