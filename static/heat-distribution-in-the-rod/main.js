
/**
 * Constants. TODO custom input
 */
const dt = 1.6;
const a = 0.5;
const len = 8; // rod length
const lengthIntervals = 5;
const dx = len / lengthIntervals;
const timeIntervals = 20;
const canvas = document.querySelector('.canvas');

/**
 * Get temperature on the x-coordinate.
 * Also uses to get temperature at the zero layer
 * @param {number} x - position on the rod
 * @return {number} temperature
 */
function getTemperatureAtTheEnds(x){
    if (x == 0) return 3;
    if (x == len) return 1;
    return Math.sin(x);
    //return -0.5 * x ** 2 + 2 * x + 3;
}

/**
 * @param {number} t - time
 * @param {number} x - position on the rod
 * @param {array[]} points - array of all prev points
 * @return {number} temperature 
 */
function getTemperature(t, x, points) {
    return points[t - 1][x] + 
    ((a ** 2 * dt) / (dx ** 2)) * 
    (points[t - 1][x + 1] - 2 * points[t - 1][x] + points[t - 1][x - 1]);
}

/**
 * @return {object} addiction for every timeInterval
 * matrix timeIntervals * len
 */
function calculateTemperature(){
    let points = []; 

    for (let t = 0; t < timeIntervals; t++){
        points[t] = [];

        for (let x = 0; x <= lengthIntervals; x++)
            if (t == 0 || x == 0 || x == lengthIntervals)
                points[t][x] = getTemperatureAtTheEnds(x * dx);
            else
                points[t][x] = getTemperature(t, x, points);
        
        console.log(points[t]);
    }
    return points;
}

function round(number, decimalPlaces = 3){
    return ~~(number * 10 ** decimalPlaces) / (10 ** decimalPlaces);
}

function drawGrid(canvas, widthpx, heightpx, physicalWidth, physicalHeight, xLines, yLines) {
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, widthpx, heightpx);
    ctx.font = "12px sans-serif";

    for (let i = 1; i < yLines; i++){
        ctx.fillRect(0, heightpx * i / yLines, widthpx, 1);
        ctx.fillText(round(physicalHeight - physicalHeight * i / yLines).toString(), 3, heightpx*i/yLines -3);
    }
    for (let i = 1; i < xLines; i++){
        ctx.fillRect(widthpx * i / xLines, 0, 1, heightpx);
        ctx.fillText(round(physicalWidth * i / xLines).toString(), widthpx * i / xLines + 3, heightpx - 3);
    }
    
}

function draw(canvas, coordinates, widthpx, heightpx, physicalWidth, physicalHeight) {
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < coordinates.x.length - 1; i++){
        let x1 = coordinates.x[i] / physicalWidth * widthpx;
        let y1 = heightpx - coordinates.y[i] / physicalHeight * heightpx;
        let x2 = coordinates.x[i + 1] / physicalWidth * widthpx;
        let y2 = heightpx - coordinates.y[i + 1] / physicalHeight * heightpx;

        ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();
    }
}

/**
 * Onload
 */
function main(){
    const points = calculateTemperature();
    console.log(points);

    /**
     * width for mobile phones 
     */
    const actuallyWidth = Math.min(800, window.innerWidth);
    canvas.width = actuallyWidth;
    canvas.height = actuallyWidth * 0.5;

    drawGrid(canvas, actuallyWidth, actuallyWidth * 0.5, 8, 9, 4, 3);

    for (let i = 0; i < timeIntervals; i++)
        draw(canvas,  {
            x : Array(...Array(lengthIntervals + 1)).map((_, i) => i * dx),
            y : points[i],
        },
        actuallyWidth, actuallyWidth * 0.5, 8, 9);
}
window.onload = main;