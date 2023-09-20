let countries = [];
let earnings = [];
let subscribers = [];
let categories = []; // New array for categories
let youtube_names = [];
// Sort the data by highest yearly earnings in descending order
youtubedata.sort((a, b) => b.highest_yearly_earnings - a.highest_yearly_earnings);

// Populate arrays with data for the top 20 countries
for (let i = 0; i < 518; i++) { // Loop through the top 20 data points
  const row = youtubedata[i];
  countries.push(row.country);
  earnings.push(row.highest_yearly_earnings);
  subscribers.push(row.subscribers);
  categories.push(row.category); 
  youtube_names.push(row.youtube_name);// Add category to the array
}

// Create a trace for the bubble chart
let trace = {
  x: countries,
  y: earnings,
  text: youtube_names,categories,
  mode: 'markers',
  marker: {
    size: subscribers.map(subscriber => Math.sqrt(subscriber) /500),
    color: earnings,
    colorscale: 'Viridis',
    colorbar: {
      title: 'Earnings',
      titleside: 'right'
    }
  }
};

// Create data array
let data = [trace];

// Apply a title to the layout
let layout = {
  title: 'Highest Yearly Earnings by Country in 2023',
  // xaxis: { title: 'Country' },
  yaxis: { title: 'Highest Yearly Earnings' },
  showlegend: false
};

// Render the bubble chart to the div tag with id "bubble-chart"
Plotly.newPlot('bubble-chart', data, layout);