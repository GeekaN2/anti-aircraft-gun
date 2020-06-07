const z = 1; // порядковый номер атома
const h = 1.05e-34; // приведённая постоянная планка
const eq = 1.6e-19; // элементарный заряд
const e0 = 8.854e-12; // электрическая постоянная
const a = 0.529; // ангстрем
const E0 = 27.07; // эВ
const me = 9.1e-31; // масса электрона кг

function factorial(n) {
  let ans = 1;
  for (let i = n; i > 1; i--) {
    ans *= i;
  }

  return ans;
}

function cos(angle) {
  return Math.cos(angle * Math.PI / 180);
}

function sin(angle) {
  return Math.sin(angle * Math.PI / 180);
}

function E(n) {
  return (-(me * (eq ** 4) * (z ** 2)) / ((4 * Math.PI * e0) ** 2 * (2 * n ** 2 * h ** 2))) / eq;
}

const eps = (n) => -E(n) / E0;
const ro = (r) => r / a;
const beta = (n) => Math.sqrt(2 * eps(n));


function Anl(n, l) {
  return (1 / factorial(2 * l + 1)) *
    Math.sqrt(factorial(n + l) / (2 * n * factorial(n - l - 1))) *
    (2 * z / n) ** 1.5;
}

// FIX PLEASE
function Lnl(n, l, ro) {
  // const ksi = 2 * beta(n) * ro;
  const ksi = 2 * (z/n) * ro;
  const gamma = n + l;
  const alpha = 2 * l + 1;
  const Ly = nerdamer.diff(`exp(-ksi) * ksi^${gamma}`, 'ksi', gamma).evaluate().toString();
  let Lya = nerdamer.diff(`exp(ksi) * ${Ly}`, 'ksi', alpha).evaluate({'ksi': ksi}).text();
  return Lya;
}

function Rnl(n, l, r) {
  let ans = [ro(r).toFixed(1)];

  ans.push(Anl(n, l) *
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

function mainY() {
  let data = [];
  chart = anychart.polar();
  chart.xScale().maximum(360);
  chart.container("container_Y");

  const l = 3;
  const m = 0;

  console.log(`l:${l} m:${m}`);

  for (let angle = 0; angle < 360; angle += 1) {
    data.push(Ylm(l, m, angle));
  }
  console.log(data);

  let series = chart.line(data);

  chart.draw();
}

function mainR(n, l) {
  // create data set on our data
  var dataSet = anychart.data.set(getData(n, l));

  // map data for the first series, take x from the zero column and value from the first column of data set
  var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });

  // create line chart
  var chart = anychart.line();

  // turn on chart animation
  chart.animation(true);

  // set chart padding
  chart.padding([10, 20, 5, 20]);

  // turn on the crosshair
  chart.crosshair().enabled(true).yLabel(false).yStroke(null);

  // set tooltip mode to point
  chart.tooltip().positionMode('point');

  // set chart title text settings
  /*chart.title(
    'Trend of Sales of the Most Popular Products of ACME Corp.'
  );*/

  // set yAxis title
  chart.yAxis().title(`R${n}${l}(ro)`);
  chart.xAxis().labels().padding(5);

  chart.xScale().mode('continuous');

  // create first series with mapped data
  var firstSeries = chart.line(firstSeriesData);
  firstSeries.name(`R${n}${l}(ro)`);
  firstSeries.hovered().markers().enabled(true).type('circle').size(4);
  firstSeries
    .tooltip()
    .position('right')
    .anchor('left-center')
    .offsetX(5)
    .offsetY(5);

  // turn the legend on
  chart.legend().enabled(true).fontSize(13).padding([0, 0, 10, 0]);

  // set container id for the chart
  chart.container('container_R');
  // initiate chart drawing
  chart.draw();
}

function getData(n, l) {
  let data = [];
  for (r = a; r < 10 * a; r += a/5) {
    data.push(Rnl(n, l, r));
  }
  console.log(data);
  return data;
}

mainY();
mainR(3, 1);