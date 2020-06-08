const z = 1; // порядковый номер атома
const h = 1.05e-34; // приведённая постоянная планка
const eq = 1.602176634e-19; // элементарный заряд
const e0 = 8.854187817e-12; // электрическая постоянная
const a = 0.529; // ангстрем
const E0 = 27.07; // эВ
const me = 9.1e-31; // масса электрона кг

/**
 * Факториал числа
 * 
 * @param {number} n - число
 * @returns {number} - (1 * 2 * ... * n)
 */ 
function factorial(n) {
  let ans = 1;
  for (let i = n; i > 1; i--) {
    ans *= i;
  }

  return ans;
}

/**
 * Косинус от угла в градусах
 * 
 * @param {number} angle - угол в градусах
 * @returns {number} - косинус от угла
 */ 
function cos(angle) {
  return Math.cos(angle * Math.PI / 180);
}

/**
 * Синус от угла в градусах
 * 
 * @param {number} angle - угол в градусах
 * @returns {number} - косинус от угла
 */ 
function sin(angle) {
  return Math.sin(angle * Math.PI / 180);
}

/**
 * Значение энергии электрона в водородоподобном атомне на уровне n
 * 
 * @param {number} n - 
 */ 
function E(n) {
  return (-(me * (eq ** 4) * (z ** 2)) / ((4 * Math.PI * e0) ** 2 * (2 * n ** 2 * h ** 2))) / eq;
}

const eps = (n) => -E(n) / E0;
const ro = (r) => r / a;
const beta = (n) => Math.sqrt(2 * eps(n));

// Нормировоный коэффициент для радиальной функции
function Anl(n, l) {
  return (1 / factorial(2 * l + 1)) *
    Math.sqrt(factorial(n + l) / (2 * n * factorial(n - l - 1))) *
    (2 * z / n) ** 1.5;
}

// Полиномы Лежандра для радиальной функции
function Lnl(n, l, ro) {
  const ksi = 2 * beta(n) * ro;
  const gamma = n + l;
  const alpha = 2 * l + 1;
  const Lya = nerdamer.diff(nerdamer.diff(`exp(-ksi) * ksi^${gamma}`, 'ksi', gamma).multiply('exp(ksi)'), 'ksi', alpha).evaluate({ 'ksi': ksi }).text();

  return Number(Lya);
}

// Считает значения радиальной функции состояния атома
function Rnl(n, l, r) {
  let ans = {};
  ans.x = ro(r).toFixed(1);

  ans.value = (Anl(n, l) *
    ro(r) ** l *
    Math.E ** (-beta(n) * ro(r)) *
    Lnl(n, l, ro(r)));

  return ans;
}

function Alm(l, m) {
  return Math.sqrt((factorial(l - Math.abs(m)) * (2 * l + 1)) /
    (factorial(l + Math.abs(m)) * 4 * Math.PI));
}

function Plm(l, m, teta) {
  let x = nerdamer.diff(`(x^2 - 1)^${l}`, 'x', l + m).evaluate({ x: cos(teta) }).evaluate();
  x = Number(x.text());

  return sin(teta) ** Math.abs(m) / (2 ** l * factorial(l)) * x;

}

function Ylm(l, m, teta) {
  let ans = {
    x: teta
  }
  ans.value = Alm(l, m) * Plm(l, m, teta);
  ans.value **= 2;
  return ans;
}

function Ylm_chart(l, m, chart) {
  let data = [];

  // remove last series
  chart.removeSeriesAt(0);

  for (let angle = 0; angle < 360; angle += 5) {
    data.push(Ylm(l, m, angle));
  }
  // console.log(data);

  let series = chart.line(data);
  series.name(`Y${l}${m}(fi)`);

  chart.draw();
}

function Rnl_chart(data, title, chart) {
  // delete last line
  chart.removeSeriesAt(0);

  var series = chart.line(data);
  series.name(title);
  series.hovered().markers().enabled(true).type('circle').size(4);
  series
    .tooltip()
    .position('right')
    .anchor('left-center')
    .offsetX(5)
    .offsetY(5);

  chart.draw();
}

function getData(n, l) {
  let data = [];
  for (r = 0; r < 10 * a; r += a / 5) {
    data.push(Rnl(n, l, r));
  }
  // console.log(data);
  return data;
}
