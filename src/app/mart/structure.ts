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

    const categories = [];
    if (mod.enabled) {
      categories.push("Defaults");
    }
    if (mod.categories) {
      if (mod.categories.includes("2;All Skyblock"))
        categories.push("Skyblock");
      if (mod.categories.includes("4;Recommended Skyblock"))
        categories.push("Recommended Skyblock");
      if (mod.categories.includes("5;All PvP")) categories.push("PvP");
      if (mod.categories.includes("6;Recommended PvP"))
        categories.push("Recommended PvP");
    }

    const base = {
      id: mod.id,
      title: mod.display,
      categories,
    };
    if (mod.packages) {
      const deps = [];
      deps.push({
        file: mod.file,
        url: mod.url,
        installed: modsInstalled.has(mod.file),
      });
      for (const id of mod.packages) {
        const pkg = _mods.find((m) => m.id == id);
        deps.push({
          file: pkg.file,
          url: pkg.url,
          installed: modsInstalled.has(pkg.file),
        });
      }

      const isInstalled = deps.every((dep) => dep.installed);

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
    const categories = [];
    if (pack.enabled) {
      categories.push("Defaults");
    }
    if (pack.categories) {
      if (pack.categories.includes("1;All Skyblock"))
        categories.push("Skyblock");
      if (pack.categories.includes("2;Recommended SkyBlock"))
        categories.push("Recommended Skyblock");
      if (pack.categories.includes("3;All PvP")) categories.push("PvP");
      if (pack.categories.includes("4;Recommended PvP"))
        categories.push("Recommended PvP");
    }

    packs.push({
      id: pack.id,
      title: pack.display,
      categories,

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
