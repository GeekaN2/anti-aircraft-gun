# Отчёт 
#### Тело, брошенное под углом к горизонту
Все действия происходят в `main.js`, будем обращаться к нему.

Все данные которые возможно использовать:
```js
data: {
    height: 5, // высота графика
    width: 10, // ширина графика
    speed: 10, // начальная скорость 
    tilt_angle: 30, // угол наклона зенитки к горизонту
    resistance: 100, // коэффициент сопротивления воздуха
    weight: 100, // вес снаряда в граммах
    target_x: 10, // координата x мишения 
    target_y: 2, // кордината y мишени
    target_time: 1 // время полёта снаряда до мишени
},
```

При постройке графика используется численный метод, рассматриваются малые промежутки времени 
```js
const dt = 0.002; // s
```
Каждые 2мс расчитываются следующие значения скорости и координат, таким образом получаем отображение графика в реальном времени.
```js
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
```
На графике отрисовывается линия из предыдущего положения снаряда в только что расчитанное
```js
ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
ctx.closePath();
ctx.stroke();
```
#### Расчет данных для попадания в мишень
При введённых координатах x, y, t (время добавлено для однозначности графика) расчитывается скорость и угол.
```js
this.tilt_angle = Math.atan((2 * this.target_y + g * (this.target_time ** 2)) / (2 * this.target_x));
this.speed = this.target_x / (Math.cos(this.tilt_angle) * this.target_time);
this.tilt_angle = this.tilt_angle * 180 / Math.PI;
```
В таком случае коэффициент сопротивления среды считается равным нулю.