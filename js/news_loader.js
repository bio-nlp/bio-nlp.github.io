$(document).ready(function () {
  var json_news_url = "./assets/news.json?v=" + new Date().getTime();

  $.getJSON(json_news_url)
    .done(function (data) {
      var news_html = "";
      data.forEach(function (item) {
        news_html += "<li><b>(" + item.date + ")</b> " + item.content + "</li>";
      });
      $("#news").html(news_html);
    })
    .fail(function (jqxhr, textStatus, error) {
      console.error("❌ Failed to load news:", textStatus, error);
      $("#news").html("<p style='color:red;'>Error loading news file.</p>");
    });
});
