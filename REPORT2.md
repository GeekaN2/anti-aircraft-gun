# Отчёт 
#### Распределения тепла в стержне
Все действия происходят в `main.js`, будем обращаться к нему.

Используемые переменные (пока что их нельзя менять)
```js
const dt = 1.6; // шаги по времени
const dx = 1; // шаги по длине
const a = 0.5; // коэффициент теплопроводности
const len = 4; // длина стержня
const lengthIntervals = 5; // количество интервалов длины (len/dx + 1)
const timeIntervals = 20; // количество интервалов времени
```

Считает температуру на первом временном интервале и на концах стержня
```js
/**
 * Get temperature on the x-coordinate.
 * Also uses to get temperature at the zero layer
 * @param {number} x - position on the rod
 * @param {array[]} points - array of all prev points
 * @return {number} temperature
 */
function getTemperatureAtTheEnds(x, points){
    return -0.5 * x ** 2 + 2 * x + 3;
}
```

Считает температуру на всех остальных участках
```js
/**
 * @param {number} t - time
 * @param {number} x - position on the rod
 * @param {array[]} - array of all prev points
 * @return {number} temperature 
 */
function getTemperature(t, x, points) {
    return points[t - 1][x] + 
    (a ** 2 * dt / (dx ** 2)) * 
    (points[t - 1][x + 1] - 2 * points[t - 1][x] + points[t - 1][x - 1]);
}
```

Рисует график по координатам
```js
draw(...args)
```


![Graphic 1](heat-distribution-in-the-rod/images/graphic1.png)