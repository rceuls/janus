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

document.addEventListener("DOMContentLoaded", () => {
    const pointsOfInterests = [];

    const image = document.getElementById("coveredImage");
    console.log({ image })

    const canvas = new fabric.Canvas('pointsOfInterest',
        {
            height: image.clientHeight,
            width: image.clientWidth,
            allowTouchScrolling: true
        });


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

})