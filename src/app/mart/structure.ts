export const map = (
  _mods: any[],
  _packs: any[],
  modsInstalled: Set<string>,
  packsInstalled: Set<string>
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

      const isInstalled = deps.every((dep) => modsInstalled.has(dep.file));

      bundles.push({
        ...base,
        installed: isInstalled,
        deps,
      });
    } else {
      mods.push({
        ...base,
        installed: modsInstalled.has(mod.file),
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

      installed: packsInstalled.has(pack.file),
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
