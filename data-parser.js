function getBranch(tree, zone, flatStructure, iter) {
    const relevantChildren = flatStructure.filter(x => x['zone'] === zone);
    const zoneReformatted = `${zone},`;
    const relevantChildrenWithChildren = flatStructure.filter(x => x['zone'].startsWith(zoneReformatted));
    const rootZones = Array.from(new Set(relevantChildrenWithChildren
        .filter(x => Array.from(x["zone"]).filter(z => z === ",").length == iter && x["zone"].startsWith(zoneReformatted))
        .map(x => x['zone'])));

    for (const rz of rootZones) {
        const branch = getBranch(tree, rz, flatStructure, iter + 1);
        relevantChildren.push({
            zone: rz.includes(",") ? rz.split(",").slice(-1) : rz,
            id: `zone_${rz}`,
            "_children": branch,
            searcher: branch.map(x => x.searcher).join(",")
        })
    }
    return relevantChildren;
}

export function getTreeDataStructure(flatStructure) {
    const rootZones = Array.from(new Set(flatStructure.map(x => x["zone"].split(",")[0])));
    const tree = [];
    for (const zone of rootZones) {
        const branch = getBranch(tree, zone, flatStructure, 1);
        tree.push({
            zone: zone,
            id: `zone_${zone}`,
            "_children": branch,
            searcher: branch.map(x => x.searcher).join(",")
        });
    }
    return tree;
}