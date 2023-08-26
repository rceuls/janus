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
    const p = canvas.getPointer();
    console.log(p);
});

function createBlip(data) {
    const blip = new fabric.Circle({
        top: +data[9].split(",")[1],
        left: +data[9].split(",")[0],
        radius: 5,
        height: 5,
        fill: data[0]
    });
    console.log(blip);
    canvas.add(blip);
}

function resizeCanvas() {
    try {
        canvas.setHeight(window.innerHeight);
        canvas.setWidth(window.innerWidth);
        canvas.renderAll();
    }
    catch (e) {
        console.log(e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();

    const upload = document.getElementById("fileUpload");
    upload.addEventListener("change", (evt) => {
        var f = evt.target.files[0];
        console.log("hello");
        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                const lines = e.target.result.split("\n").slice(1);
                for (const l of lines) {
                    const parsed = l.split(";");
                    console.log(parsed);
                    createBlip(parsed);
                }
            };
            r.readAsText(f);
        } else {
            console.log("failed");
        }
    })

})