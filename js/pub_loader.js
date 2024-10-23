function render_pub(elements, filter=null){
    var decodedText = '';
    var counter = 0;

    // Clear previous content
    $('#publication').empty();

    $.each(elements, function (index, value) {
        if (filter != null && value.year != filter) {
            return; // Skip publications not in the selected year
        }
        
        counter += 1;

        var venue_text = value.venue ? 
            `<span class="venue"><strong>${value.venue} ${value.year}</strong>` : '';

        if (value.note) {
            venue_text += ` (<span class="highlight" style="color:red">${value.note}</span>)`;
        }
        venue_text += '</span>';

        var paper_text = value.paper ? 
            `<span class="tag"> <a href="${value.paper}">Paper</a></span>` : '';

        var decodedVar = `<li>
            <div class="publication">
                <div class="text">
                    <div class="title"><a href=${value.paper}>${value.title}</a></div>
                    <div class="authors">${value.author}</div>
                    <div>${venue_text}</div>
                </div>
            </div>
        </li>`;

        decodedText += decodedVar;
    });
   
    if (counter > 0) {
        decodedText = '<ul>' + decodedText + '</ul>';
    } else {
        decodedText = '<p>No publications found for this year.</p>';
    }

    $('#publication').append(decodedText);
}

// Load the JSON and render based on the selected year
function filterByYear(year) {
    var json_pub_url = '../assets/publication.json'; // Adjust path as needed

    $.getJSON(json_pub_url, function(result) {
        render_pub(result, filter=year);
    });
}

// By default, show the latest year (e.g., 2024)
$(document).ready(function() {
    filterByYear(2024); // Initial load
});
