
document.addEventListener("DOMContentLoaded", () => {

    const canvas = new fabric.Canvas('pointsOfInterest');
    canvas.setWidth(1024);
    canvas.setHeight(768);
    canvas.on('mouse:up', function (options) {
        console.log(options);
        const p = canvas.getPointer();
        const rect = new fabric.Circle({
            top: p.y,
            left: p.x,
            radius: 5,
            height: 5,
            fill: 'red',
        });
        canvas.add(rect);
    });

})