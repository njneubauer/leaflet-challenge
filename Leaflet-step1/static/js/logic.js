var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(function(data){
    createFeatures(data.features);
});

function getColor(d) {
    return  d <=  10 ? '#1a9850':
            d <=  30 ? '#91cf60':
            d <=  50 ? '#d9ef8b':
            d <=  70 ? '#fee08b':
            d <=  90 ? '#fc8d59':
                       '#d73027'
};


function createFeatures(earthquakeData){
    
    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr> <p>" + "Magnitude: " 
        + feature.properties.mag + "<br />" + "Depth: " + feature.geometry.coordinates[2] + "</p>")
    }

 
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng){
            return new L.circleMarker(latlng, {
                radius: feature.properties.mag*3,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            })
        }
    });
    createMap(earthquakes);
};

function createMap(earthquakes) {

    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [street, earthquakes]
    });

        
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);


    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);



};











