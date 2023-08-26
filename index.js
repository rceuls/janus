const PEOPLE_HOBBITS = 'hobbits';
const PEOPLE_ELVES = 'elves';
const PEOPLE_DWARVES = 'dwarves';
const PEOPLE_DRUEDAIN = 'druedain';

const people_poi = {};

function getCheckedPeople() {
    const peoples = (document.getElementsByName("people") ?? [])
    for (let p of peoples) {
        if (p.checked) {
            return p.id;
        }
    }
    return undefined;
}

function getColor() {
    switch (getCheckedPeople()) {
        case PEOPLE_HOBBITS:
            return "pink";
        case PEOPLE_DRUEDAIN:
            return "darkcyan";
        case PEOPLE_ELVES:
            return "aquamarine"
        case PEOPLE_DWARVES:
            return "red"
        default:
            return "white"
    }
}

const canvas = new fabric.Canvas('pointsOfInterest',
    {
        allowTouchScrolling: true,
        backgroundImage: "./middle-earth.webp"
    });

canvas.on('mouse:wheel', function (opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.setZoom(zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
})

canvas.on('mouse:up', function (options) {
    console.log(options);
    const color = getColor();
    const p = canvas.getPointer();
    const rect = new fabric.Circle({
        top: p.y,
        left: p.x,
        radius: 5,
        height: 5,
        fill: color,
    });
    canvas.add(rect);
    const checked = getCheckedPeople();
    if (checked) {
        if (checked in people_poi) {
            canvas.remove(people_poi[checked])
        }
        people_poi[checked] = rect;
    }

});

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.setHeight(window.innerHeight);
    canvas.setWidth(window.innerWidth);
    canvas.renderAll();
}


document.addEventListener("DOMContentLoaded", () => {
    resizeCanvas();



})