// @Date    : 2018-07-15 18:55:01
// @Author  : Chao Ma (cma1@kent.edu)
// @Website : http://vis.cs.kent.edu/NeighborVis/
// @Link    : https://github.com/AlexMa1989
// @Version : $Id$

/*
    area.js
    Note: this file contain functions of Query Front-End
*/

var AREA = AREA || {};

AREA.CurrentIndex = 0;
AREA.List = [];
AREA.queryList = [];
AREA.tweetMarker;

AREA.chartWidth;
AREA.chartHeight;

AREA.ifTime;

AREA.chartWidth = $('#chartContainer').width();
AREA.chartHeight = $('#chartContainer').height();

AREA.wordCloudClick;

AREA.eachQuery = function(query_id, query_coll, query_type, query_info, query_layer, query_keyword, query_situ, query_from, query_to) {

    this.ID = query_id;
    this.Data = query_coll;
    this.Type = query_type;
    this.Info = query_info;
    this.Layer = query_layer;
    this.Key = query_keyword;
    this.Situ = query_situ;
    this.From = query_from;
    this.To = query_to;

}

AREA.attribute = function(area_id, area_data, area_layer, area_collName, area_collColor, area_keywords, area_situation, area_datefrom, area_dateto) {
    this.ID = area_id;
    this.Data = area_data;
    this.Layer = area_layer;
    this.Name = area_collName;
    this.Color = area_collColor;
    this.Key = area_keywords;
    this.Situ = area_situation;
    this.From = area_datefrom;
    this.To = area_dateto;
}

// Add new area attibute
AREA.addNewArea = function(tweets, leafletEvent, ifTime, collName, collColor, keywords, situation, datefrom, dateto) {

    AREA.clearAllTables();
    // Set a new index
    var index = AREA.CurrentIndex + 1;

    // Set new area attribute
    var id = 'data ' + index; //****************
    var data = tweets;
    var layer = leafletEvent;
    var collName = collName;
    var collColor = collColor;
    var keywords = keywords;
    var situation = situation;
    var datefrom = datefrom;
    var dateto = dateto;

    AREA.ifTime = ifTime;



    var attribute = new AREA.attribute(id, data, layer, collName, collColor, keywords, situation, datefrom, dateto);
    // Store new area in the collection
    AREA.List.push(attribute);

    // Update area current index
    AREA.CurrentIndex = index;


}

AREA.addNewFunctions = function(tweet, collName, collColor) {

    AREA.clearAllTables();

    AREA.updateTweetMessages(tweet);
    // Update top keywords
    AREA.updateTopCategory(tweet, collName, collColor);
    // Update top usernames

    AREA.updateCategoryChart(tweet, collName, collColor);

    AREA.updateWordCloud(tweet, collName, collColor);

    AREA.updateTimeChart(tweet, collName, collColor);

    AREA.updateYearChart(tweet, collName, collColor);

    AREA.updateMonthChart(tweet, collName, collColor);

}

AREA.addNewFunctionsNoTime = function(tweet, collName, collColor) {

    AREA.clearAllTables();
    AREA.clearFiltersNoInfo();

    AREA.updateTweetMessages(tweet);
    // Update top keywords
    AREA.updateTopCategory(tweet, collName, collColor);
    // Update top usernames

    AREA.updateCategoryChart(tweet, collName, collColor);

    AREA.updateWordCloud(tweet, collName, collColor);

}



// Update area table in the area panel
AREA.updateTable = function(dbName, id) {

    AREA.clearFiltersNoInfo();

    $('#areaTable > tbody  > tr').each(function() {
        $(this).removeClass("active111");
    });

    //var areaTable = $('#areaTable');
    var areaTableBody = $('#areaTable tbody');
    // clear all row in area table
    var queryId = id.toString();

    console.log(queryId);

    var len = AREA.List.length;
    // Update shown area
    for (i = len - 1; i < len; i++) {

        var area_id = AREA.List[i].ID;

        if (area_id.charAt(0) === 'd') {
            var tweets = AREA.List[i].Data;
            var tweetCount = tweets.length;
            var userCount = AREA.getEventCount(tweets);
            var newRow = '<tr id="' + area_id + '" class="sm-font active111 area collapse ' + queryId + '"><td class="active112 sm-align" contenteditable>' + area_id + '</td><td class="call sm-align collNameHide">' + dbName + '</td><td class="call sm-align">' + tweetCount + '</td><td></td></tr>';
            areaTableBody.append(newRow);
        }

    }


}

AREA.updateQueryTable = function(id, collLengh) {

    AREA.clearFiltersNoInfo();

    //var areaTable = $('#areaTable');
    var areaTableBody = $('#areaTable tbody');
    // clear all row in area table
    var queryId = id.toString();
    var queryLength = collLengh + " Data"

    var allRow = '<tr id="' + queryId + '" class="active111 clickable query" data-toggle="collapse" data-target=".' + queryId + '" ><td  class="active116" contenteditable> ' + queryId + ' </td><td class="call">' + queryLength.toString() + '</td><td>......</td><td><button  id="' + queryId + '" class="btn-xs areaRemove" type="button" ><span class="glyphicon glyphicon-trash red"></span></button></td></tr>';
    areaTableBody.append(allRow);


}


AREA.updateTweetMessages = function(tweets) {
    // Get all tweets that shown on map
    var tweetTable = $('#tweetMessageTable tbody');
    // clear all tweets in tweet table
    tweetTable.empty();

    var i = 0;
    var len = tweets.length;
    for (i; i < len; i++) {
        // Need to add some location to this!
        var tweet_id = tweets[i]._id['$id'];
        var id = tweets[i].id;
        var message = tweets[i].ptext;
        var situation = tweets[i].pcategory;
        var date = tweets[i].pdatetime;
        // Store location of the message
        var latitude = tweets[i].loc.coordinates[1];
        var longitude = tweets[i].loc.coordinates[0];
        var newRow = '<tr class="' + latitude + ',' + longitude + '" id="' + tweet_id + '" value="' + message + '"><td>' + id + '</td><td>' + date + '</td><td>' + situation + '</td></tr>'

        tweetTable.append(newRow);
    }
}


// Update top keywords table
AREA.updateTopCategory = function(tweets, collName, collColor) {

    var keywordsTable = $('#area-keywords-table tbody');

    // Clear keyword table
    keywordsTable.empty();
    var top = AREA.getTopCategory(100, tweets);
    var i = 0;
    var len = top.length;
    for (i; i < len; i++) {
        // Check valid keywords
        if (top[i]['keyword_name'] !== '' && top[i]['keyword_name'] !== undefined) {
            var newRow = '<tr id="' + top[i]['keyword_name'] + '"><td>' + (i + 1) + '</td><td>' + top[i]['keyword_name'] + '</td><td>' + top[i]['frequency_count'] + '</td></tr>';
            keywordsTable.append(newRow);
        }
    }
}


AREA.updateStoryLineChart = function(tweets) {
    var container = document.getElementById('markerTime');

    var storyData = [];


    for (i = 0; i < tweets.length; i++) {
        var id = tweets[i].id;
        var date = tweets[i].pdatetime;
        var situation = tweets[i].pcategory;

        var data1 = {
            id: id,
            content: situation,
            start: date
        };

        storyData.push(data1);
    }

    // Create a DataSet (allows two way data-binding)
    var items = new vis.DataSet(storyData);

    // Configuration for the Timeline
    var options = {
        width: '100%',
        height: '180px',
        margin: {
            item: 5
        }
    };

    // Create a Timeline
    var timeline = new vis.Timeline(container, items, options);

    timeline.on('click', function(properties) {

        var timeLineInfo = $('#timeLineInfo');

        timeLineInfo.html("");

        for (i = 0; i < tweets.length; i++) {
            var id = tweets[i].id;
            var time = tweets[i].pdatetime.split(" ");
            var date = time[0];
            var description = tweets[i].ptext;

            if (id === properties.item) {

                var option = '<span class = "timeLineClick">' + date + '</span> <span>' + description + '</span> ';

                timeLineInfo.append(option);

            }
        }
    });

}

AREA.filterFunction = function(tweets, collName, collColor) {

    var keywords = $('#getKeyword').text();
    var situation = $('#getSitu').text();
    var time = $('#getTime').text();


    MAP.lunrFilter(keywords.toString(), situation.toString(), time.toString(), time.toString(), tweets, collName, collColor);
}


AREA.updateCategoryChart = function(tweets, collName, collColor) {

    var top = AREA.getTopForCategoryChart(10, tweets);

    var chart = new CanvasJS.Chart("chartContainer", {
        width: AREA.chartWidth,
        height: AREA.chartHeight,
        animationEnabled: true,
        responsive: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Top Category"
        },
        axisY: {
            title: "Frequency"
        },
        backgroundColor: "white",
        data: [{
            type: "column",
            click: onClick,
            dataPoints: top
        }]
    });
    chart.render();

    function onClick(e) {
        var keyword = e.dataPoint.label;
        $('#area-keywords-table > tbody > tr').removeClass("active111");

        var fromSpan = $('#getSitu').text();

        $('#getSitu').text(keyword);
        $('#situShow').text(keyword);


        AREA.filterFunction(tweets, collName, collColor);

    }

}

AREA.updateTimeChart = function(tweets, collName, collColor) {

    var data = AREA.getTimeChartData(tweets);

    console.log(data);

    var chart = new CanvasJS.Chart("chartTime", {
        width: 240,
        height: AREA.chartHeight,
        animationEnabled: true,
        zoomEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Date"
        },
        backgroundColor: "white",
        axisX: {
            labelAngle: -30
        },
        data: [{
            type: "column",
            xValueType: "dateTime",
            click: onClick,
            dataPoints: data
        }]
    });

    // chart._creditLink.hide();

    $('a.canvasjs-chart-credit').hide();

    chart.render();

    function onClick(e) {
        var keywords = e.dataPoint.x;

        var keyword = new Date(keywords);

        var year = keyword.getFullYear();
        var month = keyword.getMonth() + 1;
        var date = keyword.getDate();

        var fullDate = year.toString() + '/' + month.toString() + '/' + date.toString();

        var fromSpan = $('#getTime').text();

        $('#getTime').text(fullDate);

        var fromSpan1 = $('#timeShow').text();

        $('#timeShow').text(fullDate);


        AREA.filterFunction(tweets, collName, collColor);

    }

}

AREA.updateYearChart = function(tweets, collName, collColor) {

    var data = AREA.getYearChartData(tweets);

    console.log(data);

    var chart = new CanvasJS.Chart("chartYear", {
        width: 240,
        height: AREA.chartHeight,
        animationEnabled: true,
        zoomEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Year"
        },
        backgroundColor: "white",
        axisX: {
            labelAngle: -30
        },
        data: [{
            type: "column",
            xValueType: "dateTime",
            click: onClick,
            dataPoints: data
        }]
    });

    // chart._creditLink.hide();

    $('a.canvasjs-chart-credit').hide();

    chart.render();

    function onClick(e) {
        var keywords = e.dataPoint.x;

        var keyword = new Date(keywords);

        var year = keyword.getFullYear() + 1;
        var month = keyword.getMonth() + 1;
        var date = keyword.getDate();

        var fullDate = year.toString();

        var fromSpan = $('#getTime').text();

        $('#getTime').text(fullDate);

        var fromSpan1 = $('#timeShow').text();

        $('#timeShow').text(fullDate);

        AREA.filterFunction(tweets, collName, collColor);

    }

}

AREA.updateMonthChart = function(tweets, collName, collColor) {

    var data = AREA.getMonthChartData(tweets);


    var chart = new CanvasJS.Chart("chartMonth", {
        width: 240,
        height: AREA.chartHeight,
        animationEnabled: true,
        zoomEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Month"
        },
        backgroundColor: "white",
        axisX: {
            labelAngle: -30
        },
        data: [{
            type: "column",
            xValueType: "dateTime",
            click: onClick,
            dataPoints: data
        }]
    });

    // chart._creditLink.hide();

    $('a.canvasjs-chart-credit').hide();

    chart.render();

    function onClick(e) {
        var keywords = e.dataPoint.x;

        var keyword = new Date(keywords);

        var year = keyword.getFullYear();
        var month = keyword.getMonth() + 1;
        var date = keyword.getDate();

        var fullDate = year.toString() + '/' + month.toString();

        var fromSpan = $('#getTime').text();

        $('#getTime').text(fullDate);

        var fromSpan1 = $('#timeShow').text();

        $('#timeShow').text(fullDate);

        AREA.filterFunction(tweets, collName, collColor);

    }

}

AREA.updateWordCloud = function(tweets, collName, collColor) {

    $("#wordcloud-container").html("");

    var wordcloudDiv = '#wordcloud-container';


    // d3 wordcloud
    AREA.drawWordCloud(wordcloudDiv, 10, 260, 180, tweets, collName, collColor);

}


AREA.clearFilters = function() {


    $('#getKeyword').empty();

    $('#getSitu').empty();

    $('#getTime').empty();

    $('#infoShow').empty();

    $('#timeShow').empty();

    $('#keywordShow').empty();

    $('#situShow').empty();



    $('#getKeyword').html("");
    $('#getTime').html("");
    $('#getSitu').html("");
    $('#infoShow').html("");

    $('#searchKey').val('');
    $('#searchDec').val('');
    $('#searchKey').val('');

};

AREA.clearFiltersNoInfo = function() {


    $('#getKeyword').empty();

    $('#getSitu').empty();

    $('#getTime').empty();

    $('#timeShow').empty();

    $('#keywordShow').empty();

    $('#situShow').empty();


    $('#getKeyword').html("");
    $('#getTime').html("");
    $('#getSitu').html("");

    $('#searchKey').val('');
    $('#searchDec').val('');
    $('#searchKey').val('');

};

AREA.clearAllTables = function() {

    $('#domain-keyword-table tbody').empty();
    $('#area-keywords-table tbody').empty();
    $('#tweetMessageTable tbody').empty();
    $("#chartContainer").html("");
    $("#wordcloud-container").html("");
    $("#chartTime").html("");
    $("#chartMonth").html("");
    $("#chartYear").html("");

};


AREA.tableOperation = function(tweets, collName, collColor) {
    $('#area-keywords-table').unbind().on('click', 'tbody tr', function() {

        $(this).prevAll('tr').removeClass("active111");
        $(this).nextAll('tr').removeClass("active111");
        $(this).toggleClass("active111");

        var keyword = this.id;

        var fromSpan = $('#getSitu').text();

        if (fromSpan.includes(keyword)) {
            var replaced = fromSpan.replace(keyword, '');
            $('#getSitu').text(replaced);
        } else {
            $('#getSitu').text(keyword);
        }

        if (fromSpan.includes(keyword)) {
            var replaced = fromSpan.replace(keyword, '');
            $('#situShow').text(replaced);
        } else {
            $('#situShow').text(keyword);
        }


        AREA.filterFunction(tweets, collName, collColor);


    });

    $('#getSitu').unbind().on('click', function() {


        var keyword = this.id;

        console.log(keyword);

        $('#getSitu').text("");
        $('#situShow').text("");

        AREA.filterFunction(tweets, collName, collColor);


    });


    $('#getKeyword').unbind().on('click', function() {

        var keyword = this.id;

        $('#getKeyword').text("");
        $('#keywordShow').text("");

        AREA.filterFunction(tweets, collName, collColor);


    });

    $('#getTime').unbind().on('click', function() {


        var keyword = this.id;

        $('#getTime').text("");
        $('#timeShow').text("");


        AREA.filterFunction(tweets, collName, collColor);


    });


    $('#situClick').unbind().on('click', function() {

        var getkeyword = $('#searchDec').val();

        var keyword = getkeyword.toUpperCase();

        var fromSpan = $('#getSitu').text();

        $('#getSitu').text(keyword);

        $('#situShow').text(keyword);


        AREA.filterFunction(tweets, collName, collColor);


    });

    $('#keyClick').unbind().on('click', function() {

        var getkeyword = $('#searchKey').val();

        var keyword = getkeyword.toUpperCase();

        var fromSpan = $('#getKeyword').text();

        $('#getKeyword').text(keyword);


        $('#keywordShow').text(keyword);

        AREA.filterFunction(tweets, collName, collColor);


    });


    $("#keyclear").click(function() {
        $("#searchKey").val('');
        $('#getKeyword').text('');
        $('#keywordShow').text('');

        AREA.filterFunction(tweets, collName, collColor);


    });

    $("#sitclear").click(function() {
        $("#searchDec").val('');
        $('#getSitu').text('');
        $('#situShow').text('');

        AREA.filterFunction(tweets, collName, collColor);


    });


    $("#keywordSubmit").unbind().click(function() {

        $("#wordcloud-container").html("");
        // AREA.updateDomainNonus();

        var wordcloudDiv = '#wordcloud-container';


        // d3 wordcloud
        AREA.drawWordCloud(wordcloudDiv, 10, 260, 180, tweets, collName, collColor);
    });

    $("#swithButton").unbind().click(function() {

        if ($('#area-keywords').css('display') == 'none') {

            $('#area-keywords').show().siblings('#chartContainer').hide();
        } else if ($('#chartContainer').css('display') == 'none') {

            $('#chartContainer').show().siblings('#area-keywords').hide();
            $('a.canvasjs-chart-credit').hide();
        }
    });

}


AREA.updateInfo = function(IDS, data, layer) {


    var id = IDS;

    var length = data.length;

    var info = id;

    $('#infoShow').text(info);

}




// Find top n of keywords
AREA.getTopCategory = function(n, tweets) {
    var topKeywords = [];
    var listofKeywords = [];
    var i = 0;
    var len = tweets.length;
    if (len > 0) {
        // Put keywords into the list
        for (i; i < len; i++) {
            listofKeywords.push(tweets[i].pcategory);
        }
        // Sort keywords
        listofKeywords.sort();
        var k = 0;
        var k_len = listofKeywords.length;
        var keywords = [],
            frequency = [],
            prev;
        // Find keywords and its frequency
        for (k; k < k_len; k++) {
            if (listofKeywords[k] != prev) {
                keywords.push(listofKeywords[k]);
                frequency.push(1);
            } else {
                frequency[frequency.length - 1]++;
            }
            prev = listofKeywords[k];
        }
        // Set n to show top n keywords
        while (topKeywords.length < n) {
            var max = frequency[0];
            var maxIndex = 0;
            for (var m = 1; m < frequency.length; m++) {
                if (frequency[m] > max) {
                    maxIndex = m;
                    max = frequency[m];
                }
            }

            var keyword = {
                keyword_name: keywords[maxIndex],
                frequency_count: frequency[maxIndex]
            };

            // Store keyword and frequency
            topKeywords.push(keyword);
            // Delete array element
            keywords.splice(maxIndex, 1);
            frequency.splice(maxIndex, 1);
        }
    }

    //console.log (topKeywords);
    return topKeywords;
}


AREA.getTopForCategoryChart = function(n, tweets) {
    var topKeywords = [];
    var listofKeywords = [];
    var i = 0;
    var len = tweets.length;
    if (len > 0) {
        // Put keywords into the list
        for (i; i < len; i++) {
            listofKeywords.push(tweets[i].pcategory);
        }
        // Sort keywords
        listofKeywords.sort();
        var k = 0;
        var k_len = listofKeywords.length;
        var keywords = [],
            frequency = [],
            prev;
        // Find keywords and its frequency
        for (k; k < k_len; k++) {
            if (listofKeywords[k] != prev) {
                keywords.push(listofKeywords[k]);
                frequency.push(1);
            } else {
                frequency[frequency.length - 1]++;
            }
            prev = listofKeywords[k];
        }
        // Set n to show top n keywords
        while (topKeywords.length < n) {
            var max = frequency[0];
            var maxIndex = 0;
            for (var m = 1; m < frequency.length; m++) {
                if (frequency[m] > max) {
                    maxIndex = m;
                    max = frequency[m];
                }
            }

            var keyword = {
                label: keywords[maxIndex],
                y: frequency[maxIndex]
            };

            // Store keyword and frequency
            topKeywords.push(keyword);
            // Delete array element
            keywords.splice(maxIndex, 1);
            frequency.splice(maxIndex, 1);
        }
    }

    //console.log (topKeywords);
    return topKeywords;
}


AREA.getTimeChartData = function(tweets) {
    var data = [];
    var dateSeries = [];
    for (var i = 0; i < tweets.length; i++) {
        var date_splited = tweets[i].pdatetime.split(" ");
        var date = date_splited[0];
        var month = date.substring(0, date.lastIndexOf('-'));
        var year = date.substring(0, date.indexOf('-'));
        var dateFormat = TOOL.parseDate(date.replace(/-/g, "/")) * 1000;
        dateSeries.push(dateFormat);
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

AREA.getYearChartData = function(tweets) {
    var data = [];
    var dateSeries = [];
    for (var i = 0; i < tweets.length; i++) {
        var date_splited = tweets[i].pdatetime.split(" ");
        var date = date_splited[0];
        var month = date.substring(0, date.lastIndexOf('-'));
        var year = date.substring(0, date.indexOf('-'));
        var dateFormat = TOOL.parseDate(year.replace(/-/g, "/")) * 1000;
        dateSeries.push(dateFormat);
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

AREA.getMonthChartData = function(tweets) {
    var data = [];
    var dateSeries = [];
    for (var i = 0; i < tweets.length; i++) {
        var date_splited = tweets[i].pdatetime.split(" ");
        var date = date_splited[0];
        var month = date.substring(0, date.lastIndexOf('-'));
        var year = date.substring(0, date.indexOf('-'));
        var dateFormat = TOOL.parseDate(month.replace(/-/g, "/")) * 1000;
        dateSeries.push(dateFormat);
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


AREA.getEventCount = function(tweets) {
    var users = [];
    var i = 0;
    var len = tweets.length;

    for (i; i < len; i++) {
        if (!users.includes(tweets[i].street)) {
            users.push(tweets[i].street);
        }
    }
    return users.length;
}



// Draw and Display wordcloud
AREA.drawWordCloud = function(id, rescale, w, h, data, collName, collColor) {
    width = w;
    height = h;
    fontFamily = "Arial";

    // get word and frequency
    var words = AREA.wordCloudKeywords(data);
    words = AREA.wordCloudNormal(words);

    var fill = d3.scale.category20c();
    d3.layout.cloud().size([width, height])
        .words(Object.keys(words).map(function(d) {
            return {
                text: d,
                // normalize word frequency value to 0:1
                size: words[d]
            };
        }))
        .padding(1)
        .rotate(function() {
            // return ~~(Math.random() * 2) * 90;
            return 0;
        })
        .font(fontFamily)
        .fontSize(function(d) {
            return d.size;
        })
        .on("end", draw)
        .start();

    function draw(words) {
        var svg = d3.select(id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("background-color", "black")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var wordcloud = svg.selectAll("text")
            .data(words);
        console.log(wordcloud);

        wordcloud.enter()
            .append("text")
            .style("font-family", fontFamily)
            .style("font-size", 1)
            .style("fill", function(d, i) {
                return fill(i);
            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.text;
            })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .on("click", onClick)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)

        wordcloud.transition()
            .duration(600)
            .style("font-size", function(d) {
                return d.size + "px";
            })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);

        wordcloud.exit()
            .transition()
            .duration(200)
            .style('fill-opacity', 1e-6)
            .attr('font-size', 1)
            .remove();

        // Click event
        function onClick(d, i) {
            console.log(d.text);

            var keyword = d.text;

            $('#getKeyword').text(keyword);
            $('#keywordShow').text(keyword);


            AREA.filterFunction(data, collName, collColor);



            d3.selectAll("text").style({

                "fill": function(d, i) {
                    return fill(i);
                },
                "fill-opacity": 1,
                "font-size": function(d, i) {
                    return d.size;
                },
                "text-decoration": "none"

            });

            d3.select(this).style({
                "fill": "#283142",
                "fill-opacity": 0.8,
                // "text-decoration": "underline"

            });
        }
        // Mouseover event
        function mouseover(d, i) {
            d3.select(this).style({
                //"fill-opacity": 1
                "font-weight": "bold",
                "text-shadow": "0 0 1px rgba(0,0,0, 1)"
            });
        }

        // Mouseout event
        function mouseout(d, i) {
            d3.selectAll("text").style({
                //"fill-opacity": 0.6
                "font-weight": "normal",
                "text-shadow": ""
            });
        };
    }
}

// Normalize words frequency
AREA.wordCloudNormal = function(words) {
    var min = words[Object.keys(words)[Object.keys(words).length - 1]];
    var max = words[Object.keys(words)[0]];

    var norm = function(value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    };

    for (var word in words) {
        words[word] = norm(words[word], [min, max], [8, 36]);
    }

    //var normalized = (val - min) / (max - min);
    return words;
}

// Getting keyword and remove all stop words
AREA.wordCloudKeywords = function(data) {
    var words = {};
    var word;
    var i = 0;
    var len = data.length;
    console.log(len);
    for (i; i < len; i++) {

        var description = data[i].ptext;

        // Remove stop word from the sentence
        if (typeof description === "string") {
            var sentence = description.removeStopWords();
            sentence = sentence.replace(/[0-9]/g, '');
            word = sentence.split(" ");
            var j = 0;
            var j_len = word.length;
            for (j; j < j_len; j++) {
                if (!(word[j] in words) && word[j] != "") {
                    words[word[j]] = 1;
                } else {
                    words[word[j]] += 1;
                }
            }
        }
    }

    var sortable = [];
    for (var word in words) {
        sortable.push([word, words[word]]);
    }

    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    console.log(sortable.slice(0, 20));

    var data2 = {};
    for (var i = 0; i < sortable.length; i++) {
        var word = sortable[i][0];
        var freq = sortable[i][1];
        data2[word] = freq;
    }

    console.log(data2);


    return data2;
}