// @Date    : 2018-07-15 18:55:01
// @Author  : Chao Ma (cma1@kent.edu)
// @Website : http://vis.cs.kent.edu/NeighborVis/
// @Link    : https://github.com/AlexMa1989
// @Version : $Id$

/*
    area.js
    Note: this file contain functions of Query to PHP
*/

var QUERY = QUERY || {};

// Queries php server uri
QUERY.circleQueryUri = "php/circleQuery.php";
QUERY.polygonQueryUri = "php/polygonQuery.php";
QUERY.rectangleQueryUri = "php/polygonQuery.php";
QUERY.selectAllQueryUri = "php/selectAll.php";

QUERY.collectionName;
QUERY.collectionNameList = [];

// Get queries in circle
QUERY.getCircleQueryResult = function(latitude, longitude, radius, layer, collName, collColor, id, keywords, situation, datefrom, dateto) {

    document.getElementById('loadingImage').style.display = 'block';
    var request = QUERY.circleQueryUri + "?lat=" + latitude + "&lng=" + longitude + "&radi=" + radius + "&coll=" + collName;


    // Retrieve query data via AJAX
    $.ajax({
        url: request,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function(circleQuery) {

            var hasTimeOrNot;

            var queryLength = circleQuery.length;
            if (queryLength !== 0) {
                if (circleQuery[0].pdatetime !== undefined) {
                    hasTimeOrNot = true;
                } else {
                    hasTimeOrNot = false;
                }
            }

            if (hasTimeOrNot === true) {
                var timeFilter = MAP.timeFilterTweets(circleQuery);

                var reportRes = MAP.lunrStoryRegion(keywords, situation, timeFilter);
                //console.log(circleQuery);
                // Create new area

                AREA.addNewArea(reportRes, layer, hasTimeOrNot, collName, collColor, keywords, situation, datefrom, dateto);
                AREA.updateTable(collName, id);
                // Draw a area on the map
                MAP.Initialize(reportRes, collName, collColor);
            } else {

                var reportRes = MAP.lunrStoryRegion(keywords, situation, circleQuery);
                //console.log(circleQuery);
                // Create new area
                AREA.addNewArea(reportRes, layer, hasTimeOrNot, collName, collColor, keywords, situation, datefrom, dateto);
                AREA.updateTable(collName, id);
                // Draw a area on the map
                MAP.Initialize(reportRes, collName, collColor);
            }


            document.getElementById('loadingImage').style.display = 'none';

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            queryResult = 0;
            alert("Query failed ... " + "\nStatus: " + textStatus + "\nError Message: " + errorThrown);
        }
    });

}

QUERY.getCircleQueryResultS = function(latitude, longitude, radius, layer, collName, collColor, id, keywords, situation, datefrom, dateto) {

    document.getElementById('loadingImage').style.display = 'block';
    var request = QUERY.circleQueryUri + "?lat=" + latitude + "&lng=" + longitude + "&radi=" + radius + "&coll=" + collName;


    // Retrieve query data via AJAX
    $.ajax({
        url: request,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function(circleQuery) {

            var hasTimeOrNot;

            var queryLength = circleQuery.length;
            if (queryLength !== 0) {
                if (circleQuery[0].pdatetime !== undefined) {
                    hasTimeOrNot = true;
                } else {
                    hasTimeOrNot = false;
                }
            }

            if (hasTimeOrNot === true) {
                var timeFilter = [];

                for (var i = 0; i < circleQuery.length; i++) {
                    var datefromdata = TOOL.parseDate(circleQuery[i].pdatetime.replace(/-/g, "/"));
                    if (dateto >= datefromdata && datefrom <= datefromdata) {
                        timeFilter.push(circleQuery[i]);
                    }
                }

                var reportRes = MAP.lunrStoryRegion(keywords, situation, timeFilter);

                MAP.Initialize(reportRes, collName, collColor);
            } else {

                var reportRes = MAP.lunrStoryRegion(keywords, situation, circleQuery);

                MAP.Initialize(reportRes, collName, collColor);
            }


            document.getElementById('loadingImage').style.display = 'none';

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            queryResult = 0;
            alert("Query failed ... " + "\nStatus: " + textStatus + "\nError Message: " + errorThrown);
        }
    });

}


QUERY.getpolygonQueryResult = function(coordinates, layer, collName, collColor, id, keywords, situation, datefrom, dateto) {
    document.getElementById('loadingImage').style.display = 'block';

    var coordString = "";

    for (var i = coordinates.length - 1; i >= 0; i--) {
        coordString += coordinates[i].lat + "," + coordinates[i].lng + ",";
    }
    //Close the loop
    coordString += coordinates[coordinates.length - 1].lat + "," + coordinates[coordinates.length - 1].lng


    var request = QUERY.polygonQueryUri + '?coor=' + coordString + "&coll=" + collName;

    // Retrieve query data via AJAX
    $.ajax({
        url: request,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function(rectangleQuery) {

            var hasTimeOrNot;

            var queryLength = rectangleQuery.length;
            if (queryLength !== 0) {
                if (rectangleQuery[0].pdatetime !== undefined) {
                    hasTimeOrNot = true;
                } else {
                    hasTimeOrNot = false;
                }
            }

            if (hasTimeOrNot === true) {
                var timeFilter = MAP.timeFilterTweets(rectangleQuery);

                var reportRes = MAP.lunrStoryRegion(keywords, situation, timeFilter);
                //console.log(circleQuery);
                // Create new area

                AREA.addNewArea(reportRes, layer, hasTimeOrNot, collName, collColor, keywords, situation, datefrom, dateto);
                AREA.updateTable(collName, id);
                // Draw a area on the map
                MAP.Initialize(reportRes, collName, collColor);
            } else {

                var reportRes = MAP.lunrStoryRegion(keywords, situation, rectangleQuery);
                //console.log(circleQuery);
                // Create new area
                AREA.addNewArea(reportRes, layer, hasTimeOrNot, collName, collColor, keywords, situation, datefrom, dateto);
                AREA.updateTable(collName, id);
                // Draw a area on the map
                MAP.Initialize(reportRes, collName, collColor);
            }


            document.getElementById('loadingImage').style.display = 'none';
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Query failed ... " + "\nStatus: " + textStatus + "\nError Message: " + errorThrown);
        }
    });

}

QUERY.getpolygonQueryResultS = function(coordinates, layer, collName, collColor, id, keywords, situation, datefrom, dateto) {
    document.getElementById('loadingImage').style.display = 'block';
    var coordString = "";

    for (var i = coordinates.length - 1; i >= 0; i--) {
        coordString += coordinates[i].lat + "," + coordinates[i].lng + ",";
    }
    //Close the loop
    coordString += coordinates[coordinates.length - 1].lat + "," + coordinates[coordinates.length - 1].lng


    var request = QUERY.polygonQueryUri + '?coor=' + coordString + "&coll=" + collName;

    // Retrieve query data via AJAX
    $.ajax({
        url: request,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function(rectangleQuery) {

            var hasTimeOrNot;

            var queryLength = rectangleQuery.length;
            if (queryLength !== 0) {
                if (rectangleQuery[0].pdatetime !== undefined) {
                    hasTimeOrNot = true;
                } else {
                    hasTimeOrNot = false;
                }
            }

            if (hasTimeOrNot === true) {
                var timeFilter = [];

                for (var i = 0; i < rectangleQuery.length; i++) {
                    var datefromdata = TOOL.parseDate(rectangleQuery[i].pdatetime.replace(/-/g, "/"));
                    if (dateto >= datefromdata && datefrom <= datefromdata) {
                        timeFilter.push(rectangleQuery[i]);
                    }
                }

                var reportRes = MAP.lunrStoryRegion(keywords, situation, timeFilter);

                MAP.Initialize(reportRes, collName, collColor);
            } else {

                var reportRes = MAP.lunrStoryRegion(keywords, situation, rectangleQuery);

                MAP.Initialize(reportRes, collName, collColor);
            }


            document.getElementById('loadingImage').style.display = 'none';

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            queryResult = 0;
            alert("Query failed ... " + "\nStatus: " + textStatus + "\nError Message: " + errorThrown);
        }
    });

}

QUERY.getpolygonQueryResultShap = function(coordinates, layer) {
    document.getElementById('loadingImage').style.display = 'block';

}


QUERY.getAllData = function(collName) {
    document.getElementById('loadingImage').style.display = 'block';
    var request = QUERY.selectAllQueryUri + "?coll=" + collName;

    $.ajax({
        type: "GET",
        url: request,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function(result) {
            var timeFilter = [];

            var datefrom = TOOL.parseDate(document.getElementById('datefrom').value);
            var dateto = TOOL.parseDate(document.getElementById('dateto').value);
            for (var i = 0; i < result.length; i++) {
                var datefromdata = TOOL.parseDate(result[i].date.replace(/-/g, "/"));
                if (dateto >= datefromdata && datefrom <= datefromdata) {
                    timeFilter.push(result[i]);
                }
            }

            var keywords = document.getElementsByName('searchKeys')[0].value;
            var situation = document.getElementsByName('searchSitu')[0].value;
            var street = document.getElementsByName('searchStreet')[0].value;

            var genderValue = document.getElementById("genderSelect");
            var gender = genderValue.options[genderValue.selectedIndex].value;

            var ageValue = document.getElementById("ageSelect");
            var age = ageValue.options[ageValue.selectedIndex].value;


            MAP.lunrStory(keywords.toString(), situation.toString(), street.toString(), gender.toString(), age.toString(), timeFilter);
            document.getElementById('loadingImage').style.display = 'none';

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Query failed ... " + "\nStatus: " + textStatus + "\nError Message: " + errorThrown);
        }
    });

}

QUERY.showAllData = function(collName, collColor, type) {
    document.getElementById('loadingImage').style.display = 'block';
    var request = QUERY.selectAllQueryUri + "?coll=" + collName;

    $.ajax({
        type: "GET",
        url: request,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function(result) {

            if (type === "marker") {
                MAP.drawGlobalMarker(result, collName, collColor);

                var globalName = "global" + collName;

                window[globalName].eachLayer(function(layer) {
                    layer.bringToBack();
                });
            }

            if (type === "heat") {
                MAP.drawHeatmap(result, collName);
            }



            document.getElementById('loadingImage').style.display = 'none';

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Query failed ... " + "\nStatus: " + textStatus + "\nError Message: " + errorThrown);
        }
    });

}