const canvas = new fabric.Canvas('poiMap',
    {
        allowTouchScrolling: true,
        height: 600,
        width: 800,
        // backgroundImage: "./middle-earth.webp"
        backgroundColor: 'pink'
    });

const groups = {};
var tabledata = [];
var table = undefined;

canvas.on('mouse:wheel', function (opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();

})

canvas.on('mouse:down', function (opt) {
    var evt = opt.e;
    if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
    }
});

canvas.on('mouse:move', function (opt) {
    if (this.isDragging) {
        var e = opt.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
    }
});

canvas.on('mouse:up', function (opt) {
    // on mouse up we want to recalculate new interaction
    // for all objects, so we call setViewportTransform
    this.setViewportTransform(this.viewportTransform);
    this.isDragging = false;
    this.selection = true;
});


function getTextColor(surroundingColor) {
    if (['yellow'].includes(surroundingColor)) {
        return 'black';
    } else {
        return 'white';
    }
}

function createBlip(data, ix) {
    const blip = new fabric.Rect({
        width: 10,
        height: 10,
        originX: 'center',
        originY: 'center',
        fill: data[0],
        hasBorders: false,
        hasControls: false
    });
    var text = new fabric.Text(data[2].substring(0, 2), {
        fontFamily: 'Calibri',
        fontSize: 5,
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        fill: getTextColor(data[0]),
        hasBorders: false,
        hasControls: false
    });
    const group = new fabric.Group([blip, text], {
        top: +data[9].split(",")[1],
        left: +data[9].split(",")[0],
    })
    group.on('mousedown', () => {
        updateInfoBox(ix);
    })
    groups[`${ix}`] = group;
    canvas.add(group);
}

function animate(target, dir) {
    const minScale = 1;
    const maxScale = 3;

    return new Promise(resolve => {
        target.animate({
            scaleX: dir ? maxScale : minScale,
            scaleY: dir ? maxScale : minScale
        }, {
            easing: fabric.util.ease.easeOutCubic,
            duration: 2000,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: function () {
                animate(target, 0)
            }

        });
    });
}

function updateInfoBox(id) {
    const item = tabledata.find(x => x.id === id);
    document.getElementById("infoCode").innerText = item['code'];
    document.getElementById("infoLocation").innerText = item['location'];
    document.getElementById("infoOrg").innerText = item['org'];
    document.getElementById("infoHours").innerText = item['hours'];

    const respNames = item['responsible'].split(",");
    const respPhones = item['phone'].split(",");
    const respCallSigns = item['callsign'].split(",");
    const respFull = [];

    for (var i = 0; i < respNames.length; i++) {
        respFull.push(`${respNames[i]} (${respPhones[i]} - ${respCallSigns[i]})`)
    }

    document.getElementById('infoResp').innerText = respFull.join("\n")

}

function customFilter(data, filterParams) {
    const filter = filterParams.filter;
    return data.searcher.includes(filter.toLocaleLowerCase());
}

function onCellClick(e, cell) {
    const id = cell.getRow(cell).getData()['id'];
    animate(groups[`${id}`], 1)
    updateInfoBox(id);
}

document.addEventListener("DOMContentLoaded", () => {
    const upload = document.getElementById("fileUpload");
    const filter = document.getElementById("filterValue");
    const filterReset = document.getElementById("filterClear");

    filter.onkeyup = (e) => {
        if (table) {
            table.setFilter(customFilter, { filter: e.target.value });
        }
    };
    filterReset.onclick = (e) => {
        if (table) {
            table.clearFilter();
        }
        filter.value = ""
    }

    upload.addEventListener("change", (evt) => {
        var f = evt.target.files[0];
        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                const lines = e.target.result.split("\n").slice(1);
                let ix = 0;
                tabledata = [];
                for (const l of lines) {
                    const parsed = l.split(";");
                    createBlip(parsed, ix);
                    tabledata.push({
                        color: parsed[0],
                        zone: parsed[1],
                        code: parsed[2],
                        location: parsed[3],
                        org: parsed[4],
                        hours: parsed[5],
                        responsible: parsed[6],
                        phone: parsed[7],
                        callsign: parsed[8],
                        id: ix,
                        searcher: l.toLocaleLowerCase()
                    });
                    ix += 1;
                }

                //initialize table
                table = new Tabulator("#poiTable", {
                    data: tabledata,
                    autoColumns: false,
                    selectable: 1,
                    filtColumns: true,
                    columns: [
                        { title: "Code", field: "code", sorter: "string", cellClick: onCellClick },
                        { title: "Zone", field: "zone", sorter: "string", cellClick: onCellClick },
                        { title: "Organisatie", field: "org", sorter: "string", cellClick: onCellClick },
                        { title: "Responsible", field: "responsible", sorter: "string", cellClick: onCellClick },
                    ],
                });

            };
            r.readAsText(f);
        } else {
            console.log("failed");
        }
    })

})