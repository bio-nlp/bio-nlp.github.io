function render_pub(elements, filter = null) {
    console.log("Rendering publications for year:", filter);
    var decodedText = '';
    var counter = 0;

    // Clear previous content
    $('#publication').empty();

    $.each(elements, function (index, value) {
        if (!value.year) return;

        // Convert both to string to avoid mismatch
        var pubYear = String(value.year);
        var filterYear = String(filter);

        if (filter != null && pubYear !== filterYear) {
            return; // Skip publications not matching year
        }

        counter += 1;

        var venue_text = value.venue ?
            `<span class="venue"><strong>${value.venue} ${value.year}</strong>` : '';

        if (value.note) {
            venue_text += ` (<span class="highlight" style="color:red">${value.note}</span>)`;
        }
        venue_text += '</span>';

        var paper_text = value.paper ?
            `<span class="tag"> <a href="${value.paper}" target="_blank">Paper</a></span>` : '';

        var decodedVar = `<li>
            <div class="publication">
                <div class="text">
                    <div class="title"><a href="${value.paper}" target="_blank">${value.title}</a></div>
                    <div class="authors">${value.author}</div>
                    <div>${venue_text} ${paper_text}</div>
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
    console.log("Rendered", counter, "publications.");
}


// ======================================================
// Load JSON and show selected year
// ======================================================
function filterByYear(year) {
    // Try both possible paths (works both locally and on GitHub Pages)
    var possiblePaths = ['../assets/publication.json', './assets/publication.json'];
    var tried = 0;

    function tryNextPath() {
        if (tried >= possiblePaths.length) {
            $('#publication').html("<p style='color:red;'>Error loading publications file.</p>");
            return;
        }

        var json_pub_url = possiblePaths[tried];
        console.log("Trying to load:", json_pub_url);

        $.getJSON(json_pub_url + '?v=' + new Date().getTime())
            .done(function (result) {
                console.log("✅ JSON loaded successfully from:", json_pub_url);
                render_pub(result, year);
            })
            .fail(function (jqxhr, textStatus, error) {
                console.warn("❌ Failed to load from:", json_pub_url, "—", textStatus);
                tried++;
                tryNextPath(); // Try the next path
            });
    }

    tryNextPath();
}


// ======================================================
// Default load — latest year (2025)
// ======================================================
$(document).ready(function () {
    console.log("📖 Page ready — loading 2025 publications");
    filterByYear(2025);
});
