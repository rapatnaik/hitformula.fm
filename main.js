//     // --- Comparison chart setup ---
//     const compareMargin = { top: 30, right: 20, bottom: 40, left: 60 };
//     const compareWidth = 600 - compareMargin.left - compareMargin.right;
//     const compareHeight = 300 - compareMargin.top - compareMargin.bottom;
  
//     document.getElementById("compareBtn").addEventListener("click", () => {
//       const name1 = document.getElementById("song1").value.trim().toLowerCase();
//       const name2 = document.getElementById("song2").value.trim().toLowerCase();
//       const songA = data.find((d) => d.song_name.toLowerCase().includes(name1));
//       const songB = data.find((d) => d.song_name.toLowerCase().includes(name2));
//       if (!songA || !songB) {
//         alert("Both songs must be found in the dataset!");
//         return;
//       }
//       drawCompare(songA, songB);
//     });
  
//     function drawCompare(songA, songB) {
//       const features = [
//         "danceability",
//         "energy",
//         "valence",
//         "acousticness",
//         "speechiness",
//       ];
  
//       const compareDiv = d3.select("#compareChart").html("");
//       const svg2 = compareDiv
//         .append("svg")
//         .attr(
//           "width",
//           compareWidth + compareMargin.left + compareMargin.right
//         )
//         .attr(
//           "height",
//           compareHeight + compareMargin.top + compareMargin.bottom
//         )
//         .append("g")
//         .attr(
//           "transform",
//           `translate(${compareMargin.left},${compareMargin.top})`
//         );
  
//       const x0 = d3
//         .scaleBand()
//         .domain(features)
//         .range([0, compareWidth])
//         .padding(0.1);
  
//       const x1 = d3
//         .scaleBand()
//         .domain(["song1", "song2"])
//         .range([0, x0.bandwidth()])
//         .padding(0.05);
  
//       const yMax = d3.max([
//         ...features.map((f) => songA[f]),
//         ...features.map((f) => songB[f]),
//       ]);
  
//       const y = d3
//         .scaleLinear()
//         .domain([0, yMax])
//         .nice()
//         .range([compareHeight, 0]);
  
//       const color = d3
//         .scaleOrdinal()
//         .domain(["song1", "song2"])
//         .range(["#00ff99", "#ff9933"]);
  
//       svg2.append("g").call(d3.axisLeft(y));
  
//       svg2
//         .append("g")
//         .attr("transform", `translate(0,${compareHeight})`)
//         .call(d3.axisBottom(x0));
  
//       const featureGroups = svg2
//         .selectAll("g.feature")
//         .data(features)
//         .join("g")
//         .attr("class", "feature")
//         .attr("transform", (d) => `translate(${x0(d)},0)`);
  
//       featureGroups
//         .selectAll("rect")
//         .data((d) => [
//           { key: "song1", value: songA[d] },
//           { key: "song2", value: songB[d] },
//         ])
//         .join("rect")
//         .attr("x", (d) => x1(d.key))
//         .attr("y", (d) => y(d.value))
//         .attr("width", x1.bandwidth())
//         .attr("height", (d) => compareHeight - y(d.value))
//         .attr("fill", (d) => color(d.key));
  
//       // Optional legend
//       const legend = compareDiv.append("div").attr("class", "legend");
//       [songA.song_name, songB.song_name].forEach((title, i) => {
//         legend
//           .append("span")
//           .style("display", "inline-block")
//           .style("margin-right", "10px")
//           .html(
//             `<span style="display:inline-block;width:12px;height:12px;background:${color(i===0?"song1":"song2")};margin-right:4px"></span>${title}`
//           );
//       });
//     }
//   });
  
// main.js
window.addEventListener("DOMContentLoaded", () => {
    // --- Scatterplot setup ---
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
  
    // Default songs for comparison
    const defaultSong1 = "Don't Hold Back";
    const defaultSong2 = "Love Myself";
  
    // Cache DOM elements
    const input1 = document.getElementById("song1");
    const input2 = document.getElementById("song2");
    const compareBtn = document.getElementById("compareBtn");
  
    // Load data and initialize
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
  
      // Scatterplot initial feature
      updateChart("danceability");
  
      // Set default input values
      input1.value = defaultSong1;
      input2.value = defaultSong2;
  
      // Render initial comparison
      triggerComparison();
    });
  
    function updateChart(feature) {
      svg.selectAll("*").remove();
      const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[feature])])
        .range([0, width]);
      const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
  
      svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
      svg.append("g").call(d3.axisLeft(y));
  
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
  
    // --- Comparison chart setup ---
    const compareMargin = { top: 30, right: 20, bottom: 40, left: 60 };
    const compareWidth = 600 - compareMargin.left - compareMargin.right;
    const compareHeight = 300 - compareMargin.top - compareMargin.bottom;
  
    compareBtn.addEventListener("click", triggerComparison);
  
    function triggerComparison() {
      // Get values (or defaults if empty)
      const name1 = (input1.value || defaultSong1).trim().toLowerCase();
      const name2 = (input2.value || defaultSong2).trim().toLowerCase();
      const songA = data.find((d) => d.song_name.toLowerCase().includes(name1));
      const songB = data.find((d) => d.song_name.toLowerCase().includes(name2));
      // Fallback: clear chart if not found
      if (!songA || !songB) {
        d3.select("#compareChart").html(
          `<p style="text-align:center;color:#888;">Enter two valid songs to compare.</p>`
        );
        return;
      }
      drawCompare(songA, songB);
    }
  
    function drawCompare(songA, songB) {
      const features = [
        "danceability",
        "energy",
        "valence",
        "acousticness",
        "speechiness",
      ];
  
      const compareDiv = d3.select("#compareChart").html("");
      const svg2 = compareDiv
        .append("svg")
        .attr(
          "width",
          compareWidth + compareMargin.left + compareMargin.right
        )
        .attr(
          "height",
          compareHeight + compareMargin.top + compareMargin.bottom
        )
        .append("g")
        .attr(
          "transform",
          `translate(${compareMargin.left},${compareMargin.top})`
        );
  
      const x0 = d3
        .scaleBand()
        .domain(features)
        .range([0, compareWidth])
        .padding(0.1);
  
      const x1 = d3
        .scaleBand()
        .domain(["song1", "song2"])
        .range([0, x0.bandwidth()])
        .padding(0.05);
  
      const yMax = d3.max([
        ...features.map((f) => songA[f]),
        ...features.map((f) => songB[f]),
      ]);
  
      const y = d3
        .scaleLinear()
        .domain([0, yMax])
        .nice()
        .range([compareHeight, 0]);
  
      const color = d3
        .scaleOrdinal()
        .domain(["song1", "song2"])
        .range(["#00ff99", "#ff9933"]);
  
      svg2.append("g").call(d3.axisLeft(y));
  
      svg2
        .append("g")
        .attr("transform", `translate(0,${compareHeight})`)
        .call(d3.axisBottom(x0));
  
      const featureGroups = svg2
        .selectAll("g.feature")
        .data(features)
        .join("g")
        .attr("class", "feature")
        .attr("transform", (d) => `translate(${x0(d)},0)`);
  
      featureGroups
        .selectAll("rect")
        .data((d) => [
          { key: "song1", value: songA[d] },
          { key: "song2", value: songB[d] },
        ])
        .join("rect")
        .attr("x", (d) => x1(d.key))
        .attr("y", (d) => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", (d) => compareHeight - y(d.value))
        .attr("fill", (d) => color(d.key));
  
      // Legend
      const legend = compareDiv.append("div").attr("class", "legend");
      [songA.song_name, songB.song_name].forEach((title, i) => {
        legend
          .append("span")
          .style("display", "inline-block")
          .style("margin-right", "10px")
          .html(
            `<span style="display:inline-block;width:12px;height:12px;background:${
              i === 0 ? "#00ff99" : "#ff9933"
            };margin-right:4px"></span>${title}`
          );
      });
    }
  });
  