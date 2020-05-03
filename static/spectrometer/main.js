const canvasParams = {
    widthpx: 800, 
    heightpx: 400,
    physicalWidth: 0.006, // м
    physicalHeight: 0.003,  // м
    xLines: 4, 
    yLines: 5
}

const aem = 1.66e-27; // Кг
const B = 0.1; // Тл
const dt= 10e-9;

const particle = {
    m: 20 * aem, // Кг
    q: 1.6e-19, // Кл
    ux: 0, // м/c
    uy: 1e3, // м/с,
    x: 0,
    y: 0,
}

/**
 * Return all points
 * @param particle 
 */
function calculatePoints({q, uy, ux, x, y, m}) {
    const points = []; // [[x, y], ...]
    points.push([x, y]);
    while (y >= 0) {
        const dux = q * uy * B * dt / m;
        const duy = -q * ux * B * dt / m;

        x += ux * dt;
        y += uy * dt;

        ux += dux;
        uy += duy;

        points.push([x, y]);
    }

    return points;
}



function drawLines(points, {widthpx, heightpx, physicalWidth, physicalHeight}) {
    const color = randomColor({luminosity: 'bright'});

    for (let i = 1; i < points.length; i++){
        const x1 = points[i - 1][0] / physicalWidth * widthpx,
        y1 = heightpx - points[i - 1][1] / physicalHeight * heightpx,
        x2 = points[i][0] / physicalWidth * widthpx,
        y2 = heightpx - points[i][1] / physicalHeight * heightpx;
        
        const canvas = document.querySelector("#canvas");
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color;
        ctx.closePath();
        ctx.stroke();

    }
}

function drawGrid({physicalHeight: height, physicalWidth: width, widthpx, heightpx}) {
    var canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, widthpx, heightpx);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "grey";

    for (let i = 1; i < 5; i++){
        const numberToPlace = +(height - height * i / 5).toFixed(6);
        ctx.fillRect(0, heightpx * i / 5, widthpx, 1);
        ctx.fillText(numberToPlace.toString() + ' м', 3, heightpx*i/5 -3);
    }
    for (let i = 1; i < 5; i++){
        const numberToPlace = +(width * i / 5).toFixed(6);
        ctx.fillRect(widthpx * i / 5, 0, 1, heightpx);
        ctx.fillText(numberToPlace.toString() + ' м', widthpx * i / 5 + 3, heightpx - 3);
    }
}


function main() {
    drawGrid(canvasParams);

    for (let i = 20; i < 25; i++) {
        particle.m = i * aem;

        const points = calculatePoints(particle);

        drawLines(points, canvasParams);
    }
}

main();