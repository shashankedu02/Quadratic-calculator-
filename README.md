# Quadratic Calculator — Web

A lightweight, dependency-free browser app for solving and visualizing quadratic equations:

```
ax² + bx + c = 0
```

It validates input, explains whether the equation has two real roots, one repeated root, or complex roots, and plots the equation on an interactive graph.

## Use it

Open `index.html` in any modern browser. No installation or build step is needed.

## Interactive graph

The graph has three purple control points on the curve:

- Drag a point **up or down** to reshape the parabola.
- The values of `a`, `b`, and `c` update instantly.
- Editing any coefficient also redraws the curve.
- Green dots mark real x-intercepts.

## Example

For `x² - 5x + 6 = 0`, enter:

- `a = 1`
- `b = -5`
- `c = 6`

The calculator returns `x = 2` and `x = 3`.

## Project files

- `index.html` — page structure
- `styles.css` — responsive interface and graph layout
- `script.js` — equation-solving and interactive graph logic
