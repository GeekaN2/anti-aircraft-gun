const z = 1; // порядковый номер атома
const h = 1.05e-34; // постоянная планка
const e = 1.6e-19; // элементарный заряд
const a = 0.529; // градусы(?) A
const E0 = 27.07 // эВ

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

function Anl(n, l) {
  return (1 / factorial(2 * l + 1)) *
    Math.sqrt(factorial(n + l) / (2 * n * factorial(n - l - 1))) *
    (2 * z / n) ** 1.5;
}

function Alm(l, m) {
  return Math.sqrt(factorial(l - Math.abs(m) * (2 * l + 1)) /
    (factorial(l + Math.abs(m)) * 4 * Math.PI));
}

function Rnl(n, l, r) {
  const beta = z / n;
  const ksi = 2 * beta * r;

  return Anl(n, l) *
    (r ** l) *
    (Math.e ** (-beta * r));
  // todo * lag
}

function Plm(l, m, teta) {
  if (m == 0) {
    return 1;
  }

  let x = nerdamer.diff('(x^2 - 1)^2', 'x', l+m).evaluate({x: cos(teta)}).evaluate();
  console.log(eval(x.toString()), nerdamer.diff('(x^2 - 1)^2', 'x', l+m).toString());
  x = eval(x.toString());
  x = Number(x);
  
  return sin(teta) ** Math.abs(m) / (2 ** l * factorial(l)) * x;

}

function Lag(a, g, ksi) {
  return 0;
}

function Ylm(l, m, teta) {
  let ans = {
    x: teta
  }

  ans.value = Alm(l, m) * Plm(l, m, teta) * cos(teta);
  ans.value **= 2;
  return ans;
}

function euler(fi) {
  console.log(Math.sqrt(cos(fi) ** 2 + sin(fi) ** 2));
  return Math.sqrt(cos(fi) ** 2 + sin(fi) ** 2);
}

// Y32
function test(angle, fi = angle) {
  let obj = {
    x: angle
  };
  
  obj.value =  -(Math.sqrt(105 / 32 / Math.PI) * cos(angle) * 
    sin(4 * angle));
  obj.value **= 2;
  return obj;
}

function main() {
  let data = [];
  chart = anychart.polar();
  chart.xScale().maximum(360);
  chart.container("container");

  const l = 1;
  const m = 0;

  console.log(`l:${l} m:${m}`);

  for (let angle = 0; angle < 360; angle+=1) {
    data.push(Ylm(l, m, angle));
  }
  console.log(data);

  let series = chart.line(data);
  
  chart.draw(); 

}

main();


//console.log('KEKEREK');
//var x = nerdamer.diff('x^4-2*x^2 + 1', 'x', 1).evaluate({x: 10});    
//console.log(x);