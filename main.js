
// main.js

// Wait until the DOM is fully loaded
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

const CSV_FILE = "sample.csv";

d3.csv(CSV_FILE).then((rawData) => {
  data = rawData.map((d) => ({
    song_name: d.song_name,
    popularity: +d.popularity,
    danceability: +d.danceability,
    energy: +d.energy,
    valence: +d.valence,
    acousticness: +d.acousticness,
    speechiness: +d.speechiness,
  }));

  updateChart("danceability");
});

function updateChart(feature) {
  svg.selectAll("*").remove();

  // Scales
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[feature])])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

  // Axes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  svg.append("g").call(yAxis);

  // Axis Labels
  svg
    .append("text")
    .attr("class", "axis-label x-label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5)
    .text(feature.charAt(0).toUpperCase() + feature.slice(1));

  svg
    .append("text")
    .attr("class", "axis-label y-label")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      `translate(${-margin.left + 15},${height / 2}) rotate(-90)`
    )
    .text("Popularity");

  // Data points
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
        .html(
          `<strong>${d.song_name}</strong><br>${feature}: ${d[feature]}<br>Popularity: ${d.popularity}`
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));
}

d3.select("#featureSelect").on("change", function () {
  const selected = this.value;
  updateChart(selected);
});

