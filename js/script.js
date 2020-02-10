$(document).ready(function() {
  $(document).on("click", "#search", function() {
    var ricerca = $("#input").val();
    sendRequestToServer(ricerca);
  });
  $("#input").keyup(function(event) {
    if (event.which == 13) {
      var ricerca = $("#input").val();
      sendRequestToServer(ricerca);
    }
  });
});

function sendRequestToServer(ricerca) {
  if ($("#input").val() != "") {
    $("#input").val("");
    $(".movie.container").html("");
    $("#cercato > span").text(ricerca);
    $("#cercato").removeClass("hidden");
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data: {
        api_key: "b1d8c49e5a444b10f55f930d8f4ed091",
        query: ricerca,
        language: "it-IT"
      },
      success: function(risposta) {
        if (risposta.total_results > 0) {
          $("h2.movie-title").removeClass("hidden");
          $("h2.tvseries-title").removeClass("hidden");
          stampaFilm(risposta.results);
        } else {
          $(".movie.container").append("La ricerca non ha prodotto alcun risultato!");
        }
      },
      error: function functionName() {
      }
    })
    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv",
      method: "GET",
      data: {
        api_key: "b1d8c49e5a444b10f55f930d8f4ed091",
        query: ricerca,
        language: "it-IT"
      },
      success: function(risposta) {
        $(".tvseries.container").html("");
        if (risposta.total_results > 0) {
          $("h2.movie-title").removeClass("hidden");
          $("h2.tvseries-title").removeClass("hidden");
          stampaSerie(risposta.results);
        } else {
          $(".tvseries.container").append("La ricerca non ha prodotto alcun risultato!");
        }
      },
      error: function functionName() {
      }
    })
  }
}

function stampaFilm(listaOggetti) {
  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);
  for (var key in listaOggetti) {
    var context = {
      poster: listaOggetti[key].poster_path,
      title: listaOggetti[key].title,
      releaseYear: moment(listaOggetti[key].release_date, "YYYY-MM-DD").format("YYYY"),
      originalTitle: listaOggetti[key].original_title,
      language: listaOggetti[key].original_language,
      rating: listaOggetti[key].vote_average,
      stars: printStars(listaOggetti[key].vote_average)
    };
    var html = template(context);
    $(".movie.container").append(html);
  }
}
function stampaSerie(listaOggetti) {
  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);
  for (var key in listaOggetti) {
    var context = {
      poster: listaOggetti[key].poster_path,
      title: listaOggetti[key].name,
      releaseYear: moment(listaOggetti[key].first_air_date, "YYYY-MM-DD").format("YYYY"),
      originalTitle: listaOggetti[key].original_name,
      language: listaOggetti[key].original_language,
      rating: listaOggetti[key].vote_average,
      stars: printStars(listaOggetti[key].vote_average)
    };
    var html = template(context);
    $(".tvseries.container").append(html);
  }
}

function printStars(voto) {
  var starsNumber = Math.ceil(voto / 2);
  var stars = "";
  for (var i = 1; i <= starsNumber; i++) {
    stars += '&#9733;'
  }
  for (var i = 5; i > starsNumber; i--) {
    stars += '&#9734;'
  }
  return stars;
}
