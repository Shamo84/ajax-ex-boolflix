$(document).ready(function() {
  var moviesUrl = "https://api.themoviedb.org/3/search/movie";
  var seriesUrl = "https://api.themoviedb.org/3/search/tv";
  var movieContainer = $(".movie.container");
  var seriesContainer = $(".tvseries.container");
  stampaGeneri();

  $(document).on("click", "#search", function() {
    var ricerca = $("#input").val();
    sendRequestToServer(ricerca, moviesUrl, movieContainer, "movie");
    sendRequestToServer(ricerca, seriesUrl, seriesContainer, "tv");
    $("#input").val("");
  });
  $("#input").keyup(function(event) {
    if (event.which == 13) {
      var ricerca = $("#input").val();
      sendRequestToServer(ricerca, moviesUrl, movieContainer, "movie");
      sendRequestToServer(ricerca, seriesUrl, seriesContainer, "tv");
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

function sendRequestToServer(ricerca, url, container, string) {
  if ($("#input").val() != "") {
    container.html("");
    generiFilm = [];
    generiTv = [];
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
          stampa(risposta.results, container, string);
        } else {
          container.append("La ricerca non ha prodotto alcun risultato!");
        }
      },
      error: function functionName() {
      }
    })
  }
}

function stampa(listaOggetti, container, string) {
  var source = $("#entry-template").html();
  var template = Handlebars.compile(source);
  for (var key in listaOggetti) {
    var context = {
      id: listaOggetti[key].id,
      poster: listaOggetti[key].poster_path,
      title: listaOggetti[key].title,
      name: listaOggetti[key].name,
      originalTitle: listaOggetti[key].original_title,
      originalName: listaOggetti[key].original_name,
      language: listaOggetti[key].original_language,
      stars: printStars(listaOggetti[key].vote_average),
      trama: listaOggetti[key].overview,
    };
    if (string == "movie") {
      context.releaseYear = moment(listaOggetti[key].release_date, "YYYY-MM-DD").format("YYYY");
    } else {
      context.releaseYear = moment(listaOggetti[key].first_air_date, "YYYY-MM-DD").format("YYYY");
    }
    var html = template(context);
    container.append(html);
    getActors(listaOggetti[key].id, string);
    getGenres(listaOggetti[key].id, string);
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

function getActors(id, string) {
  var listaAttori = "";
  $.ajax({
    url: "https://api.themoviedb.org/3/"+ string + "/" + id + "/credits",
    method: "GET",
    data: {
      api_key: "b1d8c49e5a444b10f55f930d8f4ed091",
    },
    success: function(risposta) {
      for (var i = 0; i < 5; i++) {
        listaAttori += risposta.cast[i].name + ", ";
      }
      listaAttori = listaAttori.slice(0, listaAttori.length-2);
      $("#" + id).find(".cast").append(listaAttori);
    },
    error: function functionName() {
    }
  })
}
function getGenres(id, string) {
  var generi = "";
  $.ajax({
    url: "https://api.themoviedb.org/3/"+ string + "/" + id,
    method: "GET",
    data: {
      api_key: "b1d8c49e5a444b10f55f930d8f4ed091",
    },
    success: function(risposta) {
    for (var key in risposta.genres) {
      generi += risposta.genres[key].name + ", ";
      if (string == "movie") {
        if (!generiFilm.includes(risposta.genres[key].name)) {
          generiFilm.push(risposta.genres[key].name);
        }
      } else {
        if (!generiTv.includes(risposta.genres[key].name)) {
          generiTv.push(risposta.genres[key].name);
        }
      }
    }
    console.log(generiFilm);
    console.log(generiTv);
      generi = generi.slice(0, generi.length-2);
      $("#" + id).find(".generi").append(generi);
    },
    error: function functionName() {
    }
  })
}
function stampaGeneri() {
  // $.ajax({
  //   url: url,
  //   method: "GET",
  //   data: {
  //     api_key: "b1d8c49e5a444b10f55f930d8f4ed091",
  //     query: ricerca,
  //     language: "it-IT"
  //   },
  //   success: function(risposta) {
  //     if (risposta.total_results > 0) {
  //       $("h2.movie-title").removeClass("hidden");
  //       $("h2.tvseries-title").removeClass("hidden");
  //       stampa(risposta.results, container, string);
  //     } else {
  //       container.append("La ricerca non ha prodotto alcun risultato!");
  //     }
  //   },
  //   error: function functionName() {
  //   }
  // })
}
