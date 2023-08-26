const canvas = new fabric.Canvas('pointsOfInterest',
    {
        allowTouchScrolling: true,
        // backgroundImage: "./middle-earth.webp"
        backgroundColor: 'pink'
    });



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

function createBlip(data) {
    const blip = new fabric.Rect({
        width: 10,
        height: 10,
        originX: 'center',
        originY: 'center',
        fill: data[0]
    });
    var text = new fabric.Text(data[2], {
        fontFamily: 'Calibri',
        fontSize: 5,
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        fill: getTextColor(data[0])
    });
    const group = new fabric.Group([blip, text], {
        top: +data[9].split(",")[1],
        left: +data[9].split(",")[0],
    })
    console.log(group);
    canvas.add(group);
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