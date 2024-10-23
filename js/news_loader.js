function render_news(elements=null, filter=null){
    var decoded_text = '';
    var counter = 0;
    $.each(elements, function (index, value) {
        counter += 1;
        console.log( value );
        if (value.date != null && value.description != null){
            var decodedVar = '<li>(' + value.date + ') ' + value.description + '</li>';
        }
        decoded_text += decodedVar;
    });



    if (counter > 0){
        decoded_text = '<ul>' + decoded_text + '</ul>';
    }

    console.log(decoded_text);

    $('#news_lst').append(decoded_text);
}

var json_news_url = '../assets/news.json'; 
console.log(json_news_url);
$.getJSON(json_news_url, function foo(result) { render_news(result); });





