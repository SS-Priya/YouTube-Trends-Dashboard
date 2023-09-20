// Define the URL for the data
const url = "http://127.0.0.1:5000/youtube-data-json";
// Create/initialize a variable to store the fetched data in
let data;
let trace1; // Trace for the first chart
let layout1; // Layout for the first chart
let trace2; // Trace for the second chart
let layout2; // Layout for the second chart
// Select the container element
const container = d3.select("#barChartContainer");
const lineContainer = d3.select("#lineChartContainer");
// Function to create a bar chart with data
function createBarChartPlotly(data) {
  console.log(data);
  // Check if data is defined and has data
  if (!data || data.length === 0) {
    console.error("Data is empty or undefined.");
    return;
  }
  // Sort the data by highest_monthly_earnings and select the top 15
  const sortedData = data.sort((a, b) => b.highest_monthly_earnings - a.highest_monthly_earnings).slice(0, 15);
  // Extract the necessary data for the plot
  const yValues = sortedData.map(d => d.highest_monthly_earnings);
  const xValues = sortedData.map(d => d.youtube_name);
  // Create the trace for the bar chart
  trace1 = {
    x: xValues,
    y: yValues,
    type: "barh",
    marker: {
      color: "#E6543A",
    },
  };
  // Define the layout
  layout1 = {
    title: "Top 15 YouTuber's by Highest Monthly Earnings",
    yaxis: {
      title: "Highest Monthly Earnings US$",
    },
    xaxis: {
      showticklabels: true,
    },
  };
  // Create the plot using Plotly in the "barChartContainer" for Top15 graph
  Plotly.newPlot("barChartContainer", [trace1], layout1);
  // Call adjustContainerSize to adjust container width after creating the chart for Top15 graph
  adjustContainerSize(sortedData);
}
// Function to create a line chart with data
function createChartPlotly(data,selectedChannel) {
  console.log(data);
  // Check if data is defined and has data
  if (!data || data.length === 0) {
    console.error("Data is empty or undefined.");
    return;
  }
  const filteredData = getDataForChart(data, selectedChannel);
  // Sort the data by highest_monthly_earnings and select the top 15
  const sortedData = filteredData.sort((a, b) => b.highest_monthly_earnings - a.highest_monthly_earnings);
  // Extract the necessary data for the plot
  const yValues = sortedData.map(d => d.subscribers);
  const xValues = sortedData.map(d => d.highest_monthly_earnings);
//Create the trace for the second chart
trace2 = {
  x: xValues,
  y: yValues,
  mode: "lines+markers", // Set the mode to "markers" for a scatter plot
  line: {
    color: "#E6543A", // Set line color using getRandomColor
  },
  marker: {
    size: 8, // Set marker size
    color: "#E6543A", // Set marker color using getRandomColor
  },
  text: sortedData.map((name, index) => `Youtube.name: ${name.youtube_name}<br>Subscribers: ${yValues[index]}`),
};
// Define the layout for the second chart
layout2 = {
  xaxis: {
    title: "Highest Monthly Earnings US$",
    margin: {t:30}
  },
  yaxis: {
    showticklabels: true,
    title: "Number of Subscribers"
  },
};
  // Create the plot using Plotly in the "lineChartContainer"
  Plotly.newPlot("lineChartContainer", [trace2], layout2);
}
//for Top15 graph
function adjustContainerSize(sortedData) {
  const container = document.getElementById("barChartContainer");
  if (!sortedData) {
    console.error("Sorted data is empty or undefined.");
    return;
  }
  const xValues = sortedData.map(d => d.highest_monthly_earnings);
  const labelWidth = 80;
  const requiredWidth = labelWidth * xValues.length;
  container.style.minWidth = requiredWidth + "px";
}
// Function to fetch data from the API for all graphs
function fetchData(callback) {
  // Use D3.js to fetch data from the API
  d3.json(url)
    .then(function (response) {
      // Store the fetched data in the 'data' variable
      data = response;
      console.log(data);
      var optionMenu = d3.select("#selDataset");
      const channelTypes = getDataForDropdown(data);
      channelTypes.forEach(function (name) {
        optionMenu.append("option").text(name);
      });
      // console.log(channelTypes[0]);
      let option = channelTypes[0];
      // Call the callback function once data fetching is complete
      if (typeof callback === "function") {
        callback(data); // Pass the fetched data to the callback
        console.log(data);
      }
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}
// Function to handle option change (dropdown)
function optionChanged(selectedChannel) {
  console.log("Selected Channel:", selectedChannel); // Added this line for debugging
  createChartPlotly(data, selectedChannel);
}
function getDataForDropdown(data) {
  const channel_types = [];
  const result = data.map((a, b) => {
    if (!channel_types.includes(a.channel_type))
      channel_types.push(a.channel_type);
  });
  return channel_types;
}
function getDataForChart(data, selectedChannel) {
  const result = data.filter((a) => a.channel_type === selectedChannel);
  console.log(result);
  return result;
}
// Add Anime.js animation to slide in the barChartContainer div when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Get a reference to the barChartContainer div
  const barChartContainer = document.getElementById("barChartContainer");
  // Define the initial state (off-screen to the left)
  const initialPosition = {
    translateX: "0%",
  };
  // Define the target state (on-screen)
  const targetPosition = {
    translateX: "100%",
  };
  // Set up the animation using Anime.js
  anime({
    targets: barChartContainer,
    duration: 700, // Duration in milliseconds
    easing: "easeInExpo", // Easing function
    autoplay: true, // Start the animation automatically
    ...initialPosition, // Set the initial state
    complete: () => {
      // Animation complete callback
      fetchData((data) => {
        // Call your chart rendering functions with the fetched data
        createBarChartPlotly(data);
      });
    },
  });
});
