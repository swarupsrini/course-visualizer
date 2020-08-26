const log = console.log;
log("index.js");

// // create data
// var data = {
//   nodes: [
//     { id: "Richard" },
//     { id: "Larry" },
//     { id: "Marta" },
//     { id: "Jane" },
//     { id: "Norma" },
//     { id: "Frank" },
//     { id: "Brett" },
//   ],
//   edges: [
//     { from: "Richard", to: "Larry" },
//     { from: "Richard", to: "Marta" },
//     { from: "Larry", to: "Marta" },
//     { from: "Marta", to: "Jane" },
//     { from: "Jane", to: "Norma" },
//     { from: "Jane", to: "Frank" },
//     { from: "Jane", to: "Brett" },
//     { from: "Brett", to: "Frank" },
//   ],
// };

// const programs = ["SCSPE0795C", "SCSPE0805C"];
const program = "SCSPE0805C";
const proxy = "https://cors-anywhere.herokuapp.com/";
// const regexp = /CSC.\d\d/g;

fetch(
  proxy + "https://nikel.ml/api/courses?campus=Scarborough&code=CSC&limit=100"
)
  .then((response) => response.json())
  .then((res) => {
    let nodes = res.response;
    nodes = nodes.filter(
      (item, i) => nodes.findIndex((e) => e.code === item.code) === i
    );
    nodes = nodes.map((item) => ({
      id: item.code.substring(0, 6),
      group: item.code.substring(3, 4),
      prerequisites: item.prerequisites
        ? [...item.prerequisites.matchAll(/CSC.\d\d/g)].flat()
        : null,
    }));
    const coords = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };
    nodes = nodes.map((item) => {
      return {
        ...item,
        x: (item.group.charCodeAt() - "A".charCodeAt()) * 200,
        y: coords[item.group]++ * 50,
      };
    });
    const edges = nodes.flatMap(({ id, prerequisites }) =>
      prerequisites
        ? prerequisites.map((prereq) => ({ from: prereq, to: id }))
        : null
    );
    log(nodes);
    const chart = anychart.graph({ nodes, edges });
    chart.nodes().labels().enabled(true);
    chart.nodes().labels().format("{%id}");
    chart.nodes().labels().fontSize(12);
    chart.group("A").fill("#58CCED");
    chart.group("B").fill("#3895D3");
    chart.group("C").fill("#1261A0");
    chart.group("D").fill("#072F5F");
    chart.container("container");
    chart.draw();
    chart.layout().type("fixed");
  })
  .catch((err) => log(err));
