// http://callmenick.com/post/five-star-rating-component-with-javascript-css
var data = [
  {
    title: "Dope Hat",
    description: "Dope hat dolor sit amet, consectetur adipisicing elit. Commodi consectetur similique ullam natus ut debitis praesentium.",
    rating: null
  },
  {
    title: "Hot Top",
    description: "Hot top dolor sit amet, consectetur adipisicing elit. Commodi consectetur similique ullam natus ut debitis praesentium.",
    rating: null
  },
  {
    title: "Fresh Kicks",
    description: "Fresh kicks dolor sit amet, consectetur adipisicing elit. Commodi consectetur similique ullam natus ut debitis praesentium.",
    rating: null
  }
];

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
  var callback = function(rating) { alert(rating); };
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
  data.push(obj);
  addRatingWidget(buildShopItem(obj), obj);
}

function queryMovie() {
  console.log($("#movie-input").val());
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

$( document ).ready(function() {

    var shop = $("#shop");
    // (function init() {
    //   for (var i = 0; i < data.length; i++) {
    //     addRatingWidget(buildShopItem(data[i]), data[i]);
    //   }
    // })();

    fetchRandomMovies();
    $("#add-movie").click(queryMovie);
    $("#movie-input").keyup(function(event){
        if(event.keyCode == 13){
            $("#add-movie").click();
        }
    });

});
