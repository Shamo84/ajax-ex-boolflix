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
  $("#input").val("");
  $.ajax({
    url: "https://api.themoviedb.org/3/search/movie",
    method: "GET",
    data: {
      api_key: "b1d8c49e5a444b10f55f930d8f4ed091",
      query: ricerca,
      language: "it-IT"
    },
    success: function(risposta) {
      stampaFilm(risposta.results);
    },
    error: function functionName() {
      alert("error");
    }
  })
}

function stampaFilm(listaOggetti) {
  $(".container").html("");
  for (var key in listaOggetti) {
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);
    var context = {
      title: listaOggetti[key].title,
      originalTitle: listaOggetti[key].original_title,
      language: listaOggetti[key].original_language,
      rating: listaOggetti[key].vote_average
    };
    var html = template(context);
    $(".container").append(html);
  }
}
