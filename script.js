const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const keys = document.querySelectorAll(".key");

let expr = "";

// update display on screen
function updateDisplay() {
  expressionEl.textContent = expr || "0";
  resultEl.textContent = computePreview(expr) ?? "0";
}

// allow only safe characters
function safeExpr(input) {
  return input.replace(/[^0-9+\-*/().%\s]/g, "");
}

// compute preview (without executing unsafe code)
function computePreview(current) {
  if (!current) return null;
  try {
    const cleaned = safeExpr(
      current.replace(/×/g, "*").replace(/÷/g, "/").replace(/%/g, "/100")
    );
    if (/[+\-*/.]$/.test(cleaned)) return null;
    const value = Function("return " + cleaned)();
    if (value === Infinity || Number.isNaN(value)) return null;
    return Number(value.toFixed(10)).toString();
  } catch {
    return null;
  }
}

// handle value inputs (numbers & operators)
function appendValue(val) {
  // prevent starting with operator (except minus)
  if (/[+\-*/]/.test(val)) {
    if (expr === "" && val !== "-") return;
    if (/[+\-*/]$/.test(expr)) {
      expr = expr.slice(0, -1) + val;
      updateDisplay();
      return;
    }
  }

  // prevent multiple decimals in same number
  if (val === ".") {
    const parts = expr.split(/[^0-9.]/);
    const currentNum = parts[parts.length - 1];
    if (currentNum.includes(".")) return;
    if (currentNum === "") val = "0.";
  }

  expr += val;
  updateDisplay();
}

// clear everything
function clearAll() {
  expr = "";
  updateDisplay();
}

// delete last character
function backspace() {
  expr = expr.slice(0, -1);
  updateDisplay();
}

// evaluate final expression
function evaluateExpr() {
  const preview = computePreview(expr);
  if (preview !== null) expr = preview;
  updateDisplay();
}

// handle button clicks
keys.forEach((btn) => {
  btn.addEventListener("click", () => {
    const v = btn.dataset.value;
    const action = btn.dataset.action;

    if (action === "clear") return clearAll();
    if (action === "back") return backspace();
    if (action === "equals") return evaluateExpr();
    if (v) return appendValue(v);
  });
});

// handle keyboard inputs
window.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    appendValue(e.key);
    e.preventDefault();
  }
  if (["+", "-", "*", "/"].includes(e.key)) {
    appendValue(e.key);
    e.preventDefault();
  }
  if (e.key === "Enter" || e.key === "=") {
    evaluateExpr();
    e.preventDefault();
  }
  if (e.key === ".") {
    appendValue(".");
    e.preventDefault();
  }
  if (e.key === "Backspace") {
    backspace();
    e.preventDefault();
  }
  if (e.key === "Escape") {
    clearAll();
    e.preventDefault();
  }
  if (e.key === "%") {
    appendValue("%");
    e.preventDefault();
  }
});

// initialize display
updateDisplay();
