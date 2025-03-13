let functionChart;

// Main function to calculate the function values and plot them
function calculateAndPlot(event) {
  event.preventDefault(); // Prevent form submission
  
  // Get the function and range values from the form
  const funcStr = document.getElementById('calcFunction').value;
  const start = parseFloat(document.getElementById('startOfX').value);
  const end = parseFloat(document.getElementById('endOfX').value);
  const step = parseFloat(document.getElementById('stepOfX').value);

  const yScale = parseFloat(document.getElementById('rangeOfY').value);
  const yStep = parseFloat(document.getElementById('yStep').value);
  const yMin = -yScale;
  const yMax = yScale;

  let xValues = [];
  let yValues = [];
  let outputHTML = '';

  // Compile the function using math.js
  let compiledFunc;
  try {
    // math.compile creates a reusable compiled expression
    compiledFunc = math.compile(funcStr);
  } catch (error) {
    alert("Error in function expression: " + error);
    return;
  }

  // Loop from start to end, stepping by the given value
  for (let x = start; x <= end; x += step) {
    try {
      // Evaluate the function for the current x value.
      // We include PI and E for convenience.
      const scope = { x: x, PI: Math.PI, E: Math.E };
      const y = compiledFunc.evaluate(scope);
      xValues.push(x);
      yValues.push(y);
      outputHTML += `<p>f(${x}) = ${y}</p>`;
    } catch (error) {
      outputHTML += `<p>Error evaluating at x = ${x}: ${error}</p>`;
      xValues.push(x);
      yValues.push(null);
    }
  }

  // Display the output values in the output div
  document.getElementById('output').innerHTML = outputHTML;

  const ctx = document.getElementById('functionCanvas').getContext('2d');

  const yAxisOptions = {
    min: yMin,
    max: yMax,
    ticks: {
        stepSize: yStep
    },
    title: {
      display: true,
      text: 'f(x)'
    }
  };

  if (functionChart) {
    // Update existing chart with new data
    functionChart.data.labels = xValues;
    functionChart.data.datasets[0].data = yValues;
    functionChart.options.scales.y.min = yMin;
    functionChart.options.scales.y.max = yMax;
    functionChart.options.scales.y.ticks.stepSize = yStep;
    functionChart.update();
  } else {
    // Create a new chart instance
    functionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [{
          label: 'f(x)',
          data: yValues,
          fill: false,
          borderColor: 'blue',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'x'
            }
          },
          y: yAxisOptions
        }
      }
    });
  }
}

// Add event listener to the form to trigger calculations on submit
document.getElementById('calcForm').addEventListener('submit', calculateAndPlot);
