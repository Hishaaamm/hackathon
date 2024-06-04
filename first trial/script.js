const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const outputArea = document.getElementById("output-area");
const graphArea = document.getElementById("graph-area");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const userInputValue = userInput.value.trim();
  if (userInputValue) {
    // Process the user input to determine the chronic medical condition
    const condition = processUserInput(userInputValue);
    if (condition) {
        outputArea.textContent = `If you have ${condition}.`;
        // Provide personalized care recommendations
        const careRecommendations = provideCareRecommendations(condition);
        outputArea.textContent += `\n\nDescription: ${careRecommendations.description}\n\nCare Recommendations:`;
        careRecommendations.solutions.forEach((recommendation, index) => {
          outputArea.textContent += `\n${index + 1}. ${recommendation}`;
        });
        // Generate graph data
        const graphData = generateGraphData(condition);
        // Draw graph
        drawGraph(graphData);
      } else {
        outputArea.textContent = "I didn't understand. Please try again.";
      }
}});

function processUserInput(userInputValue) {
  // Implement logic to process the user input and determine the chronic medical condition
  // For example, you can use a dictionary or machine learning model to map the user input to a condition
  // For simplicity, let's assume we have a dictionary that maps user inputs to conditions
  const conditions = {
    "I have diabetes": "Diabetes",
    "I have high blood pressure": "Hypertension",
    "I have heart disease": "Heart Disease"
  };
  return conditions[userInputValue];
}

function provideCareRecommendations(condition) {
    // Fetch the chronic disease data from the JSON file
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        const disease = data.chronic_diseases.find(disease => disease.name.toLowerCase() === condition.toLowerCase());
        if (disease) {
          // If the disease is found, display its description and solutions
          outputArea.textContent += `\n\nDescription: ${disease.description}\n\nCare Recommendations:`;
          disease.solutions.forEach((recommendation, index) => {
            outputArea.textContent += `\n${index + 1}. ${recommendation}`;
          });
        } else {
          outputArea.textContent = `No information found for "${condition}".`;
        }
      })
      .catch(error => {
        console.error('Error loading JSON file:', error);
      });
  }
  

function generateGraphData(condition) {
    // Get the chronic disease data for the given condition
    const chronicDiseaseData = getChronicDiseaseData(condition);
    if (chronicDiseaseData) {
      // Generate graph data for the given chronic disease
      const graphData = chronicDiseaseData.solutions.map((solution, index) => {
        return {
          label: solution,
          value: index + 1
        };
      });
      return graphData;
    } else {
      return null;
    }
  }
  
  function drawGraph(graphData) {
    const ctx = graphArea.getContext("2d");
    if (!ctx) {
      console.error("Failed to get graph context");
      return;
    }
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: graphData.map((item) => item.label),
        datasets: [{
          label: "Solutions",
          data: graphData.map((item) => item.value),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)"
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    if (!chart) {
      console.error("Failed to create chart");
    }
  }
  
  // Load chronic disease data from data.json
  // Load the JSON data
fetch('data.json')
.then(response => response.json())
.then(data => {
  // Extract disease names and solutions
  const diseaseNames = data.chronic_diseases.map(disease => disease.name);
  const solutions = data.chronic_diseases.map(disease => disease.solutions);

  // Create the chart
  const ctx = document.getElementById('diseaseChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: diseaseNames,
      datasets: [
        {
          label: 'Solutions',
          data: solutions.map(solutionList => solutionList.length),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Chronic Disease Solutions'
        }
      }
    }
  });
})
.catch(error => {
  console.error('Error loading JSON file:', error);
});


