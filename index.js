


document.addEventListener("DOMContentLoaded", () => {


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