function getBranch(tree, zone, flatStructure, iter) {
    const relevantChildren = flatStructure.filter(x => x['zone'] === zone);
    const zoneReformatted = `${zone},`;
    const relevantChildrenWithChildren = flatStructure.filter(x => x['zone'].startsWith(zoneReformatted));
    const rootZones = Array.from(new Set(relevantChildrenWithChildren
        .filter(x => Array.from(x["zone"]).filter(z => z === ",").length == iter && x["zone"].startsWith(zoneReformatted))
        .map(x => x['zone'])));

    for (const rz of rootZones) {
        relevantChildren.push({
            zone: rz.includes(",") ? rz.split(",").slice(-1) : rz,
            id: `zone_${rz}`,
            "_children": getBranch(tree, rz, flatStructure, iter + 1),
            searcher: rz.toLocaleLowerCase()
        })
    }
    return relevantChildren;
}

export function getTreeDataStructure(flatStructure) {
    const rootZones = Array.from(new Set(flatStructure.map(x => x["zone"].split(",")[0])));
    const tree = [];
    for (const zone of rootZones) {
        tree.push({
            zone: zone,
            id: `zone_${zone}`,
            "_children": getBranch(tree, zone, flatStructure, 1),
            searcher: zone.toLocaleLowerCase()
        });
    }
    return tree;
}