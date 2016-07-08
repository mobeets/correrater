// http://callmenick.com/post/five-star-rating-component-with-javascript-css
var all_movies = [
];
var barChart;

var ratingNames = ["imdbRating", "tomatoMeter", "tomatoRating", "tomatoUserMeter", "tomatoUserRating"];

function buildShopItem(data) {
  var shopItem = document.createElement('div');

  var html = '<div class="c-shop-item__img"></div>' +
    '<div class="c-shop-item__details">' +
      '<h3 class="c-shop-item__title">' + data.title + '</h3>' +
      '<p class="c-shop-item__description">' + data.description + '</p>' +
      '<ul class="c-rating"></ul>' +
    '</div>';

  shopItem.classList.add('c-shop-item');
  shopItem.innerHTML = html;
  shop.appendChild(shopItem);

  return shopItem;
}


// ADD RATING WIDGET
function addRatingWidget(shopItem, data) {
  var ratingElement = shopItem.querySelector('.c-rating');
  var currentRating = data.rating;
  var maxRating = 5;
  var callback = function(rating) { data["userRating"] = rating; };
  var r = rating(ratingElement, currentRating, maxRating, callback);
}

function addMovies(objs) {
  for (var i = 0; i < objs.length; i++) {
    addMovie(objs[i]);
  }
}

function fetchRandomMovies() {
  $.ajax({
      type: "GET",
      url: "random_movies",
      // data: JSON.stringify(obj),
      contentType: 'application/json',
      dataType: 'json',
      error: function(data) {
          console.log(data);
      },
      success: function(data) {
          console.log(data["movies"]);
          addMovies(data["movies"]);
      }
  });
}

function addMovie(obj) {
  all_movies.push(obj);
  addRatingWidget(buildShopItem(obj), obj);
}

function queryMovie() {
  // console.log($("#movie-input").val());
  val = $("#movie-input").val();
  obj = {"name": val};
  $.ajax({
      type: "POST",
      url: "add_movie",
      data: JSON.stringify(obj),
      contentType: 'application/json',
      dataType: 'json',
      error: function(data) {
          console.log(data);
      },
      success: function(data) {
          console.log(data["movie"]);
          addMovie(data["movie"]);
      }
  });
}

/*
 *  Source: http://stevegardner.net/2012/06/11/javascript-code-to-calculate-the-pearson-correlation-coefficient/
 */
function getPearsonCorrelation(x, y) {
    var shortestArrayLength = 0;
     
    if(x.length == y.length) {
        shortestArrayLength = x.length;
    } else if(x.length > y.length) {
        shortestArrayLength = y.length;
        console.error('x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
    } else {
        shortestArrayLength = x.length;
        console.error('y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
    }
  
    var xy = [];
    var x2 = [];
    var y2 = [];
  
    for(var i=0; i<shortestArrayLength; i++) {
        xy.push(x[i] * y[i]);
        x2.push(x[i] * x[i]);
        y2.push(y[i] * y[i]);
    }
  
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_x2 = 0;
    var sum_y2 = 0;
  
    for(var i=0; i< shortestArrayLength; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += xy[i];
        sum_x2 += x2[i];
        sum_y2 += y2[i];
    }
  
    var step1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
    var step2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
    var step3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
    var step4 = Math.sqrt(step2 * step3);
    var answer = step1 / step4;
  
    return answer
}


function getCorrelation(ratingName) {
  userRevs = [];
  compRevs = [];
  for (var i = 0; i < all_movies.length; i++) {
    uv = all_movies[i].userRating;
    cv = all_movies[i][ratingName];
    if (!isNaN(cv) && typeof uv !== "undefined") {
      userRevs.push(uv);
      compRevs.push(parseInt(cv));
    }
  }
  // console.log(ratingName);
  // console.log(userRevs);
  // console.log(compRevs);
  // console.log("-------");
  return getPearsonCorrelation(userRevs, compRevs);
}

function submitRatings() {
  corrs = [];
  msgs = "";
  for (var i = 0; i < ratingNames.length; i++) {
    corr = getCorrelation(ratingNames[i]);
    corrs.push(corr);
    msgs += "<br>Your correlation with the " + ratingNames[i] + " rating is " + corr.toFixed(2) + ".";
  }
  // $('#correlation').html(msgs);
  addChart(ratingNames, corrs);
}

function updateChart(nms, vals) {
  barChart.data.datasets[0].data = vals;
  barChart.update();
}

function getColors(vals) {
  f = chroma.scale('RdBu').domain([-1,1]);
  clrs = [];
  for(var i = 0; i < vals.length; i++) {
    clrs.push(f(vals[i]).css());
  }
  return clrs;
}

function addChart(nms, vals) {
// http://www.chartjs.org/docs/#bar-chart-introduction  

  // baseClr = "rgba(255,99,132,0.6)";
  clrs = getColors(vals);

  $('#result-lead').show();
  var ctx = $('#corr-chart');
  var data = {
    labels: nms,
    datasets: [{
      label: '',
      backgroundColor: clrs,
      data: vals,
    }]
  };
  var options = {
    // scaleShowVerticalLines: false,
    // scaleShowGridLines: false,
    // showScale: false,
    legend: {
      display: false,
    },
    tooltips: {
      enabled: true,
      callbacks: {
        label: function(tooltipItems, data) {
          return tooltipItems.yLabel.toFixed(2);
        },
      },
    },
    tooltipTemplate: "<%= datasetLabel %> - <%= value.toFixed(3) %>",
    scales: {
      xAxes: [{
        gridLines: {
          // display: false,
        },
      }],
      yAxes: [{
        gridLines: {
          // display: false,
        },
        ticks: {
          min: -1,
          max: 1,
          stepSize: 0.25,
          beginAtZero: true
        }
      }]
    }
  };

  if (typeof barChart !== "undefined") {
    barChart.destroy();
  }
  barChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });
}

$( document ).ready(function() {

    var shop = $("#shop");
    $('#result-lead').hide();

    fetchRandomMovies();
    $("#add-movie").click(queryMovie);
    $("#movie-input").keyup(function(event){
        if(event.keyCode == 13){
            $("#add-movie").click();
        }
    });
    $("#more-movies").click(fetchRandomMovies);
    $("#submit-ratings").click(function() {
      submitRatings();
      $('html, body').animate({
        scrollTop: $('#result-lead').offset().top
      }, 500);
    });

});
