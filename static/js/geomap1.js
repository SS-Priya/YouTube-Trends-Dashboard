// Store API endpoint as url
let url = "http://127.0.0.1:5000/youtube-data-json";


// Perform a GET request to the url
d3.json(url).then(function(data) {
    console.log(data)


// Initialise arrays
// Access id, latitude, Longitude
let currentchannel = data[0].youtube_name;
let currentLatitude = data[0].latitude;
let currentLongitude = data[0].longitude;
let currentPopulation = data[0].population;
let currentSubscribers = data[0].subscribers;

// Do something with the values (e.g., display them)
console.log("Current Channel:", currentchannel);
console.log("Current Latitude:", currentLatitude);
console.log("Current Longitude:", currentLongitude);
console.log("Current Population:", currentPopulation);
console.log("Current Subscribers:", currentSubscribers);

// Define a markerSize() function that accepts a value and a type
  function markerSize(value, type) {
    if (type === "subscribers") {
      return Math.sqrt(value) * 10;
    } else if (type === "population") {
      return Math.sqrt(value) * 5;
    
    }
  }

// Define a map object.
let myMap = L.map("map", {
    center: [30.5994, 90.6731],
    zoom: 5,

  });
  
  // Define array to hold population and subscribers
  let subscribersMarker = [];
  let populationMarker = [];
 
  
  // Loop through the data
  for (let i = 0; i < data.length; i++) {
    const { latitude, longitude, subscribers, population, youtube_name, country, highest_yearly_earnings, category } = data[i];
    
    // Calculate marker size based on subscribers
    const subscribersSize = markerSize(subscribers, "subscribers");
  
    // Calculate marker size based on population
    const populationSize = markerSize(population, "population");

    
  
    // Create Circle markers for both subscribers and population
    subscribersMarker.push(
    
        L.marker([latitude, longitude], {
            draggable: true,
            fillOpacity: 0.75,
            color: "purple",
            fillColor: "purple",
            radius: subscribersSize,
        }).bindPopup(`<h2>Youtube Name: ${youtube_name}</h2> 
        <hr> <h3>Country: ${country}</h3> <hr>
        <hr> <h3>Category: ${category}</h3> <hr>
        <hr> <h3>Subscribers: ${subscribers.toLocaleString()}</h3> <hr>
        <hr> <h3>Population: ${population.toLocaleString()}</h3>
        `).addTo(myMap)
    );
    
    populationMarker.push(
    
        L.circle([latitude, longitude], {
            
            fillOpacity: 0.75,
            color: "purple",
            fillColor: "purple",
            radius: populationSize,
         }).bindPopup(`<h2>Youtube Name: ${youtube_name}</h2> 
         <hr> <h3>Country: ${country}</h3> <hr>
         <hr> <h3>Category: ${category}</h3> <hr>
         <hr> <h3>Subscribers: ${subscribers.toLocaleString()}</h3> <hr>
         <hr> <h3>Population: ${population.toLocaleString()}</h3>
         `).addTo(myMap)
    );

  }
// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create two separate layer groups: one for the city markers and another for the state markers.
let subscribers = L.layerGroup(subscribersMarker);
let population = L.layerGroup(populationMarker);


// Create a baseMaps object.
let baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};

// Create an overlay object.
let overlayMaps = {
  "Subscribers": subscribers,
  "Population": population,

};
// Add our "street" map tile layer to the map
street.addTo(myMap);

// Pass our map layers to our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

});