// Get the margin to width ratio as a percent
// using the margin object properties
function getRatio (side) {
  return ((margin[side] / width) * 100) + '%';
}
// Simple example dataset
var regions = [['U.K', 'U.S.', 'Ontario', 'Italy', 'Japan', 'Germany', 'France'],
			   ['Texas', 'Ontario', 'New York', 'Illinois', 'Massachusetts', 'California'],
			   ['U.S.', 'U.K.', 'Japan', 'Germany', 'Italy', 'Australia', 'France', "Netherland","Ontario"]]
var numbers = [[19, 26, 26.5, 27.8, 29.9, 30.1, 34.4],
			   [26, 26.5, 27.5, 28.8, 29, 29.8],
			   [0, 11.9, 12.8, 16, 21, 22.1, 22.4, 26, 27.8]]
// Declare Dimensions to create graph
// Margin is used to show x and y axes
// Size here is declared in pixels, although this
// defines the relative values, since the chart changes depending
// on container
var margin = { left: 80, top: 10, right: 30, bottom: 120 }
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

//define tooltip
var tooltip = d3.select(".chart").append("div") 
		    .attr("class", "tooltip")       
		    .style("opacity", 0);

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
		// Define the x scale as ordinal, ordinal means the data cannot be meassured by a
		// standard of difference. This is different to a linear scale that we will use later
		var x = d3.scale.ordinal()
		// Domain stands for input domain, this is the data we want to display
		    .domain(region)
		    // Range stands for Output Range, this is the width the data will take up
		    // Here it is used for the x axis. 0 is the start of our graph, width is the
		    // end of it
		    .rangeRoundBands([0, width], 0.1, 0.1)
		// Here we define the x axis using the svg.axis() method. The x scale we just
		// defined tells the axis what data to display and how big the intervals
		// between that data is on the axis. Orient bottom means it will be shown below
		// the bars.
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient('bottom')
		// Here we repeat the process for the y axis. The difference is that we have numerical
		// data, so we can use scale.linear.
		var y = d3.scale.linear()
		// Instead of using the whole array for the input domain, we use 0, since we
		// want our y axis to start at 0, and the biggest value of our dataset
		// d3.max returns the largest value of an array
		    .domain([d3.max(number) + 5, 0])
		    .range([0, height])
		// This is defined in the same wat the x axis is defined, except the orient is now left
		// instead of bottom - for obvious reasons.
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient('left')
	
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

		// add horizontal gridlines
		d3.selectAll(chartString + " .y g line")
			.attr("x1","-6")
			.attr("x2", "600")
			.style("stroke", "rgba(0, 0, 0, 0.18)")

		// draw the bar chart after grid line so the gridlines are behind the bar chart
		// Bind data to bar groups
		var bar = svg.selectAll('g')
			// filter all g appended to x and y axis to the svg and then bind the data
			.filter(function() {
				// using d3 selectors instead of native JS because IE freaking sucks and does not support classList
				return !(d3.select(this).attr("class") === "x axis") && !(d3.select(this).attr("class") === "y axis") && !(d3.select(this).attr("class") === "tick");
		    	//return !(this.classList.contains('axis') || this.classList.contains('tick') );
		    })
		    .data(number)
		    .enter()
		    .append('g')
		    .attr('transform', function (d, j) { return 'translate(' + (j * (barWidth+28.5) + 21)+ ', 0)' })

		//add % to y-axis
		d3.select(chartString + ' .y')
		  .selectAll('text')
		  .text(function(d){
		    return d + "%";
		  })
		  
		// Add SVG rectangles that act as bars
		// barWidth is calculated dynamically from the width divided by data.length
		// The y attribute and height is based on the data, scaled to the height of
		// graph. Remember input domain and output range
		bar.append('rect')
		    .attr('class', 'bar')
		    // -30 for the spacing between bars
		    .attr('width', barWidth)
		    .attr('y', function (d) { return y(d) })
		    .attr('height', function (d) { return height - y(d) })


	  // Define function to display data on top of each bar
	  var barText = bar.append("g")
	                  .append("text")
	                  .attr("class", "barText")
	                  .attr("fill", "#000")
	                  // for shifting text hortizontally
	                  // different i means to place text in different charts horizontally in different ways 
	                  .attr("x", function(){
	                  	if (i == 0) {
	                  		return 9;
	                  	} else if (i == 1){
	                  		return 12
	                  	} else {
	                  		return 2
	                  	}
	                  })
	                  // for shifting text vertically
	                  .attr("y", function(d) {
	                  	  // d == 0 for USA which would work differently. 170 is the ideal position for the USA's bar text
	                      return d == 0 ? 170 : y(d) + 15;

	                  })
	                  .text(function(d){
	                       return d + "%";
	                  });


		// add Event listeners to tooltips 
		// show tooltip when mouse over
		bar.on("mouseover", function(d) {    
            tooltip.transition()    
                .duration(200)    
                .style("opacity", .9);    
            tooltip.html("Rate: " + "<br/>" + d + "%")
                .style("left", function(){
                	// for smart position of the tooltip: tooltip appears on the left if it's exceeding the screen
                	return d3.event.pageX > (window.innerWidth - 100) ? (d3.event.pageX - 100) + "px" : d3.event.pageX + "px";
                })   
                .style("top", (d3.event.pageY - 28) + "px");  
            })        
            // hide tooltip when mouse out  
        .on("mouseout", function(d) {   
            tooltip.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });
	  	
	}
	
}


// functions for responsiveness
// each time the window is resized, previous chart is cleared and redrawn
var resize = function(){
	//clear and redraw the graph
	d3.selectAll(".svg-container").remove();
	//modify the height
	height = width/window.innerWidth * 240;
	height = height <= 180 ? 180 : height;
	// draw the charts
	generate();

	// Ratios to scale the chart
	var currWidth = window.innerWidth;
	var currRatio = (600/currWidth) * 1.2;
	currRatio = currRatio <= 1 ? 1 : currRatio;

	//function to calculate ratio to scale text
	function ratioScale(d, i, domElement) {
		//only get transform part
   		var currTransform = domElement.getAttribute("transform");
   		// remove previous scale data
   		if (currTransform.indexOf("scale") != -1){
   			currTransform = currTransform.substring(0, currTransform.indexOf("scale"));
   		}
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

	/* ----- for IE and edge to rotate the text on X-axis*/
	if (window.innerWidth <= 500) {
		$(".x text").each(function(){
	        transform = $(this).css('transform');
	        $(this).attr('transform',transform);
	    }); 
	}
}



// generate the bar chart and resize it
resize();
window.onresize = resize;