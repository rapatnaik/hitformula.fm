const margin = { top: 30, right: 20, bottom: 40, left: 60 };
const width = 900 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("#tooltip");

let data;

// Update this to match your filename
const CSV_FILE = "sample.csv";

// Load and parse data
d3.csv(CSV_FILE).then((rawData) => {
  data = rawData.map((d) => {
    return {
      song_name: d.song_name,
      popularity: +d.popularity,
      danceability: +d.danceability,
      energy: +d.energy,
      valence: +d.valence,
      acousticness: +d.acousticness,
      speechiness: +d.speechiness,
    };
  });

  updateChart("danceability");
});

function updateChart(feature) {
  svg.selectAll("*").remove();

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[feature])])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g").call(d3.axisLeft(y));

  svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => x(d[feature]))
    .attr("cy", (d) => y(d.popularity))
    .attr("r", 5)
    .attr("fill", "#00ff99")
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.song_name}</strong><br>${feature}: ${d[feature]}<br>Popularity: ${d.popularity}`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));
}

d3.select("#featureSelect").on("change", function () {
  const selected = this.value;
  updateChart(selected);
});