// @Date    : 2018-07-15 18:55:01
// @Author  : Chao Ma (cma1@kent.edu)
// @Website : http://vis.cs.kent.edu/NeighborVis/
// @Link    : https://github.com/AlexMa1989
// @Version : $Id$

/*
    map.js
    Note: this file contain functions of Map View
*/

var MAP = MAP || {};


MAP.tweetIDs;
MAP.tweets;
MAP.timeFilter;
MAP.shapeFiles = L.layerGroup();
MAP.marker = L.layerGroup();
MAP.markerGlobal = L.layerGroup();
MAP.QueryIndex = 0;

//map layers
MAP.map = L.map('map').setView([40.646722, -73.933333], 13); // current leaflet map

var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicGFybmRlcHUiLCJhIjoiY2l6dXZ5OXVkMDByZDMycXI2NGgyOGdyNiJ9.jyTchGQ8N1gjPdra98qRYg'
});

var google = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
    attribution: 'google'
});

var googleLayer = L.tileLayer('http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: 'google'
});

var drawnItems = L.featureGroup();

L.control.layers({
    "Map": osm.addTo(MAP.map),
    "Google Map": googleLayer,
    "Satellite": google
}, {
    'drawlayer': drawnItems
}, {
    position: 'topleft',
    collapsed: true
}).addTo(MAP.map);

var editableLayers = new L.FeatureGroup();
MAP.map.addLayer(editableLayers);


//leaflet draw options
var options = {
    position: 'topleft',
    draw: {
        polyline: false,
        polygon: {
            metric: false,
            showArea: true,
            allowIntersection: true,
            drawError: {
                color: '#b00b00',
                timeout: 1000
            },
            shapeOptions: {
                color: '#315f96',
                fillOpacity: 0.2,
                weight: 0,
                clickable: true
            }
        },
        circle: {
            showArea: true,
            metric: false,
            allowIntersection: true,
            drawError: {
                color: 'red',
                message: '<strong>Drawing shape error<strong>'
            },
            shapeOptions: {
                color: '#c4a125',
                fillOpacity: 0.3,
                weight: 0.5,
                clickable: true
            }
        }, // Turns off this drawing tool
        rectangle: {
            metric: false,
            showArea: true,
            allowIntersection: true,
            drawError: {
                color: '#b00b00',
                timeout: 1000
            },
            shapeOptions: {
                color: '#b65fe2',
                fillOpacity: 0.2,
                weight: 0,
                clickable: true
            }
        },
        marker: false
    },
    // edit: {
    //     featureGroup: editableLayers, //REQUIRED!!
    //     remove: false
    // }
};

var drawControl = new L.Control.Draw(options);
drawControl.addTo(MAP.map);

MAP.popup = L.popup({
    maxWidth: 330
});


//leaflet draw methods
MAP.map.on('draw:created', function(e) {
    var type = e.layerType,
        layer = e.layer;
    console.log(e);
    // Add drawing layer to map
    editableLayers.addLayer(layer);
    switch (type) {
        case 'circle':
            MAP.clear();
            var index = MAP.QueryIndex + 1;
            var id = 'query' + index; //****************
            var collLengh = QUERY.collectionNameList.length;
            var type = "circle"
            var geoInfo = [layer._latlng.lat, layer._latlng.lng, layer._mRadius];
            var keywords = document.getElementsByName('searchKeysReg')[0].value;
            var situation = document.getElementsByName('searchSituReg')[0].value;
            var datefrom = document.getElementById('datefrom').value;
            var dateto = document.getElementById('dateto').value;
            var fromToFilter = datefrom + " " + dateto;

            $('#keywordFilter').text(keywords);
            $('#situFilter').text(situation);
            $('#FromToFilter').text(fromToFilter.toString());

            var attribute = new AREA.eachQuery(id, QUERY.collectionNameList, type, geoInfo, layer, keywords, situation, datefrom, dateto);
            AREA.queryList.push(attribute);

            // get result in circle
            for (i = 0; i < QUERY.collectionNameList.length; i++) {
                var split = QUERY.collectionNameList[i].split(",");
                var collName = split[0];
                var collColor = split[1];
                QUERY.getCircleQueryResult(layer._latlng.lat, layer._latlng.lng, layer._mRadius, layer, collName, collColor, id, keywords, situation, datefrom, dateto);
            }

            AREA.updateQueryTable(id, collLengh);
            AREA.updateInfo(id, QUERY.collectionNameList, layer);

            MAP.QueryIndex = index;
            break;
        case 'rectangle':
            MAP.clear();
            var index = MAP.QueryIndex + 1;
            var id = 'query' + index; //****************
            var collLengh = QUERY.collectionNameList.length;
            var type = "rectangle"
            var geoInfo = [layer._latlngs[0]];
            var keywords = document.getElementsByName('searchKeysReg')[0].value;
            var situation = document.getElementsByName('searchSituReg')[0].value;
            var datefrom = document.getElementById('datefrom').value;
            var dateto = document.getElementById('dateto').value;
            var fromToFilter = datefrom + " " + dateto;

            $('#keywordFilter').text(keywords);
            $('#situFilter').text(situation);
            $('#FromToFilter').text(fromToFilter.toString());

            var attribute = new AREA.eachQuery(id, QUERY.collectionNameList, type, geoInfo, layer, keywords, situation, datefrom, dateto);
            AREA.queryList.push(attribute);

            // get result in circle
            for (i = 0; i < QUERY.collectionNameList.length; i++) {
                var split = QUERY.collectionNameList[i].split(",");
                var collName = split[0];
                var collColor = split[1];
                QUERY.getpolygonQueryResult(layer._latlngs[0], layer, collName, collColor, id, keywords, situation, datefrom, dateto);
            }

            AREA.updateQueryTable(id, collLengh);
            AREA.updateInfo(id, QUERY.collectionNameList, layer);

            MAP.QueryIndex = index;

            break;
        case 'polygon':
            MAP.clear();
            var index = MAP.QueryIndex + 1;
            var id = 'query' + index; //****************
            var collLengh = QUERY.collectionNameList.length;
            var type = "polygon"
            var geoInfo = [layer._latlngs[0]];
            var keywords = document.getElementsByName('searchKeysReg')[0].value;
            var situation = document.getElementsByName('searchSituReg')[0].value;
            var datefrom = document.getElementById('datefrom').value;
            var dateto = document.getElementById('dateto').value;
            var fromToFilter = datefrom + " " + dateto;

            $('#keywordFilter').text(keywords);
            $('#situFilter').text(situation);
            $('#FromToFilter').text(fromToFilter.toString());

            var attribute = new AREA.eachQuery(id, QUERY.collectionNameList, type, geoInfo, layer, keywords, situation, datefrom, dateto);
            AREA.queryList.push(attribute);


            // get result in circle
            for (i = 0; i < QUERY.collectionNameList.length; i++) {
                var split = QUERY.collectionNameList[i].split(",");
                var collName = split[0];
                var collColor = split[1];
                QUERY.getpolygonQueryResult(layer._latlngs[0], layer, collName, collColor, id, keywords, situation, datefrom, dateto);
            }

            AREA.updateQueryTable(id, collLengh);
            AREA.updateInfo(id, QUERY.collectionNameList, layer);

            MAP.QueryIndex = index;

            break;
    }
});



// Initailize map
MAP.Initialize = function(tweets, collName, collColor) {
    // MAP.clear();

    window[collName] = L.layerGroup();
    window[collName + "legend"] = L.control({
        position: 'bottomleft'
    });

    MAP.drawMarker(tweets, collName, collColor);
}



// Clear all layers
MAP.clear = function() {
    console.log('Clear all map layers');

    var collections = DataManager.getCollections();
    console.log(collections);
    var collLen = collections.length;
    MAP.shapeFiles.clearLayers();

    for (i = 0; i < collLen; i++) {
        var collName = collections[i];
        // MAP.map.removeLayer(window[collName]);
        window[collName].clearLayers();
        MAP.map.removeControl(window[collName + "legend"]);

    }

}

MAP.clearGolobal = function() {

    var collections = DataManager.getCollections();
    var collLen = collections.length;

    for (i = 0; i < collLen; i++) {
        var collName = collections[i];
        var globalMarker = "global" + collName;
        var globalHeat = "heat" + collName;
        window[globalMarker].clearLayers();
        MAP.map.removeLayer(window[globalHeat]);


    }

}

// Draw marker layers
MAP.drawMarker = function(tweets, collName, collColor) {

    // Clear all marker layers

    var markerPos = [];
    var locationStr = [];

    // Adding the position of marker (no duplicate)
    var i = 0;
    var len = tweets.length;
    for (i; i < len; i++) {
        var latitude = tweets[i].loc.coordinates[1];
        var longitude = tweets[i].loc.coordinates[0];
        var time = tweets[i].pdatetime;
        var situation = tweets[i].pcategory;
        var description = tweets[i].ptext;

        var locationString = latitude + ',' + longitude;
        if (!locationStr.includes(locationString)) {
            var tweets_count = 1;
            var position = [situation, latitude, longitude, time, description, tweets_count];
            locationStr.push(locationString);
            markerPos.push(position);
        } else {
            // Increase tweet count at the same location
            var j = 0;
            var j_len = markerPos.length;
            for (j; j < j_len; j++) {
                if (markerPos[j][1] === latitude && markerPos[j][2] === longitude) {
                    markerPos[j][5] = markerPos[j][5] + 1;
                }
            }

        }
    }


    var n = 0;
    var n_len = markerPos.length;

    var count_list = [];

    for (k = 0; k < n_len; k++) {
        var tweet_count = markerPos[k][5];
        count_list.push(tweet_count);
    }

    var max = Math.max(...count_list);
    var min = 1;

    var max_1 = Math.round(max * 0.25);
    var max_2 = Math.round(max * 0.5);
    var max_3 = Math.round(max * 0.75);


    window[collName + "legend"].onAdd = function(map) {

        var div = L.DomUtil.create('div', 'info legend'),
            labels = ['<strong> ' + collName + ' </strong> <br /> <br />'];

        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML = labels.join('<br />');
        div.innerHTML += '<i style="background:' + collColor + '"></i> ' + tweets.length + '<br>' + '<br>';

        return div;
    };

    window[collName + "legend"].addTo(MAP.map);


    for (n; n < n_len; n++) {
        var situation = markerPos[n][0];
        var lat = parseFloat(markerPos[n][1]); // latitude
        var lng = parseFloat(markerPos[n][2]); // longitude
        var time = markerPos[n][3];
        var description = markerPos[n][4];
        var tweet_count = markerPos[n][5];


        if (tweet_count === min) {
            window[collName].addLayer(L.circleMarker([lat, lng], {
                fillColor: collColor.toString(),
                color: '#000',
                fillOpacity: 0.3,
                weight: 1,
                radius: 5
            }).bindPopup("<span class = 'popFont'> Date:" + time + "<br />" + "Category:" + situation + "<br />" + "Text:" + description + "<br /> </span>").on('click', markerClick));
        } else if (tweet_count > min && tweet_count <= max_1) {

            window[collName].addLayer(L.circleMarker([lat, lng], {
                fillColor: collColor.toString(),
                color: '#000',
                fillOpacity: 0.5,
                weight: 1,
                radius: 5
            }).on('click', markerClick));

        } else if (tweet_count > max_1 && tweet_count <= max_2) {

            window[collName].addLayer(L.circleMarker([lat, lng], {
                fillColor: collColor.toString(),
                color: '#000',
                fillOpacity: 0.7,
                weight: 1,
                radius: 5
            }).on('click', markerClick));

        } else if (tweet_count > max_2 && tweet_count <= max_3) {

            window[collName].addLayer(L.circleMarker([lat, lng], {
                fillColor: collColor.toString(),
                color: '#000',
                fillOpacity: 0.9,
                weight: 1,
                radius: 5
            }).on('click', markerClick));

        } else if (tweet_count > max_3 && tweet_count <= max) {

            window[collName].addLayer(L.circleMarker([lat, lng], {
                fillColor: collColor.toString(),
                color: '#000',
                fillOpacity: 1,
                weight: 1,
                radius: 5
            }).on('click', markerClick));

        }

    }

    MAP.map.addLayer(window[collName]);

    function markerClick(e) {
        var resultList = [];

        var lat = this.getLatLng().lat;
        var lng = this.getLatLng().lng;

        var len = tweets.length;
        for (w = 0; w < len; w++) {
            var latitude = tweets[w].loc.coordinates[1];
            var longitude = tweets[w].loc.coordinates[0];

            if (lat === latitude && lng === longitude) {
                resultList.push(tweets[w]);
            }
        }

        var streetLat = resultList[0].loc.coordinates[1];
        var streetLon = resultList[0].loc.coordinates[0];

        var streetInfo = streetLat.toString() + "  " + streetLon.toString();


        if (resultList.length !== 1) {
            var content = '<div class="panel panel-default labelPanelSize"> <div class="panel-heading"><span>' + streetInfo + '</span> <button id="markerinfoButton" class="btn btn-sm btn-primary" title="update" data-toggle="collapse" data-target="#markerinfoPanel" aria-hidden="true"> <span class="glyphicon glyphicon-question-sign customGlyphicon"></span></button> </div><ul class="nav nav-tabs nav-billBoard" style="display: none;"><li class="leftNav active"><a data-toggle="tab" href="#labelTime">Timeline</a></li><li class="leftNav"><a data-toggle="tab" href="#labelKey">Keywords</a></li></ul><div class="panel-body"><div class="tab-content"><div id="labelTime" class="tab-pane fade in active"> <div id="markerinfoPanel" class="panel panel-collapse collapse"><div class="panel-body"><center><strong>User could zoom-in, zoom-out and drag on time-line panel to interact with timeline, to click each pin get the report information </strong></center></div></div> <div id="markerTime"></div><div id = "timeLineInfo"></div><div id="labelKey" class="tab-pane fade"><div id="markerKey"></div></div><div id="labelSitu" class="tab-pane fade"><div id="markerSitu"></div></div><div id="labelInfo" class="tab-pane fade"><div id="area-marker"><table id="area-marker-table" class="table table-hover table-condensed"><thead><tr><th>Time</th><th>Category</th><th>Streets</th></tr></thead><tbody></tbody></table></div></div></div></div></div>';

            MAP.popup.setLatLng(e.latlng).setContent(content).openOn(MAP.map);
            // MAP.popup.setLatLng(e.latlng).setContent('<div class = "popupCustom"> <span> This place at <font color="red">' + streetInfo.toString() + '</font> contains <font color="red">' + resultList.length + '</font> reports </span></div> <div id="markerTime"></div> <div><button id="clickAdd" class="clickAdd btn-success" type="button"><span class="fontSize glyphicon glyphicon-ok-sign">&nbsp;ToQueryManager</span></button></div>').openOn(MAP.map);
            AREA.updateStoryLineChart(resultList);

            $('#clickAdd').unbind().on('click', function() {

                var layer = '';

                var timeFilter = MAP.timeFilterTweets(resultList);
                MAP.markerInitialize(timeFilter);


            });


        }


    }


}


MAP.drawGlobalMarker = function(tweets, collName, collColor) {

    var globalName = "global" + collName;

    MAP.map.removeLayer(window[globalName]);


    // Adding the position of marker (no duplicate)

    if (tweets !== undefined) {

        var markerPos = [];
        var locationStr = [];

        var i = 0;
        var len = tweets.length;
        for (i; i < len; i++) {
            var latitude = tweets[i].loc.coordinates[1];
            var longitude = tweets[i].loc.coordinates[0];

            var locationString = latitude + ',' + longitude;
            if (!locationStr.includes(locationString)) {
                var tweets_count = 1;
                var position = [latitude, longitude, tweets_count];
                locationStr.push(locationString);
                markerPos.push(position);
            } else {
                // Increase tweet count at the same location
                var j = 0;
                var j_len = markerPos.length;
                for (j; j < j_len; j++) {
                    if (markerPos[j][0] === latitude && markerPos[j][1] === longitude) {
                        markerPos[j][2] = markerPos[j][2] + 1;
                    }
                }

            }
        }


        var n = 0;
        var n_len = markerPos.length;

        for (n; n < n_len; n++) {
            var lat = parseFloat(markerPos[n][0]); // latitude
            var lng = parseFloat(markerPos[n][1]); // longitude


            window[globalName].addLayer(L.circleMarker([lat, lng], {
                fillColor: collColor,
                color: '#000',
                weight: 0.1,
                fillOpacity: 0.6,
                radius: 3
            }));
        }

        MAP.map.addLayer(window[globalName]);

    }


}

MAP.getHeatMapData = function(tweets) {
    var data = [];
    var dateSeries = [];
    for (var i = 0; i < tweets.length; i++) {
        var latitude = tweets[i].loc.coordinates[1];
        var longitude = tweets[i].loc.coordinates[0];
        var location = latitude.toString() + ',' + longitude.toString();
        dateSeries.push(location);
    }
    dateSeries.sort();
    var k = 0;
    var k_len = dateSeries.length;
    var date = [],
        tweetCount = [],
        prev;
    for (k; k < k_len; k++) {
        if (dateSeries[k] != prev) {
            date.push(dateSeries[k]);
            tweetCount.push(1);
        } else {
            tweetCount[tweetCount.length - 1]++;
        }
        prev = dateSeries[k];
    }

    var j = 0;
    var j_len = date.length;
    for (j; j < j_len; j++) {
        var member = {
            x: date[j],
            y: tweetCount[j]
        }
        data.push(member);
    }


    return data;
}

MAP.drawHeatmap = function(tweets, collName) {

    // Clear all heatmap layers
    var heatName = "heat" + collName;

    MAP.map.removeLayer(window[heatName]);

    var heatData = MAP.getHeatMapData(tweets);

    var i = 0;
    var len = heatData.length;
    var heatmapList = [];
    for (i; i < len; i++) {
        var location = heatData[i].x.split(",");
        var latitude = parseFloat(location[0]);
        var longitude = parseFloat(location[1]);
        var count = parseInt(heatData[i].y);
        heatmapList.push([latitude, longitude, count]);
    }

    console.log(tweets)

    // Create heatmap layer

    if (tweets.length < 2000) {
        window[heatName] = L.heatLayer(heatmapList, {
            radius: 100,
            blur: 15,
            maxZoom: 20,
            minOpacity: 0.7
        });

        MAP.map.addLayer(window[heatName]);
    } else if (tweets.length >= 2000 && tweets.length < 5000) {
        window[heatName] = L.heatLayer(heatmapList, {
            radius: 80,
            blur: 15,
            maxZoom: 20,
            minOpacity: 0.7
        });

        MAP.map.addLayer(window[heatName]);
    } else if (tweets.length >= 5000 && tweets.length < 10000) {
        window[heatName] = L.heatLayer(heatmapList, {
            radius: 60,
            blur: 15,
            maxZoom: 20,
            minOpacity: 0.7
        });

        MAP.map.addLayer(window[heatName]);
    } else if (tweets.length >= 10000 && tweets.length < 20000) {
        window[heatName] = L.heatLayer(heatmapList, {
            radius: 40,
            blur: 15,
            maxZoom: 20,
            minOpacity: 0.7
        });

        MAP.map.addLayer(window[heatName]);
    } else if (tweets.length >= 20000 && tweets.length < 40000) {
        window[heatName] = L.heatLayer(heatmapList, {
            radius: 20,
            blur: 15,
            maxZoom: 20,
            minOpacity: 0.7
        });

        MAP.map.addLayer(window[heatName]);
    } else if (tweets.length >= 40000 && tweets.length < 80000) {
        window[heatName] = L.heatLayer(heatmapList, {
            radius: 15,
            blur: 15,
            maxZoom: 20,
            minOpacity: 0.7
        });

        MAP.map.addLayer(window[heatName]);
    } else if (tweets.length >= 80000) {
        window[heatName] = L.heatLayer(heatmapList, {
            radius: 10,
            blur: 15,
            maxZoom: 20,
            minOpacity: 0.7
        });

        MAP.map.addLayer(window[heatName]);
    }

}

MAP.onChangeShape = function(event) {

    var shapeTable = $('#area-shape-table tbody');

    var file = event.target.files[0];
    var reader = new FileReader();

    shapeTable.empty();

    reader.onload = function(progressEvent) {
        // By lines
        shp(this.result).then(function(data) {

            for (var i = 0; i < data.length; i++) {
                var shapeName = "Shape" + (i + 1);
                var shapeInfo = data[i].fileName;
                var newRow = '<tr id="' + i + '"><td>' + shapeName + '</td><td class = "shapeSlider" id="' + i + '">' + shapeInfo + '</td></tr>';
                shapeTable.append(newRow);
            }

            $('#area-shape-table').unbind().on('click', 'tbody tr', function() {


                $(this).prevAll('tr').removeClass("active111");
                $(this).nextAll('tr').removeClass("active111");
                $(this).toggleClass("active111");

                var id = this.id;
                var shapeList = [];

                var ac_shpfile = new L.Shapefile(data[id], {
                    onEachFeature: function(feature, layer) {
                        /* Add some colors based on shapefile features */

                        var latLng = layer._latlngs[0];
                        var layer = layer;

                        var list = [latLng, layer];
                        shapeList.push(list);


                    }
                });

                var latLng = shapeList[2][0];
                var layer = shapeList[2][1];

                MAP.clear();

                var index = MAP.QueryIndex + 1;
                var id = 'query' + index; //****************
                var collLengh = QUERY.collectionNameList.length;
                var type = "polygon";
                var geoInfo = [layer._latlngs[0]];
                var keywords = document.getElementsByName('searchKeysReg')[0].value;
                var situation = document.getElementsByName('searchSituReg')[0].value;
                var datefrom = TOOL.parseDate(document.getElementById('datefrom').value);
                var dateto = TOOL.parseDate(document.getElementById('dateto').value);

                var attribute = new AREA.eachQuery(id, QUERY.collectionNameList, type, geoInfo, layer, keywords, situation, datefrom, dateto);
                AREA.queryList.push(attribute);

                // get result in circle
                for (i = 0; i < QUERY.collectionNameList.length; i++) {
                    var split = QUERY.collectionNameList[i].split(",");
                    var collName = split[0];
                    var collColor = split[1];
                    QUERY.getpolygonQueryResult(latLng, layer, collName, collColor, id, keywords, situation);
                }

                AREA.updateQueryTable(id, collLengh);
                AREA.updateInfo(id, QUERY.collectionNameList, layer);

                MAP.QueryIndex = index;


                MAP.shapeFiles = ac_shpfile;
                MAP.map.addLayer(MAP.shapeFiles);


            });


        });

    };
    reader.readAsArrayBuffer(file);
}



MAP.lunrFilter = function(getInputKey, getInputCategory, getTimeFrom, getTimeTo, tweets, collName, collColor) {
    MAP.clear();

    window[collName] = L.layerGroup();
    window[collName + "legend"] = L.control({
        position: 'bottomleft'
    });

    if (getInputKey === "" && getInputCategory === "" && getTimeFrom === "" && getTimeTo === "") {

        MAP.drawMarker(tweets, collName, collColor);
        AREA.addNewFunctions(tweets, collName, collColor);

    } else {

        var idxKey = lunr(function() {
            this.ref('id')
            this.field('ptext')

            tweets.forEach(function(doc) {
                this.add(doc)
            }, this)
        })

        var idxDes = lunr(function() {
            this.ref('id')
            this.field('pcategory')

            tweets.forEach(function(doc) {
                this.add(doc)
            }, this)
        })


        var idResultKey = idxKey.search(getInputKey);
        var idResultDes = idxDes.search(getInputCategory);

        var lenKey = idResultKey.length;
        var lenDes = idResultDes.length;

        var idListKey = [];
        var idListDes = [];
        var idListTime = [];


        var tweetsList = [];
        var resultList = [];

        for (i = 0; i < lenKey; i++) {
            var idValue = parseInt(idResultKey[i]['ref']);
            idListKey.push(idValue);
        }
        for (i = 0; i < lenDes; i++) {
            var idValue = parseInt(idResultDes[i]['ref']);
            idListDes.push(idValue);
        }


        if ((getTimeFrom.match(new RegExp("/", "g")) || []).length === 2) {
            var datefrom = TOOL.parseDate(getTimeFrom);
            var dateto = TOOL.parseDate(getTimeTo);


            for (var i = 0; i < tweets.length; i++) {
                var dateAll = tweets[i].pdatetime;
                var date = dateAll.split(" ");
                var datefromdata = TOOL.parseDate(date[0].replace(/-/g, "/"));

                if (dateto >= datefromdata && datefrom <= datefromdata) {
                    idListTime.push(parseInt(tweets[i].id));
                }
            }
        } else if ((getTimeFrom.match(new RegExp("/", "g")) || []).length === 1) {
            var datefrom = TOOL.parseDate(getTimeFrom);
            var dateto = TOOL.parseDate(getTimeTo);

            for (var i = 0; i < tweets.length; i++) {
                if (tweets[i].pdatetime === undefined) {
                    idListTime = [];
                } else {
                    var date_splited = tweets[i].pdatetime.split(" ");
                    var date = date_splited[0];
                    var month = date.substring(0, date.lastIndexOf('-'));
                    var datefromdata = TOOL.parseDate(month.replace(/-/g, "/"));

                    if (dateto >= datefromdata && datefrom <= datefromdata) {
                        idListTime.push(parseInt(tweets[i].id));
                    }
                }
            }
        } else if ((getTimeFrom.match(new RegExp("/", "g")) || []).length === 0) {
            var datefrom = TOOL.parseDate(getTimeFrom);
            var dateto = TOOL.parseDate(getTimeTo);
            for (var i = 0; i < tweets.length; i++) {
                if (tweets[i].pdatetime === undefined) {
                    idListTime = [];
                } else {
                    var date_splited = tweets[i].pdatetime.split(" ");
                    var date = date_splited[0];
                    var year = date.substring(0, date.indexOf('-'));
                    var datefromdata = TOOL.parseDate(year.replace(/-/g, "/"));

                    if (dateto >= datefromdata && datefrom <= datefromdata) {
                        idListTime.push(parseInt(tweets[i].id));
                    }
                }
            }
        }


        if (idListKey.length !== 0) {
            tweetsList.push(idListKey);
        }

        if (idListDes.length !== 0) {
            tweetsList.push(idListDes);
        }

        if (idListTime.length !== 0) {
            tweetsList.push(idListTime);
        }

        var result = tweetsList.shift().filter(function(v) {
            return tweetsList.every(function(a) {
                return a.indexOf(v) !== -1;
            });
        });

        for (i = 0; i < tweets.length; i++) {
            var id = parseInt(tweets[i].id);
            if (result.includes(id)) {
                resultList.push(tweets[i]);
            }
        }

        MAP.drawMarker(resultList, collName, collColor);
        AREA.addNewFunctions(resultList, collName, collColor);

    }
}

MAP.timeFilterTweets = function(tweets) {

    MAP.timeFilter = [];

    var datefrom = TOOL.parseDate(document.getElementById('datefrom').value);
    var dateto = TOOL.parseDate(document.getElementById('dateto').value);
    for (var i = 0; i < tweets.length; i++) {
        var datefromdata = TOOL.parseDate(tweets[i].pdatetime.replace(/-/g, "/"));
        if (dateto >= datefromdata && datefrom <= datefromdata) {
            MAP.timeFilter.push(tweets[i]);
        }
    }

    return MAP.timeFilter

}


MAP.lunrStory = function(getInputKey, getInputDes, tweets) {
    MAP.clear();
    MAP.markerNarr.clearLayers();
    MAP.markerNarr1.clearLayers();
    var tweetsNarr = QUERY.getAllNarrData();
    var tweetsNarr1 = QUERY.getAllNarrData1();


    if (getInputKey === "" && getInputDes === "" && getInputStr === "" && getGender === "" && getAge === "") {

    } else {

        var idxKey = lunr(function() {
            this.ref('id')
            this.field('ptext')

            tweets.forEach(function(doc) {
                this.add(doc)
            }, this)
        })

        var idxDes = lunr(function() {
            this.ref('id')
            this.field('pcategory')

            tweets.forEach(function(doc) {
                this.add(doc)
            }, this)
        })


        var idResultKey = idxKey.search(getInputKey);
        var idResultDes = idxDes.search(getInputDes);
        // var idResultGen = idxGender.search(getGender);

        var lenKey = idResultKey.length;
        var lenDes = idResultDes.length;
        // var lenGen = idResultGen.length;

        var idListKey = [];
        var idListDes = [];


        var tweetsList = [];
        var resultList = [];

        for (i = 0; i < lenKey; i++) {
            var idValue = parseInt(idResultKey[i]['ref']);
            idListKey.push(idValue);
        }
        for (i = 0; i < lenDes; i++) {
            var idValue = parseInt(idResultDes[i]['ref']);
            idListDes.push(idValue);
        }



        if (idListKey.length !== 0) {
            tweetsList.push(idListKey);
        }

        if (idListDes.length !== 0) {
            tweetsList.push(idListDes);
        }

        var merged = [].concat.apply([], tweetsList);

        if (merged.length === 0) {
            var empty = [];
            return empty;
        } else {
            var result = tweetsList.shift().filter(function(v) {
                return tweetsList.every(function(a) {
                    return a.indexOf(v) !== -1;
                });
            });

            for (t = 0; t < tweets.length; t++) {
                var id = parseInt(tweets[t].id);
                if (result.includes(id)) {
                    resultList.push(tweets[t]);
                }
            }

        }

        var layer = '';

        var timeFilter = MAP.timeFilterTweets(resultList);


    }
}

MAP.lunrStoryRegion = function(getInputKey, getInputDes, tweets) {


    if (getInputKey === "" && getInputDes === "") {

        return tweets;

    } else {

        var idxKey = lunr(function() {
            this.ref('id')
            this.field('ptext')

            tweets.forEach(function(doc) {
                this.add(doc)
            }, this)
        })

        var idxDes = lunr(function() {
            this.ref('id')
            this.field('pcategory')

            tweets.forEach(function(doc) {
                this.add(doc)
            }, this)
        })


        var idResultKey = idxKey.search(getInputKey);
        var idResultDes = idxDes.search(getInputDes);

        var lenKey = idResultKey.length;
        var lenDes = idResultDes.length;

        var idListKey = [];
        var idListDes = [];

        var tweetsList = [];
        var resultList = [];

        for (i = 0; i < lenKey; i++) {
            var idValue = parseInt(idResultKey[i]['ref']);
            idListKey.push(idValue);
        }
        for (i = 0; i < lenDes; i++) {
            var idValue = parseInt(idResultDes[i]['ref']);
            idListDes.push(idValue);
        }


        if (idListKey.length !== 0) {
            tweetsList.push(idListKey);
        }

        if (idListDes.length !== 0) {
            tweetsList.push(idListDes);
        }

        var merged = [].concat.apply([], tweetsList);

        if (merged.length === 0) {
            var empty = [];
            return empty;
        } else {
            var result = tweetsList.shift().filter(function(v) {
                return tweetsList.every(function(a) {
                    return a.indexOf(v) !== -1;
                });
            });

            for (t = 0; t < tweets.length; t++) {
                var id = parseInt(tweets[t].id);
                if (result.includes(id)) {
                    resultList.push(tweets[t]);
                }
            }

        }

        return resultList;

    }
}