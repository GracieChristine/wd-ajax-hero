(function() {
  "use strict";

  let movies = [];

  let renderMovies = function() {
    $("#listings").empty();

    for (let movie of movies) {
      let $col = $("<div>").addClass("col s6");
      let $card = $("<div>").addClass("card hoverable");
      let $content = $("<div>").addClass("card-content center");
      let $title = $("<h6>").addClass("card-title truncate");

      $title.attr({
        "data-position": "top",
        "data-tooltip": movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      let $poster = $("<img>").addClass("poster");

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      let $action = $("<div>").addClass("card-action center");
      let $plot = $("<a>");

      $plot.addClass("waves-effect waves-light btn modal-trigger");
      $plot.attr("href", `#${movie.id}`);
      $plot.text("Plot Synopsis");

      $action.append($plot);
      $card.append($action);

      let $modal = $("<div>").addClass("modal").attr("id", movie.id);
      let $modalContent = $("<div>").addClass("modal-content");
      let $modalHeader = $("<h4>").text(movie.title);
      let $movieYear = $("<h6>").text(`Released in ${movie.year}`);
      let $modalText = $("<p>").text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $("#listings").append($col);

      $(".modal-trigger").leanModal();
    }
  };

  // ADD YOUR CODE HERE
  $("button").click((event) => {
    event.preventDefault();
    let searchTerm = $("#search").val();

    $.ajax({
      method: "GET",
      url: `http://www.omdbapi.com/?s=${searchTerm}`,
      dataType: "JSON",
      success: (data) => {
        let dataArray = data.Search;
        let sorted = dataArray.sort((a, b) => {
          return a.Year - b.Year;
        });

        for (let i = 0; i < data.Search.length; i++) {
          let movObj = {
            id: data.Search[i].imdbID,
            poster: data.Search[i].Poster,
            title: data.Search[i].Title,
            year: data.Search[i].Year
          };
          $.ajax({
            method: "GET",
            url: `http://www.omdbapi.com/?i=${data.Search[i].imdbID}&plot=short`,
            dataType: "JSON",
            success: (data1) => {
              movObj.plot = data1.Plot;
              movies.push(movObj);
            },
            error: () => {
              console.log("error");
            }
          });

        }
        renderMovies();
      },
      error: () => {
        console.log("error");
      }
    });
  });
})();
