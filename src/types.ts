export {};

declare global {
  interface Window {
    mods: Promise<any[]>;
    packs: Promise<any[]>;
  }
}
