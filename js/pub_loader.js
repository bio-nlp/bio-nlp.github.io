"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    const list = document.getElementById("publication");
    const filters = document.getElementById("publication-filters");
    const status = document.getElementById("publication-status");
    if (!list || !filters || !status) return;

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    function paperURL(value) {
        if (typeof value !== "string" || !value.trim()) return null;
        try {
            const url = new URL(value);
            return ["https:", "http:"].includes(url.protocol) ? url.href : null;
        } catch {
            return null;
        }
    }

    function paperLink(text, href) {
        const link = element("a", null, text);
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        return link;
    }

    try {
        const response = await fetch(new URL("../assets/publication.json", document.baseURI), {
            cache: "no-cache"
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid publication data");

        const publications = data.filter((item) =>
            item && item.show !== false && item.show !== "false" &&
            Number.isInteger(Number(item.year)) && Number(item.year) >= 1900 &&
            typeof item.title === "string" && item.title.trim()
        ).sort((a, b) => Number(b.year) - Number(a.year));
        const years = [...new Set(publications.map((item) => Number(item.year)))];

        function render(year) {
            const selected = publications.filter((item) => year === null || Number(item.year) === year);
            list.replaceChildren();
            filters.querySelectorAll("button").forEach((button) => {
                button.setAttribute("aria-pressed", String(button.dataset.year === String(year)));
            });
            const count = selected.length;
            status.textContent = `${count} publication${count === 1 ? "" : "s"}${year === null ? " across all years" : ` in ${year}`}`;
            if (!count) {
                list.append(element("p", null, "No publications available."));
                return;
            }

            const ul = element("ul");
            selected.forEach((item) => {
                const li = element("li");
                const publication = element("div", "publication");
                const content = element("div", "text");
                const title = element("div", "title");
                const href = paperURL(item.paper);
                title.append(href ? paperLink(item.title, href) : document.createTextNode(item.title));
                content.append(title, element("div", "authors", item.author || ""));

                const metadata = element("div");
                const venue = element("span", "venue");
                const venueName = item.venue || "";
                const venueText = venueName.includes(String(item.year))
                    ? venueName
                    : [venueName, item.year].filter(Boolean).join(" · ");
                venue.append(element("strong", null, venueText));
                if (item.note) venue.append(document.createTextNode(` (${item.note})`));
                metadata.append(venue);
                if (href) {
                    const tag = element("span", "tag");
                    tag.append(document.createTextNode(" "), paperLink("Paper", href));
                    metadata.append(tag);
                }
                content.append(metadata);
                publication.append(content);
                li.append(publication);
                ul.append(li);
            });
            list.append(ul);
        }

        filters.replaceChildren();
        [null, ...years].forEach((year) => {
            const button = element("button", "btn year-btn", year === null ? "All" : String(year));
            button.type = "button";
            button.dataset.year = String(year);
            button.addEventListener("click", () => render(year));
            filters.append(button);
        });
        render(years[0] ?? null);
    } catch (error) {
        filters.replaceChildren();
        list.replaceChildren();
        status.textContent = "Publications could not be loaded. Please reload this page.";
        console.error("Unable to load publications:", error);
    }
});