// Get the margin to width ratio as a percent
// using the margin object properties
function getRatio (side) {
  return ((margin[side] / width) * 100) + '%';
}
// data
var regions = [['U.K', 'U.S.', 'Ontario', 'Italy', 'Japan', 'Germany', 'France'],
			   ['Texas', 'Ontario', 'New York', 'Illinois', 'Massachusetts', 'California'],
			   ['U.S.', 'U.K.', 'Japan', 'Germany', 'Italy', 'Australia', 'France', "Netherland","Ontario"]]
var numbers = [[19, 26, 26.5, 27.8, 29.9, 30.1, 34.4],
			   [26, 26.5, 27.5, 28.8, 29, 29.8],
			   [0, 11.9, 12.8, 16, 21, 22.1, 22.4, 26, 27.8]]
// Declare Dimensions to create graph
// Margin for x and y axes
// height and width determines the size of the chart

// change margin to get different size of viewBox
var margin = { left: 100, top: 10, right: 50, bottom: 130 }
var width = 600
var height = 180
// marginRatio converts margin absolute values to
// percent values to keep SVG responsive
var marginRatio = {
  left: getRatio('left'),
  top: getRatio('top'),
  right: getRatio('right'),
  bottom: getRatio('bottom')
}


// generate bar chart
var generate = function(){
	// for 3 sets of charts
	for (var i = 0; i <= 2; i++){
		var chartString = "div#chart" + i.toString();
		var region = regions[i];
		var number = numbers[i];
		var barWidth = width / number.length -30
		var svg = d3.select(chartString)
		// Create div to act as SVG container
		    .append('div')
		    .attr('class', 'svg-container')
		    // Add SVG that will contain Graph elements
		    .append('svg')
		    // Add margin to show axes
		    .style('padding', marginRatio.top + ' ' + marginRatio.right + ' ' + marginRatio.bottom + ' ' + marginRatio.left)
		    // Preserve aspect ratio xMinYmin ensures SVG fills #svg-container
		    .attr('preserveAspectRatio', 'xMinYMin meet')
		    // Sets the viewbox, for more info on viewbox, combined with preveserveAspectRatio, this is what turns the bar chart
		    // into a responsive bar chart
		    .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
		    // Id to target with CSS
		    .attr('class', 'svg-content-responsive')
		// Define x axis
		var x = d3.scale.ordinal()
		// Domain stands for input domain, this is the data we want to display
		    .domain(region)
		    .rangeRoundBands([0, width], 0.1, 0.1)
		
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient('bottom')
		//Define y axis
		var y = d3.scale.linear()
		    .domain([d3.max(number) + 5, 0])
		    .range([0, height])
		
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient('left')

		// Bind data to bar groups
		var bar = svg.selectAll('g')
		    .data(number)
		    .enter()
		    .append('g')
		    .attr('transform', function (d, j) { return 'translate(' + (j * (barWidth+28.5) + 21)+ ', 0)' })
		// Add x axis to svgContainer
		svg.append('g')
		    .attr('class', 'x axis')
		    .call(xAxis)
		    .attr('transform', 'translate(0,' + height + ')')
		    .style("font-size", "12px")
		// Add y axis
		svg.append('g')
		    .attr('class', 'y axis')
		    .call(yAxis)
		    .style("font-size", "12px")

		//add % to y-axis
		d3.select(chartString + ' .y')
		  .selectAll('text')
		  .text(function(d){
		    return d + "%";
		  })
		  
		// Add bars
		// barWidth is calculated dynamically from the width divided by data.length
		// The y attribute and height is based on the data, scaled to the height of
		// graph. 
		bar.append('rect')
		    .attr('class', 'bar')
		    // -30 for the spacing between bars
		    .attr('width', barWidth)
		    .attr('y', function (d) { return y(d) })
		    .attr('height', function (d) { return height - y(d) })



	  // Define the div for the tooltip
	  // c
	  var tooltip = d3.select("#chart2").append("div") 
	    .attr("class", "tooltip")       
	    .style("opacity", 0);

	  bar.on("mouseover", function(d) {    
	            tooltip.transition()    
	                .duration(200)    
	                .style("opacity", .9);    
	            tooltip.html("Tax Rate: " + "<br/>" + d + "%")
	                .style("left", (d3.event.pageX) + "px")   
	                .style("top", (d3.event.pageY - 28) + "px");  
	            })          
	        .on("mouseout", function(d) {   
	            tooltip.transition()    
	                .duration(500)    
	                .style("opacity", 0); 
	        });

	  // Define data on top of bar
	  var barText = bar.append("g")
	                  .append("text")
	                  .attr("class", "barText")
	                  .attr("fill", "#000")
	                  // for shifting text hortizontally
	                  .attr("x", function(){
	                  	if (i == 0) {
	                  		return 9;
	                  	} else if (i == 1){
	                  		return 12
	                  	} else {
	                  		return 2
	                  	}
	                  })
	                  .attr("y", function(d) {
	                      return d == 0 ? 170 : y(d) + 15;

	                  })
	                  .text(function(d){
	                       return d + "%";
	                  })
	                  .style("font-size", "12px");
	  
	}

}

// resize function to fit different window size
// this function redraws the chart everytime 
var resize = function(){
	// clear the chart
	d3.selectAll(".svg-container").remove();

	//modify the height to fit the current width
	//change 240 to get different ratio
	height = width/window.innerWidth * 240;
	height = height <= 180 ? 180 : height;

	// redraw the chart
	generate();

	// get the ratio to resize the labels on both X and Y axes
	var currWidth = window.innerWidth;
	var currRatio = (600/currWidth) * 1.2;
	currRatio = currRatio <= 1 ? 1 : currRatio;

	//function to apply the ratio to scale text
	function ratioScale(d, i, domElement) {
		//only modify transform part
   		var currTransform = domElement.getAttribute("transform");
   		// remove previous scale data and keep the translate part
   		if (currTransform.indexOf("scale") != -1){
   			currTransform = currTransform.substring(0, currTransform.indexOf("scale"));
   		}
   		// get the new transform style
   		var newTransform = currTransform + "scale(" + currRatio +")";
   		domElement.setAttribute("transform", newTransform);
	}

	//modify text on x-axis
	var xAixsg = d3.selectAll(".x g")
				   .each(function(d, i){
				   		ratioScale(d,i,this);
				   });

	//modify text on y-axis
	var yAixsg = d3.selectAll(".y g")
				   .each(function(d, i){
				   		ratioScale(d, i, this);
				   })
}

//calling the function to generate the chart
generate();
//resize to get the best size
resize();

window.onresize = resize;
