window.onload = function () {
    const dt = 0.005; // s
    const widthpx = 700;
    const heightpx = 350;
    const g = 9.78;
    const eps = 0.1;



    var gun = {
        a_cos: null, // deg
        a_sin: null,
        ux: [], // m/s
        uy: [],
        x: [0], // meters
        y: [0]
    }

    /**
     * Calculate next position in realtime mode with static dt
     */
    function nextPos() {
        let ux = gun.ux[gun.ux.length - 1],
            uy = gun.uy[gun.uy.length - 1],
            x = gun.x[gun.x.length - 1],
            y = gun.y[gun.y.length - 1];

        gun.ux.push(ux - (app.resistance * ux * ux / app.weight) * dt);
        gun.uy.push(uy - (g + app.resistance * uy * uy / app.weight) * dt);
        gun.x.push(x + ux * dt);
        gun.y.push(y + uy * dt);
    }


    function drawLine() {
        let x1 = gun.x[gun.x.length - 2] / app.width * widthpx,
            y1 = heightpx - gun.y[gun.y.length - 2] / app.height * heightpx,
            x2 = gun.x[gun.x.length - 1] / app.width * widthpx,
            y2 = heightpx - gun.y[gun.y.length - 1] / app.height * heightpx;
        
        var canvas = document.querySelector("#canvas");
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.stroke();

    }

    function drawGrid(height, width) {
        var canvas = document.querySelector("#canvas");
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, widthpx, heightpx);
        ctx.font = "12px sans-serif";

        for (let i = 1; i < 5; i++){
            ctx.fillRect(0, heightpx * i / 5, widthpx, 1);
            ctx.fillText((height - height * i / 5).toString(), 3, heightpx*i/5 -3);
        }
        for (let i = 1; i < 5; i++){
            ctx.fillRect(widthpx * i / 5, 0, 1, heightpx);
            ctx.fillText((width * i / 5).toString(), widthpx * i / 5 + 3, heightpx - 3);
        }
        
    }


    var app = new Vue({
        el: '#app',
        data: {
            height: 5,
            width: 10,
            speed: 30,
            tilt_angle: 30,
            resistance: 100,
            weight: 100,
            target_x: 10,
            target_y: 2,
            target_time: 1
        },
        created: function () {
            drawGrid(this.height, this.width);
        },
        methods: {
            draw: function () {
                var angle = this.tilt_angle * Math.PI / 180;
                var a_cos = Math.cos(angle),
                    a_sin = Math.sin(angle);
                gun = {
                    ux: [this.speed * a_cos],
                    uy: [this.speed * a_sin],
                    x: [0],
                    y: [0],
                }

                var drawing = setInterval(function () {
                    if (gun.y.length <= 1 || gun.y[gun.y.length - 1] > 0) {
                        nextPos();
                        drawLine();
                    } else {
                        clearInterval(drawing);
                    }
                }, dt * 1000);

            },
            calculate: function () {
                this.resistance = 0;
                if (this.target_x == -1) {
                    this.tilt_angle = 90;
                    this.speed = Number(this.target_y) + Number(g * this.target_time ** 2) / 2;
                } else {
                    this.tilt_angle = Math.atan((2 * this.target_y + g * (this.target_time ** 2)) / (2 * this.target_x));
                    this.speed = this.target_x / (Math.cos(this.tilt_angle) * this.target_time);
                    this.tilt_angle = this.tilt_angle * 180 / Math.PI;
                }
                this.draw();
            },
            reset: function () {
                drawGrid(this.height, this.width);
            }
        }
    })
};