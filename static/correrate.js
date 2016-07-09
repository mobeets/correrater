// http://callmenick.com/post/five-star-rating-component-with-javascript-css
var randMovCount = 10;
var movieInds = [];
var all_movies = [];
var barChart;

var ratingNames = ["imdbRating", "tomatoMeter", "tomatoRating", "tomatoUserMeter", "tomatoUserRating"];
var ratingDisplayNames = ["IMDb rating", "Tomato Meter", "Tomato Avg Critic Rating", "Tomato Audience Score", "Tomato User Avg Rating"];

function buildShopItem(data) {
  data.rating = null;
  var shopItem = document.createElement('div');

  var html = '<div class="c-shop-item__img"></div>' +
    '<div class="c-shop-item__details">' +
      '<a href="' + data.tomatoURL + '"><h3 class="c-shop-item__title">' + data.Title + '</a> ' +
      '<span class="c-shop-item__date">(' + data.Year + ')</span></h3>' +
      '<p class="c-shop-item__description">' + data.Plot + '</p>' +
      '<span class="c-shop-item__director"><i>Director: ' + data.Director + '<br>Starring: ' + data.Actors + '</i></span></h3>' +
      '<ul class="c-rating"></ul>' +
    '</div>';

  shopItem.classList.add('c-shop-item');
  shopItem.classList.add('col-lg-6');
  shopItem.classList.add('panel');
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


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fetchRandomMovies() {
  var i = 0;
  while (i < randMovCount) {
    ind = getRandomInt(0, movieData.length-1);
    if ($.inArray(ind, movieInds) == -1) {
      movieInds.push(ind);
      addMovie(movieData[ind]);
      i += 1;
    }
  }
}

function addMovies(objs) {
  for (var i = 0; i < objs.length; i++) {
    addMovie(objs[i]);
  }
}

function addMovie(obj) {
  all_movies.push(obj);
  addRatingWidget(buildShopItem(obj), obj);
}

// function fetchRandomMovies() {
//   $.ajax({
//       type: "GET",
//       url: "random_movies",
//       // data: JSON.stringify(obj),
//       contentType: 'application/json',
//       dataType: 'json',
//       error: function(data) {
//           console.log(data);
//       },
//       success: function(data) {
//           console.log(data["movies"]);
//           addMovies(data["movies"]);
//       }
//   });
// }

// function queryMovie() {
//   // console.log($("#movie-input").val());
//   val = $("#movie-input").val();
//   obj = {"name": val};
//   $.ajax({
//       type: "POST",
//       url: "add_movie",
//       data: JSON.stringify(obj),
//       contentType: 'application/json',
//       dataType: 'json',
//       error: function(data) {
//           console.log("HERE");
//           $('#movie-input').val('');
//           $('#movie-input').attr('placeholder', 'Movie not found! Try again.');
//           console.log(data);
//       },
//       success: function(data) {
//           console.log(data["movie"]);
//           addMovie(data["movie"]);
//       }
//   });
// }

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

function getCorrSE(corr, n) {
  return Math.sqrt((1 - Math.pow(corr, 2))/(n-2));
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
  corr = getPearsonCorrelation(userRevs, compRevs);
  se = getCorrSE(corr, userRevs.length);
  return {'r': corr, 'r_se': se, 'n': userRevs.length};
}

function ratingCount() {
  c = 0;
  for (var i = 0; i < all_movies.length; i++) {
    uv = all_movies[i].userRating;
    if (!isNaN(uv)) {
      c += 1;
    }
  }
  return c;
}

function submitRatings() {
  corrs = [];
  corr_ses = [];
  // sigs = [];
  maxSigNm = ""; maxC = 0;
  msgs = "";
  maxV = -1; maxNm = "";
  for (var i = 0; i < ratingNames.length; i++) {
    corr_obj = getCorrelation(ratingNames[i]);
    corr = corr_obj.r;
    corr_se = corr_obj.r_se;
    N = corr_obj.n;
    if (corr > maxV) {
      maxV = corr;
      maxNm = ratingDisplayNames[i];
    }
    corrs.push(corr);
    corr_ses.push(corr_se);
    if (N > 10 && corr - corr_se > 0 && corr  > maxC) {
      maxSigNm = ratingDisplayNames[i];
      maxC = corr;
      // sigs.push(ratingDisplayNames[i]);
    }
    msgs += "<br>Your correlation with the " + ratingNames[i] + " rating is " + corr.toFixed(2) + ".";
  }
  // $('#correlation').html(msgs);
  // addChart(ratingNames, corrs);
  addChart(ratingDisplayNames, corrs);

  greatMsg = "Your best source for movie ratings is the " + maxSigNm + ". ‡";
  goodMsg = "Your best source for movie ratings is the " + maxNm + ".";
  badMsg = "None of these movie ratings agreed with you!"
  moreMsg = " (But I need more ratings to say for sure.)";
  if (maxC > 0) {
    msg = greatMsg;
  } else if (maxV > 0.2) {
    msg = goodMsg + moreMsg;
  } else {
    msg = badMsg + moreMsg;
  }
  // if (ratingCount() < 8 ) { 
  //   msg += " (Try rating more movies for a better estimate.)";
  // }
  $('#rating-pick').html(msg);
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
    // $("#add-movie").click(queryMovie);
    // $("#movie-input").keyup(function(event){
    //     if(event.keyCode == 13){
    //         $("#add-movie").click();
    //     }
    // });
    $("#more-movies").click(fetchRandomMovies);
    $("#submit-ratings").click(function() {
      submitRatings();
      $('html, body').animate({
        scrollTop: $('#result-lead').offset().top
      }, 500);
    });

});
