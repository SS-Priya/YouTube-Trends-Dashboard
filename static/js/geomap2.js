// A function to determine the marker size based on the highest yearly earnings
function markerSize(video_views) {
    return Math.sqrt(video_views);
  }
  
  // Define arrays to hold the created country markers.
  // let cityMarkers = [];
  let countryMarkers = [];
  // Initialised arrays
  let category = [];
  let youtube_name = [];
  let video_views = [];
  let subscribers = [];
  let youtubercountry = [];
  
  // For loop to populate arrays
  for (let j = 0; j < youtubedata.length; j++) {
    row = youtubedata[j];
    category.push(row.category);
    youtube_name.push(row.youtube_name);
    video_views.push(row.video_views);
    subscribers.push(row.subscribers);
  }
  // Loop through locations, and create the city and state markers.
  for (let i = 0; i < youtubedata.length; i++) {
    // Setting the marker radius for the state by passing highest yearly earnings into the markerSize function
  
    countryMarkers.push(
      L.circle([youtubedata[i].latitude,youtubedata[i].longitude], {
        stroke: false,
        fillOpacity: 0.75,
        color: "green",
        fillColor: "green",
        radius: markerSize(youtubedata[i].video_views)
      }).bindPopup(
        `<h2>${youtubedata[i].country}</h2>
        <p>Youtuber Name: ${youtubedata[i].youtube_name}</p>
        <p>Category: ${youtubedata[i].category}</p>
  
        <p>Highest Video Views: ${youtubedata[i].video_views.toLocaleString()}</p>`
      )
    );
  }
  
// Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  
  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  
  // Create two separate layer groups: one for the country markers.
  let country = L.layerGroup(countryMarkers);
  // let cities = L.layerGroup(cityMarkers);
  
  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };
  
  // Create an overlay object.
  let overlayMaps = {
    "Video Views": country,
    // "City Population": cities
  };
  
  // Define a map object.
  let myMap = L.map("map", {
    center: [-30.8, 130.9],
    zoom: 5,
    layers: [street, country]
  });
  
  // Pass our map layers to our layer control.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  