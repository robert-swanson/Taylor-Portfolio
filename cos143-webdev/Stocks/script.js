
$("#drawChart").on("click", getChartData);

function getChartData() {
  tickerSymbol = $("#tickerSymbol")[0].value
  startDate = $("#earliestDate")[0].value
  endDate = $("#latestDate")[0].value
  $.ajax({
    url: "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbol + ".json",
    data: {
      api_key: "hyL3K57qsD87Mgj1H15N",
      start_date: startDate,  // Use #earliestDate here.
      end_date: endDate     // Use #lastestDate here.
    },
  }).done(function(data){
//     debugger;
    drawChart(tickerSymbol, data.dataset.data)
  }).fail(function (response) {
    alert(response.status + " " + response.statusText + response.responseText)
  })
}

function drawChart(tickerSymbol, stockData) {
  var chart = new google.visualization.LineChart(document.getElementById('chart'));
  var chartArr = [["Date","Price"]]
  for (var day of stockData){
    chartArr.push([new Date(day[0]),day[4]])
  }

//   debugger;

  var dataTable = google.visualization.arrayToDataTable(chartArr);

  var options = {
    title:"Stocks Tabls",
    hAxis: {
      title: "Date",
      format: 'MM-dd-yyyy',
    },
    vAxis: {
      title: 'Price'
    },
    colors: ['#a52714'],
    crosshair: {
      color: '#000',
      trigger: 'selection'
    }
  };


  // DRAW THE CHART
  chart.draw(dataTable, options);
}
