/**
 * Constants. TODO custom input
 */
const canvas = document.querySelector('.canvas');

const canvasParams = {
    widthpx: 800, 
    heightpx: 400,
    physicalWidth: 2e-13, 
    physicalHeight: 2e-13, 
    xLines: 4, 
    yLines: 5, 
    negativeY: 0,
    negativeX: 0
}

const static = {
    e: 1.6e-19,
    dt: 1e-23,
    e0: 8.85418781762039e-12,
    pie: 2.7816251377400302e-11
}

const gold = {
    y: 1e-13,
    x: 1e-13,
    q: 79 * static.e,
}

const particle = {
    y: 1e-14 + 1e-13,
    x: 0,
    Ux: 1e7,
    Uy: 0,
    m: 6.642156264e-27,
    q: 2 * static.e
}

function isInArea(x, y){
    return x >= canvasParams.negativeX && x <= canvasParams.physicalWidth 
        && y >= canvasParams.negativeY && y <= canvasParams.physicalHeight;
}

function calcPositions(particle){
    let points = [{
        Ux: particle.Ux,
        Uy: particle.Uy,
        x: particle.x,
        y: particle.y
    }]; 

    for (let i = 1; isInArea(points[i - 1].x, points[i - 1].y); i++){
        points[i] = {
            Ux: points[i - 1].Ux + (gold.q * particle.q * (points[i - 1].x - gold.x) * static.dt) / 
            (4 * static.pie * particle.m * ((points[i - 1].x - gold.x) ** 2 + (points[i - 1].y - gold.y) ** 2) ** 1.5),
            Uy: points[i - 1].Uy + (gold.q * particle.q * (points[i - 1].y - gold.y) * static.dt) / 
            (4 * static.pie * particle.m * ((points[i - 1].x - gold.x) ** 2 + (points[i - 1].y - gold.y) ** 2) ** 1.5),
        }
        points[i].x = points[i - 1].x + (points[i - 1].Ux + points[i].Ux) * static.dt;
        points[i].y = points[i - 1].y + (points[i - 1].Uy + points[i].Uy) * static.dt;
    }
    return points;
}

function drawGrid(canvas, canvasParams) {
    const ctx = canvas.getContext("2d");
    const cp = canvasParams;

    // draw gold
    ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.arc(400, 200, 3, 0, 2 * Math.PI, true);
        ctx.fill();
    ctx.closePath();

    //ctx.clearRect(0, 0, cp.widthpx, cp.heightpx);
    ctx.font = "12px sans-serif";

    for (let i = 1; i < cp.yLines; i++){
        ctx.fillRect(0, cp.heightpx * i / cp.yLines, cp.widthpx, 1);
        ctx.fillText((cp.physicalHeight - cp.physicalHeight * i / cp.yLines - cp.negativeY).toString(), 3, cp.heightpx*i/cp.yLines - 3);
    }
    for (let i = 1; i < cp.xLines; i++){
        ctx.fillRect(cp.widthpx * i / cp.xLines, 0, 1, cp.heightpx);
        ctx.fillText((cp.physicalWidth * i / cp.xLines).toString(), cp.widthpx * i / cp.xLines + 3, cp.heightpx - 3);
    }
    
}

function draw(canvas, coordinates, canvasParams) {
    const ctx = canvas.getContext("2d");
    const cp = canvasParams;
    const unit = -cp.negativeY * cp.heightpx / cp.physicalHeight;
    const color = randomColor({luminosity: 'bright'});

    for (let i = 0; i < coordinates.x.length - 1; i++){
        let x1 = coordinates.x[i] / cp.physicalWidth * cp.widthpx;
        let y1 = cp.heightpx - coordinates.y[i] / cp.physicalHeight * cp.heightpx;
        let x2 = coordinates.x[i + 1] / cp.physicalWidth * cp.widthpx;
        let y2 = cp.heightpx - coordinates.y[i + 1] / cp.physicalHeight * cp.heightpx;

        ctx.beginPath();
            ctx.moveTo(x1, y1 - unit);
            ctx.lineTo(x2, y2 - unit);
            ctx.strokeStyle = color;
        ctx.closePath();
        ctx.stroke();
    }
}

/**
 * Get maximum and minimum in matrix
 * @param {number[][]} a - matrix
 * @return {object} -max and min elements
 */
function getMaxAndMin(a){
    let mn = 1e9, mx = -1e9;
    for (let i = 0; i < a.length; i++)
        for (let j = 0; j < a[i].length; j++){
            mx = a[i][j] > mx ? a[i][j] : mx;
            mn = a[i][j] < mn ? a[i][j] : mn;
        }

    return {
        min: Math.round(mn) - 1,
        max: Math.round(mx) + 1
    }
}

/**
 * Onload
 */
function main(){
    canvas.width = canvasParams.widthpx;
    canvas.height = canvasParams.heightpx;
    drawGrid(canvas, canvasParams);

    let particleClone = particle;
    let particleVar = [1e-14, 1e-14, 2e-14, 2e-14, 3e-14, 4e-14, 5e-14, 6e-14, 7e-14, 8e-14, 9e-14]; // particle.y now // actually b
    
    // particleVar = [1, 2, 3, 4, 5, 10]; // particle.q
    // particleVar = [0.5e7, 0.7e7, 1e7, 1.5e7, 2e7, 3e7]; // particle.Ux
    // particleVar = [200, 79, 30, 20, 10]; // gold.q
    // particleVar = [10e-27, 8e-27, 6.642156264e-27, 6e-27, 4e-27, 2e-27]; // particle.m
    
    for (let j = 0; j < particleVar.length; j++){
        particleClone.y = particleVar[j] + 1e-13;
        // particleClone.q = particleVar[j] * static.e;
        // particleClone.Ux = particleVar[j];
        // gold.q = particleVar[j] * static.e;
        // particleClone.m = particleVar[j];
        
        const points = calcPositions(particleClone);

        /**
         * width for mobile phones 
         */
        const actuallyWidth = Math.min(800, window.innerWidth);
        const extremums = getMaxAndMin(points);
    
        

        draw(canvas, {
            x: points.map(elem => elem.x),
            y: points.map(elem => elem.y)
        }, canvasParams);    }
}

window.onload = main;

