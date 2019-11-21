
// Function to determine marker size.
//markersize
function magSize(feature) {
    return feature.properties.mag * 2.5;
  }
  
  // Loop through the data and create colors for each earthquake range
  function magcolor(feature){
  
      if (feature.properties.mag <= 1) {
        return color = "#00ffff";
      }
      else if (feature.properties.mag <= 2) {
        return color = "#DAF7A6";
      }
      else if (feature.properties.mag <= 3) {
        return color = "#ffff00";
      }
        else if (feature.properties.mag <= 4) {
          return color = "#FFC300";
      }
      else {
        return color = "#ff0000";
      }
  }
  
  // Store our API endpoint inside queryUrl
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Perform a GET request to the query URL
  d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    //createFeatures(data.features);
    console.log(data);
  
    var earthquakes = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        var geojsonMarker = {
          radius: magSize(feature),
          fillColor: magcolor(feature),
          
          weight: 1.2,
          opacity: 1,
          fillOpacity: 0.8
        };
      
        return L.circleMarker(latlng, geojsonMarker);
      },
  
    onEachFeature: function (feature, layer) {
      return layer.bindPopup("<h3>" + feature.properties.place + 
           "</h3><hr><p>" + new Date(feature.properties.time) + ", Mag: " + feature.properties.mag + "</p>");
      
    }
  
    });
  
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  })
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets-satellite",
      accessToken: API_KEY
    });
  
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Light Map": lightmap,
      "Dark Map": darkmap,
      "Satellite": satelitemap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Creating map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 10,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  
    // Create the legend
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            margin = [0, 10, 20, 30, 100, 300, 500, 1000],
            labels = [];
            div.innerHTML += "<h4 style='margin:4px'>Magnitudes</h4>"

        // loop through density intervals and generate labels for each interval
        for (var i = 0; i < margin.length; i++) {
            div.innerHTML += 
                '<i style="background:' + getColor(margin[i] + 1) + '"></i> ' +
                margin[i] + (margin[i + 1] ? '&ndash;' + margin[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
  
    // Adding legend to the map
    legend.addTo(myMap);
  
  
  });