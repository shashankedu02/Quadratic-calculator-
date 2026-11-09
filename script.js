const form = document.querySelector("#quadratic-form");
const result = document.querySelector("#result");

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(6).replace(/0+$/, "").replace(/.$/, "");
}

function formatComplex(real, imaginary) {
  if (Math.abs(imaginary) < 1e-10) return formatNumber(real);
  const sign = imaginary >= 0 ? "+" : "−";
  return `${formatNumber(real)} ${sign} ${formatNumber(Math.abs(imaginary))}i`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const a = Number(form.elements.a.value);
  const b = Number(form.elements.b.value);
  const c = Number(form.elements.c.value);

  if (a === 0) {
    result.className = "result error";
    result.textContent = "The value of a cannot be 0; otherwise this is not a quadratic equation.";
    return;
  }

  const discriminant = b ** 2 - 4 * a * c;
  const realPart = -b / (2 * a);

  if (discriminant >= 0) {
    const offset = Math.sqrt(discriminant) / (2 * a);
    const first = realPart + offset;
    const second = realPart - offset;
    const label = discriminant === 0 ? "one repeated real root" : "two real roots";
    result.className = "result";
    result.innerHTML = `<strong>Result: ${label}</strong><br>Discriminant: ${formatNumber(discriminant)}<br>x₁ = ${formatNumber(first)}<br>x₂ = ${formatNumber(second)}`;
  } else {
    const imaginaryPart = Math.sqrt(-discriminant) / Math.abs(2 * a);
    result.className = "result";
    result.innerHTML = `<strong>Result: two complex roots</strong><br>Discriminant: ${formatNumber(discriminant)}<br>x₁ = ${formatComplex(realPart, imaginaryPart)}<br>x₂ = ${formatComplex(realPart, -imaginaryPart)}`;
  }
});
