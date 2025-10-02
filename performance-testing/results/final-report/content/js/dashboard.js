/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 33.333333333333336, "KoPercent": 66.66666666666667};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.30916666666666665, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Get All Food Items"], "isController": false}, {"data": [0.9275, 500, 1500, "Search Food Items"], "isController": false}, {"data": [0.0, 500, 1500, "User Login"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 600, 400, 66.66666666666667, 366.6199999999996, 145, 7792, 222.5, 454.29999999999984, 810.1999999999975, 4523.940000000008, 9.343174810800711, 19.525775483509296, 1.5115748310442554], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get All Food Items", 200, 200, 100.0, 352.63499999999993, 158, 6986, 240.0, 429.1, 645.0, 3579.930000000013, 3.236874474007898, 13.051811233572863, 0.39512627856541727], "isController": false}, {"data": ["Search Food Items", 200, 0, 0.0, 370.39500000000015, 145, 6575, 219.0, 557.6000000000001, 1040.9499999999987, 4837.770000000011, 3.2413860166607242, 6.24220041489741, 0.44315824446533336], "isController": false}, {"data": ["User Login", 200, 200, 100.0, 376.8299999999999, 146, 7792, 210.0, 444.00000000000006, 1023.8499999999974, 5955.630000000013, 3.244435792615664, 1.0107177908636689, 0.7350674842644864], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 200, 50.0, 33.333333333333336], "isController": false}, {"data": ["Value in json path '$' expected to be '[]', but found '[{&quot;_id&quot;:&quot;68d2fedab0e84742e44dacaa&quot;,&quot;name&quot;:&quot;Updated Test Pizza&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:18.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:false,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T20:11:06.691Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T20:11:07.212Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fe03fa5c7f1535ad826d&quot;,&quot;name&quot;:&quot;Updated Test Pizza&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:18.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:false,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T20:07:31.485Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T20:07:32.200Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fc0e188788015f9b7b09&quot;,&quot;name&quot;:&quot;Unauthorized Update&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:99.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T19:59:10.175Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:59:10.683Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fc0b188788015f9b7afc&quot;,&quot;name&quot;:&quot;Updated Test Pizza&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:18.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T19:59:07.922Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:59:08.333Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fc06188788015f9b7ad7&quot;,&quot;name&quot;:&quot;Regular User Burger&quot;,&quot;description&quot;:&quot;Test regular user burger&quot;,&quot;price&quot;:10,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/via.placeholder.com\\\\/300x200&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:10,&quot;createdAt&quot;:&quot;2025-09-23T19:59:02.085Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:59:02.085Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135a&quot;,&quot;name&quot;:&quot;Chicken Burger&quot;,&quot;description&quot;:&quot;Grilled chicken breast with lettuce, tomato, onion, and special sauce&quot;,&quot;price&quot;:8.99,&quot;category&quot;:&quot;Burger&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1568901346375-23c9450c58cd?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:15,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135c&quot;,&quot;name&quot;:&quot;Spaghetti Carbonara&quot;,&quot;description&quot;:&quot;Traditional Italian pasta with eggs, cheese, pancetta, and black pepper&quot;,&quot;price&quot;:11.99,&quot;category&quot;:&quot;Pasta&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1621996346565-e3dbc353d2e5?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:25,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135d&quot;,&quot;name&quot;:&quot;Chocolate Cake&quot;,&quot;description&quot;:&quot;Rich chocolate cake with creamy chocolate frosting&quot;,&quot;price&quot;:5.99,&quot;category&quot;:&quot;Dessert&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1578985545062-69928b1d9587?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:5,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135e&quot;,&quot;name&quot;:&quot;Fresh Orange Juice&quot;,&quot;description&quot;:&quot;Freshly squeezed orange juice&quot;,&quot;price&quot;:3.99,&quot;category&quot;:&quot;Beverage&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1613478223719-2ab802602423?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:5,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135b&quot;,&quot;name&quot;:&quot;Caesar Salad&quot;,&quot;description&quot;:&quot;Fresh romaine lettuce with parmesan cheese, croutons, and caesar dressing&quot;,&quot;price&quot;:7.49,&quot;category&quot;:&quot;Salad&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1551248429-40975aa4de74?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:10,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e4432481359&quot;,&quot;name&quot;:&quot;Margherita Pizza&quot;,&quot;description&quot;:&quot;Classic pizza with fresh tomato sauce, mozzarella cheese, and basil leaves&quot;,&quot;price&quot;:12.99,&quot;category&quot;:&quot;Pizza&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1574071318508-1cdbab80d002?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:20,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.866Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.866Z&quot;}]'", 200, 50.0, 33.333333333333336], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 600, 400, "401/Unauthorized", 200, "Value in json path '$' expected to be '[]', but found '[{&quot;_id&quot;:&quot;68d2fedab0e84742e44dacaa&quot;,&quot;name&quot;:&quot;Updated Test Pizza&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:18.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:false,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T20:11:06.691Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T20:11:07.212Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fe03fa5c7f1535ad826d&quot;,&quot;name&quot;:&quot;Updated Test Pizza&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:18.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:false,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T20:07:31.485Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T20:07:32.200Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fc0e188788015f9b7b09&quot;,&quot;name&quot;:&quot;Unauthorized Update&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:99.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T19:59:10.175Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:59:10.683Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fc0b188788015f9b7afc&quot;,&quot;name&quot;:&quot;Updated Test Pizza&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:18.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T19:59:07.922Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:59:08.333Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fc06188788015f9b7ad7&quot;,&quot;name&quot;:&quot;Regular User Burger&quot;,&quot;description&quot;:&quot;Test regular user burger&quot;,&quot;price&quot;:10,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/via.placeholder.com\\\\/300x200&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:10,&quot;createdAt&quot;:&quot;2025-09-23T19:59:02.085Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:59:02.085Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135a&quot;,&quot;name&quot;:&quot;Chicken Burger&quot;,&quot;description&quot;:&quot;Grilled chicken breast with lettuce, tomato, onion, and special sauce&quot;,&quot;price&quot;:8.99,&quot;category&quot;:&quot;Burger&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1568901346375-23c9450c58cd?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:15,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135c&quot;,&quot;name&quot;:&quot;Spaghetti Carbonara&quot;,&quot;description&quot;:&quot;Traditional Italian pasta with eggs, cheese, pancetta, and black pepper&quot;,&quot;price&quot;:11.99,&quot;category&quot;:&quot;Pasta&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1621996346565-e3dbc353d2e5?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:25,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135d&quot;,&quot;name&quot;:&quot;Chocolate Cake&quot;,&quot;description&quot;:&quot;Rich chocolate cake with creamy chocolate frosting&quot;,&quot;price&quot;:5.99,&quot;category&quot;:&quot;Dessert&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1578985545062-69928b1d9587?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:5,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135e&quot;,&quot;name&quot;:&quot;Fresh Orange Juice&quot;,&quot;description&quot;:&quot;Freshly squeezed orange juice&quot;,&quot;price&quot;:3.99,&quot;category&quot;:&quot;Beverage&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1613478223719-2ab802602423?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:5,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135b&quot;,&quot;name&quot;:&quot;Caesar Salad&quot;,&quot;description&quot;:&quot;Fresh romaine lettuce with parmesan cheese, croutons, and caesar dressing&quot;,&quot;price&quot;:7.49,&quot;category&quot;:&quot;Salad&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1551248429-40975aa4de74?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:10,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e4432481359&quot;,&quot;name&quot;:&quot;Margherita Pizza&quot;,&quot;description&quot;:&quot;Classic pizza with fresh tomato sauce, mozzarella cheese, and basil leaves&quot;,&quot;price&quot;:12.99,&quot;category&quot;:&quot;Pizza&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1574071318508-1cdbab80d002?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:20,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.866Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.866Z&quot;}]'", 200, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Get All Food Items", 200, 200, "Value in json path '$' expected to be '[]', but found '[{&quot;_id&quot;:&quot;68d2fedab0e84742e44dacaa&quot;,&quot;name&quot;:&quot;Updated Test Pizza&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:18.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:false,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T20:11:06.691Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T20:11:07.212Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fe03fa5c7f1535ad826d&quot;,&quot;name&quot;:&quot;Updated Test Pizza&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:18.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:false,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T20:07:31.485Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T20:07:32.200Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fc0e188788015f9b7b09&quot;,&quot;name&quot;:&quot;Unauthorized Update&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:99.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T19:59:10.175Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:59:10.683Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fc0b188788015f9b7afc&quot;,&quot;name&quot;:&quot;Updated Test Pizza&quot;,&quot;description&quot;:&quot;Delicious test pizza with cheese and tomatoes&quot;,&quot;price&quot;:18.99,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/example.com\\\\/pizza.jpg&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:20,&quot;createdAt&quot;:&quot;2025-09-23T19:59:07.922Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:59:08.333Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2fc06188788015f9b7ad7&quot;,&quot;name&quot;:&quot;Regular User Burger&quot;,&quot;description&quot;:&quot;Test regular user burger&quot;,&quot;price&quot;:10,&quot;category&quot;:&quot;Main Course&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/via.placeholder.com\\\\/300x200&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:10,&quot;createdAt&quot;:&quot;2025-09-23T19:59:02.085Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:59:02.085Z&quot;,&quot;__v&quot;:0},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135a&quot;,&quot;name&quot;:&quot;Chicken Burger&quot;,&quot;description&quot;:&quot;Grilled chicken breast with lettuce, tomato, onion, and special sauce&quot;,&quot;price&quot;:8.99,&quot;category&quot;:&quot;Burger&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1568901346375-23c9450c58cd?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:15,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135c&quot;,&quot;name&quot;:&quot;Spaghetti Carbonara&quot;,&quot;description&quot;:&quot;Traditional Italian pasta with eggs, cheese, pancetta, and black pepper&quot;,&quot;price&quot;:11.99,&quot;category&quot;:&quot;Pasta&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1621996346565-e3dbc353d2e5?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:25,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135d&quot;,&quot;name&quot;:&quot;Chocolate Cake&quot;,&quot;description&quot;:&quot;Rich chocolate cake with creamy chocolate frosting&quot;,&quot;price&quot;:5.99,&quot;category&quot;:&quot;Dessert&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1578985545062-69928b1d9587?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:5,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135e&quot;,&quot;name&quot;:&quot;Fresh Orange Juice&quot;,&quot;description&quot;:&quot;Freshly squeezed orange juice&quot;,&quot;price&quot;:3.99,&quot;category&quot;:&quot;Beverage&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1613478223719-2ab802602423?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:5,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e443248135b&quot;,&quot;name&quot;:&quot;Caesar Salad&quot;,&quot;description&quot;:&quot;Fresh romaine lettuce with parmesan cheese, croutons, and caesar dressing&quot;,&quot;price&quot;:7.49,&quot;category&quot;:&quot;Salad&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1551248429-40975aa4de74?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:10,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.867Z&quot;},{&quot;_id&quot;:&quot;68d2f49f85c43e4432481359&quot;,&quot;name&quot;:&quot;Margherita Pizza&quot;,&quot;description&quot;:&quot;Classic pizza with fresh tomato sauce, mozzarella cheese, and basil leaves&quot;,&quot;price&quot;:12.99,&quot;category&quot;:&quot;Pizza&quot;,&quot;image&quot;:&quot;https:\\\\/\\\\/images.unsplash.com\\\\/photo-1574071318508-1cdbab80d002?w=300&quot;,&quot;available&quot;:true,&quot;preparationTime&quot;:20,&quot;__v&quot;:0,&quot;createdAt&quot;:&quot;2025-09-23T19:27:27.866Z&quot;,&quot;updatedAt&quot;:&quot;2025-09-23T19:27:27.866Z&quot;}]'", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["User Login", 200, 200, "401/Unauthorized", 200, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
