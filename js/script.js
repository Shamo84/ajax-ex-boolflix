$(document).ready(function() {
  var moviesUrl = "https://api.themoviedb.org/3/search/movie";
  var seriesUrl = "https://api.themoviedb.org/3/search/tv";
  var movieContainer = $(".movie.container");
  var seriesContainer = $(".tvseries.container");

  $(document).on("click", "#search", function() {
    var ricerca = $("#input").val();
    sendRequestToServer(ricerca, moviesUrl, movieContainer);
    sendRequestToServer(ricerca, seriesUrl, seriesContainer);
    $("#input").val("");
  });
  $("#input").keyup(function(event) {
    if (event.which == 13) {
      var ricerca = $("#input").val();
      sendRequestToServer(ricerca, moviesUrl, movieContainer);
      sendRequestToServer(ricerca, seriesUrl, seriesContainer);
      $("#input").val("");
    }
  });
  $("#input").on("focus", function() {
    $(this).attr("placeholder", "");
  });
  $("#input").on("blur", function() {
    $(this).attr("placeholder", "Inserisci un titolo");
  });
});

function sendRequestToServer(ricerca, url, container) {
  if ($("#input").val() != "") {
    container.html("");
    $("#cercato > span").text(ricerca);
    $("#cercato").removeClass("hidden");
    $.ajax({
      url: url,
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
          stampa(risposta.results, container);
        } else {
          container.append("La ricerca non ha prodotto alcun risultato!");
        }
      },
      error: function functionName() {
      }
    })
  }
}

function stampa(listaOggetti, container) {
  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);
  for (var key in listaOggetti) {
    var context = {
      poster: listaOggetti[key].poster_path,
      title: listaOggetti[key].title,
      name: listaOggetti[key].name,
      originalTitle: listaOggetti[key].original_title,
      originalName: listaOggetti[key].original_name,
      language: listaOggetti[key].original_language,
      stars: printStars(listaOggetti[key].vote_average),
      trama: listaOggetti[key].overview,
      cast: getActors(listaOggetti[key].id)
    };
    if (context.name == undefined) {
      context.releaseYear = moment(listaOggetti[key].release_date, "YYYY-MM-DD").format("YYYY");
    } else {
      context.releaseYear = moment(listaOggetti[key].first_air_date, "YYYY-MM-DD").format("YYYY");
    }
    var html = template(context);
    container.append(html);
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

function getActors(id) {
  var listaAttori = "";
  $.ajax({
    url: "https://api.themoviedb.org/3/movie/" + id + "/credits",
    method: "GET",
    data: {
      api_key: "b1d8c49e5a444b10f55f930d8f4ed091",
    },
    success: function(risposta) {
      for (var i = 0; i < 5; i++) {
        console.log(risposta.cast[i].name);
        listaAttori += risposta.cast[i].name + ", ";
      }
      console.log(listaAttori);
    },
    error: function functionName() {
    }
  })
  return listaAttori;
}
