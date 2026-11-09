const form = document.querySelector("#quadratic-form");
const result = document.querySelector("#result");
const canvas = document.querySelector("#graph");
const context = canvas.getContext("2d");
const inputs = ["a", "b", "c"].map((name) => form.elements[name]);

let activeControl = null;
let view = { xMin: -6, xMax: 6, yMin: -10, yMax: 10, width: 720, height: 400 };

function formatNumber(value) {
  if (!Number.isFinite(value)) return "—";
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

function formatComplex(real, imaginary) {
  if (Math.abs(imaginary) < 1e-10) return formatNumber(real);
  const sign = imaginary >= 0 ? "+" : "−";
  return `${formatNumber(real)} ${sign} ${formatNumber(Math.abs(imaginary))}i`;
}

function coefficients() {
  return {
    a: Number(inputs[0].value),
    b: Number(inputs[1].value),
    c: Number(inputs[2].value),
  };
}

function setCoefficients(a, b, c) {
  inputs[0].value = formatNumber(a);
  inputs[1].value = formatNumber(b);
  inputs[2].value = formatNumber(c);
}

function roots({ a, b, c }) {
  const discriminant = b ** 2 - 4 * a * c;
  if (discriminant >= 0) {
    const offset = Math.sqrt(discriminant) / (2 * a);
    return { discriminant, first: -b / (2 * a) + offset, second: -b / (2 * a) - offset };
  }
  const real = -b / (2 * a);
  const imaginary = Math.sqrt(-discriminant) / Math.abs(2 * a);
  return { discriminant, first: formatComplex(real, imaginary), second: formatComplex(real, -imaginary) };
}

function renderResult() {
  const { a, b, c } = coefficients();
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) return;
  if (a === 0) {
    result.className = "result error";
    result.textContent = "The value of a cannot be 0; otherwise this is not a quadratic equation.";
    return;
  }

  const solution = roots({ a, b, c });
  result.className = "result";
  if (solution.discriminant >= 0) {
    const label = solution.discriminant === 0 ? "one repeated real root" : "two real roots";
    result.innerHTML = `<strong>Result: ${label}</strong><br>Discriminant: ${formatNumber(solution.discriminant)}<br>x₁ = ${formatNumber(solution.first)}<br>x₂ = ${formatNumber(solution.second)}`;
  } else {
    result.innerHTML = `<strong>Result: two complex roots</strong><br>Discriminant: ${formatNumber(solution.discriminant)}<br>x₁ = ${solution.first}<br>x₂ = ${solution.second}`;
  }
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round((rect.width * 0.55) * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  view.width = rect.width;
  view.height = rect.width * 0.55;
}

function prepareView({ a, b, c }) {
  const controlValues = [-1, 0, 1].map((x) => a * x * x + b * x + c);
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  const maxY = Math.max(5, ...controlValues.map(Math.abs), Math.abs(vertexY)) + 2;
  view = { ...view, xMin: -6, xMax: 6, yMin: -maxY, yMax: maxY };
}

function toCanvas(x, y) {
  return {
    x: ((x - view.xMin) / (view.xMax - view.xMin)) * view.width,
    y: view.height - ((y - view.yMin) / (view.yMax - view.yMin)) * view.height,
  };
}

function toGraph(x, y) {
  return {
    x: view.xMin + (x / view.width) * (view.xMax - view.xMin),
    y: view.yMin + ((view.height - y) / view.height) * (view.yMax - view.yMin),
  };
}

function drawAxes() {
  context.lineWidth = 1;
  context.strokeStyle = "#e5e9f2";
  for (let x = Math.ceil(view.xMin); x <= view.xMax; x += 1) {
    const point = toCanvas(x, 0);
    context.beginPath();
    context.moveTo(point.x, 0);
    context.lineTo(point.x, view.height);
    context.stroke();
  }
  for (let y = Math.ceil(view.yMin); y <= view.yMax; y += 1) {
    const point = toCanvas(0, y);
    context.beginPath();
    context.moveTo(0, point.y);
    context.lineTo(view.width, point.y);
    context.stroke();
  }
  context.strokeStyle = "#8792a5";
  context.lineWidth = 1.5;
  const horizontal = toCanvas(0, 0);
  context.beginPath();
  context.moveTo(0, horizontal.y);
  context.lineTo(view.width, horizontal.y);
  context.stroke();
  context.beginPath();
  context.moveTo(horizontal.x, 0);
  context.lineTo(horizontal.x, view.height);
  context.stroke();
}

function drawGraph() {
  const { a, b, c } = coefficients();
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c) || a === 0) return;

  resizeCanvas();
  prepareView({ a, b, c });
  context.clearRect(0, 0, view.width, view.height);
  drawAxes();

  context.strokeStyle = "#635bff";
  context.lineWidth = 3;
  context.beginPath();
  for (let pixel = 0; pixel <= view.width; pixel += 2) {
    const x = view.xMin + (pixel / view.width) * (view.xMax - view.xMin);
    const y = a * x * x + b * x + c;
    const point = toCanvas(x, y);
    if (pixel === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  }
  context.stroke();

  const solution = roots({ a, b, c });
  if (solution.discriminant >= 0) {
    context.fillStyle = "#1c7c54";
    [solution.first, solution.second].forEach((root) => {
      const point = toCanvas(root, 0);
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, Math.PI * 2);
      context.fill();
    });
  }

  [-1, 0, 1].forEach((x, index) => {
    const y = a * x * x + b * x + c;
    const point = toCanvas(x, y);
    context.fillStyle = "#635bff";
    context.beginPath();
    context.arc(point.x, point.y, 8, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(point.x, point.y, 3, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#4c5566";
    context.font = "12px system-ui";
    context.fillText(`P${index + 1}`, point.x + 10, point.y - 9);
  });
}

function eventPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function findControl(point) {
  const { a, b, c } = coefficients();
  return [-1, 0, 1].find((x) => {
    const y = a * x * x + b * x + c;
    const handle = toCanvas(x, y);
    return Math.hypot(point.x - handle.x, point.y - handle.y) < 20;
  }) ?? null;
}

canvas.addEventListener("pointerdown", (event) => {
  activeControl = findControl(eventPoint(event));
  if (activeControl !== null) canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (activeControl === null) return;
  const point = toGraph(eventPoint(event).x, eventPoint(event).y);
  const { a, b, c } = coefficients();
  const values = {
    minus: a - b + c,
    zero: c,
    plus: a + b + c,
  };
  if (activeControl === -1) values.minus = point.y;
  if (activeControl === 0) values.zero = point.y;
  if (activeControl === 1) values.plus = point.y;

  const nextA = (values.minus + values.plus - 2 * values.zero) / 2;
  const nextB = (values.plus - values.minus) / 2;
  setCoefficients(Math.abs(nextA) < 0.001 ? 0.001 : nextA, nextB, values.zero);
  renderResult();
  drawGraph();
});

function releaseControl() {
  activeControl = null;
}

canvas.addEventListener("pointerup", releaseControl);
canvas.addEventListener("pointercancel", releaseControl);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResult();
  drawGraph();
});

inputs.forEach((input) => input.addEventListener("input", () => {
  renderResult();
  drawGraph();
}));

window.addEventListener("resize", drawGraph);
renderResult();
drawGraph();
