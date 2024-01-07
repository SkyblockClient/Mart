export const map = (
  _mods: any[],
  _packs: any[],
  modsInstalled: string[],
  packsInstalled: string[]
) => {
  const bundles = [];
  const mods = [];
  const packs = [];

  for (const mod of _mods) {
    if (mod.hidden) continue;

    const base = {
      id: mod.id,
      title: mod.display,
      enabled: mod.enabled,
    };
    if (mod.packages) {
      const deps = [];
      deps.push({
        file: mod.file,
        url: mod.url,
      });
      for (const id of mod.packages) {
        const pkg = _mods.find((m) => m.id == id);
        deps.push({
          file: pkg.file,
          url: pkg.url,
        });
      }

      const isInstalled = deps.every((dep) => modsInstalled.includes(dep.file));

      bundles.push({
        ...base,
        installed: isInstalled,
        deps,
      });
    } else {
      mods.push({
        ...base,
        installed: modsInstalled.includes(mod.file),
        file: mod.file,
        url: mod.url,
      });
    }
  }

  for (const pack of _packs) {
    packs.push({
      id: pack.id,
      title: pack.display,
      enabled: pack.enabled,

      installed: packsInstalled.includes(pack.file),
      file: pack.file,
      url: pack.url,
    });
  }

  return {
    bundles,
    mods,
    packs,
  };
};
