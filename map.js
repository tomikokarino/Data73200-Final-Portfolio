/**
 * CONSTANTS AND GLOBALS
 * */
 const width = window.innerWidth * 0.9,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };
 
let svgMap,
    hoverBox;

/**
* APPLICATION STATE
* */
let country = {
 geojson: [],
 HDI: [],
};


/**
* LOAD DATA
* Using a Promise.all([]), we can load more than one dataset at a time
* */
Promise.all([
d3.json("../data/world.json"), // data soure: https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson
d3.csv("../data/HDI.csv")
]).then(([geojson, HDI]) => {
country.geojson = geojson;
country.HDI = HDI
console.log(country.HDI);
 init();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
 function init() {
 
 /*********************/
 /*** LOOKUP TABLES ***/ 
 /*********************/
 
 const HDILookup = new Map(country.HDI.map(d => [
   d['Country'], d['HDI_score']
 ]))
 console.log('HDILookup :>> ', HDILookup.get("United States"));

 const HDIRankLookup = new Map(country.HDI.map(d => [
    d['Country'], d['HDI_rank']
  ]))
  console.log('HDIRankLookup :>> ', HDIRankLookup.get("United States"));
 
 const lifeExpectancyLookup = new Map(country.HDI.map(d => [
    d['Country'], d['Life_Expectancy_at_Birth']
  ]))
  console.log('lifeExpectancyLookup  :>> ', lifeExpectancyLookup .get("United States"));
 
/**********/
/* SCALES */
/**********/

const colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateRdYlGn)
    // interpolateSpectral | interpolateRainbow | interpolateRdYlGn
    .domain(d3.extent(country.HDI.map(d => d['HDI_score'])))


  
  /***************/
  /*** SVG MAP ***/
  /***************/

 svgMap = d3.select("#map")
   .append("svg")
   .attr("width", width)
   .attr("height", height)

 hoverBox = d3.select("#hover")

 const projection = d3.geoEqualEarth()
   .fitSize([width, height], country.geojson)
 const pathGen = d3.geoPath().projection(projection);
// https://github.com/d3/d3-geo-projection
// geoEqualEarth
// geoStereographic
// geoNaturalEarth1
// geoMercator *** 
// geoGnomonic
// geoEquirectangular
// geoConicEquidistant
// geoConicEqualArea
// geoConicConformal -- sort of works. huge antarctica
// geoAlbers ***
// geoTransverseMercator
// geoConicEquidistant
// geoOrthographic ***


 const countries = svgMap.selectAll("path.country")
   .data(country.geojson.features)
   .join("path")
   .attr("class", "country")
   .attr("d", d => pathGen(d))
   .attr("stroke","white")
   .attr("fill", (d, i) => {
    //  console.log(d)
     // console.log(vaccinationLookup.get(d.properties.name))
     return colorScale(+HDILookup.get(d.properties.name))
   })

 countries.on("mousemove", (ev, d) => {
  console.log('d :>> ', d);
   country.hover_country = d.properties.name;
   country.hover_HDI_rank = HDIRankLookup.get(d.properties.name)
   country.hover_life = lifeExpectancyLookup.get(d.properties.name)
   draw();
 })


draw(); // calls the draw function


/*********************/
/*** DRAW FUNCTION ***/ 
/* we call this every time there is an update to the data/state
/*********************/
function draw() {
 hoverBox
   .style("top", country.y + "px")
   .style("left", country.x + "px")
   .html(
     `<div class="hover_container">
     <div>Country: ${country.hover_country}</div>
     <div>World HDI rank: ${country.hover_HDI_rank}</div>
     <div>Life expectancy at birth: ${country.hover_life} years</div>
     </div>`
  )

}
 }
