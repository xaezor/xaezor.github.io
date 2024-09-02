$(document).ready(function() {

  // set jquery UI autocomplete	
  $('input#input-search').autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "http://en.wikipedia.org/w/api.php",
        dataType: "jsonp",
        data: {
          'action': "opensearch",
          'format': "json",
          'search': request.term
        },
        success: function(data) {
          response(data[1]);
        }
      });
    },
    minLength: 2,
    select: function(event, ui) {
      event.preventDefault();
      // clear previuos results
      $('.results').empty();
      // pull results from get call and render
      searchWiki(ui.item.value);
    }
  });

  /* click button event */
  $('button#button-search').click(function(event) {
    event.preventDefault();
    // clear previuos results
    $('.results').empty();
    searchWiki($('input#input-search').val());
  });

  /* clearing the results event if user press Backspace */
  $('input').keyup(function(e) {
    if (e.which === 8) {
      displayAfterSearchLine(0, 0);
      $('.results').empty();
    }
  });

  // fade in (val=1) or out (val=0) the after-search-line with chosen speed
  var displayAfterSearchLine = function(speed, val) {
    $('.post-awesome-line').css({
      transition: 'opacity ' + speed + 's ease-in-out',
      'opacity': val
    });
  };

  /* search value in wikipedia and parse it to a list */
  var searchWiki = function(val) {
    displayAfterSearchLine(0.5, 1);
    $.getJSON('https://en.wikipedia.org/w/api.php?action=opensearch&search=' + val + '&callback=?', function(data) {

      // go over all values
      for (var i = 0; i < data[1].length; i++) {
        var title = data[1][i];

        // if title ends with - omit it
        if (title.length - 1 === '-') {
          title = title.substring(0, str.length - 1);
        }

        // if there is no description - add 'No Description'
        var desc;
        if (data[2][i] !== '') {
          desc = data[2][i];
        } else {
          desc = 'No Description';
        }

        // define page link
        var link = data[3][i];

        // declare th<li> html 
        var listLi = '<li><a href="' + link + '" target="_blank"><span class="title">' + title + '</span><span class="desc"> - ' + desc + '</span></a></li>';

        // append to <ul> 
        $('.results').append(listLi);
      } // close 'for' loop
    }); // close JSON call
  }; // close searchWiki function
});