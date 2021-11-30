/* CONSTANTS AND GLOBALS */
const barMargin = {
    top: 15,
    right: 25,
    bottom: 25,
    left: 200
  };
  const barWidth = window.innerWidth * 0.75; //1200 - barMargin.right - barMargin.left;
  const barHeight = 2000 - barMargin.top - barMargin.bottom;
  
  /* LOAD DATA */
  d3.csv('../data/HDI.csv', d3.autoType)
    .then(HDI=> {
      //console.log(quirrelActivities)
      const svgBar = d3.select("#bar-chart")
        .append("svg")
        .attr("width", barWidth + barMargin.left) //+ barMargin.left //+ barMargin.right)
        .attr("height", barHeight + barMargin.top + barMargin.bottom)
        .style("background-color", "#ffffff")
        .style("barMargin-top", "20px")
        .style("border-style", "solid")
        
     
      /**********/   
      /* SCALES */
      /**********/   
      
    const xScale = d3.scaleLinear()
      .domain([0, 1])
      .range([barMargin.left, barWidth - barMargin.right])
      .nice()
    
  
    const yScale = d3.scaleBand()
      .domain(HDI.map(d => d.Country))
      .range([barHeight - barMargin.bottom, barMargin.top])
      .padding(.3);
        
    const colorScale = d3.scaleOrdinal()
      .domain(d3.extent(HDI, d => d.Country))
      .range(d3.schemeSet3)
        
      
      /*****************/  
      /* HTML ELEMENTS */
      /*****************/
  
      // Chart title //
     svgBar.append("text")
     .attr("class","title")
     .attr("x", (barWidth * 0.5))
     .attr("y", 0 + barMargin.top)
     .text("Human Development Index Score by Country")
     .style("font-size", "1.2em")
     .style("text-decoration", "underline")
  
  
      // X-axis
       svgBar.append("g")
       .attr("class", "x-axis")
       .style("transform", `translate(0,${barHeight - barMargin.top}px)`)
       .call(d3.axisBottom(xScale))
  
       svgBar.append("text")
       .attr("transform", "translate(" + (barWidth / 2) + " ," + (barHeight + (barMargin.top * 2)) + ")")
       .style("text-anchor", "middle")
       .text("HDI Score"); 
     
     // Y-axis
     svgBar.append("g")
       .attr("class", "y-axis")
       .style("transform", `translate(${barMargin.left}px,0px)`)
       .call(d3.axisLeft(yScale))
  
     svgBar.append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", (barMargin.left/4))
         .attr("x", 0 - (barHeight/2))
         .style("text-anchor", "middle")
         .text("Countries");
  
      
      /* Horizontal bar chart */
      svgBar.selectAll(".bar")
        .data(HDI)
        .join("rect")
        .attr("class", "bar")
        .attr("y", d => yScale(d.Country))
        .attr("x", d => xScale(0))
        .attr("height", yScale.bandwidth())
        .attr("width", d => xScale(d.HDI_score))
        .attr("fill", d => colorScale(d.Country))
        
        
       
  
    })