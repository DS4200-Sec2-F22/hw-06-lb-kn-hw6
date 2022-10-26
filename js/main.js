// div size (frame)
const FRAME_HEIGHT = 450;
const FRAME_WIDTH = 450;
const MARGINS = {left: 50, right: 50, top: 20, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;


// left scatterplot frame
const FRAME_LEFT = d3.select("#left")
						.append("svg")
							.attr("height", FRAME_HEIGHT)
							.attr("width", FRAME_WIDTH)
							.attr("class", "frame");

// middle scatterplot frame
const FRAME_MIDDLE = d3.select("#middle")
						.append("svg")
							.attr("height", FRAME_HEIGHT)
							.attr("width", FRAME_WIDTH)
							.attr("class", "frame");

// right bar chart frame
const FRAME_RIGHT = d3.select("#right")
						.append("svg")
							.attr("height", FRAME_HEIGHT)
							.attr("width", FRAME_WIDTH)
							.attr("class", "frame");

// builds literally everything boooooo
function build_plots() {
	d3.csv("data/iris.csv").then((data) => {

	// MIDDLE PLOT
		// x-axis scaling
		const MAX_VALUE_XM = d3.max(data, (d) => {return parseInt(d.Sepal_Width);})
		const X_SCALE_M = d3.scaleLinear()
							.domain([0, MAX_VALUE_XM + 1])
							.range([0, VIS_HEIGHT]);

		// y-axis scaling
		const MAX_VALUE_YM = d3.max(data, (d) => {return parseInt(d.Petal_Width);})
		const Y_SCALE_M = d3.scaleLinear()
							.domain([0, MAX_VALUE_YM + 1])
							.range([VIS_HEIGHT, 0]);

		// add x-axis
		FRAME_MIDDLE.append("g")
						.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
						.call(d3.axisBottom(X_SCALE_M).ticks(8))
							.attr("font-size", "10px")

		// add y-axis
		FRAME_MIDDLE.append("g")
						.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
						.call(d3.axisLeft(Y_SCALE_M).ticks(16))
							.attr("font-size", "10px");

		// add points for the data
		middlePoints = FRAME_MIDDLE.selectAll("points")
						.data(data)
						.enter()
						.append("circle")
							.attr("id", (d) => {return d.id;})
							.attr("cx", (d) => {return (MARGINS.left + X_SCALE_M(d.Sepal_Width));})
							.attr("cy", (d) => {return (MARGINS.top + Y_SCALE_M(d.Petal_Width));})
							.attr("r", 4)
							.attr("class", (d) => {return "point " + d.Species});


	// LEFT PLOT
		// x-axis scaling
		const MAX_VALUE_XL = d3.max(data, (d) => {return parseInt(d.Sepal_Length);})
		const X_SCALE_L = d3.scaleLinear()
							.domain([0, MAX_VALUE_XL + 1])
							.range([0, VIS_HEIGHT]);

		// y-axis scaling
		const MAX_VALUE_YL = d3.max(data, (d) => {return parseInt(d.Petal_Length);})
		const Y_SCALE_L = d3.scaleLinear()
							.domain([0, MAX_VALUE_YL + 1])
							.range([VIS_HEIGHT, 0]);

		// add x-axis
		FRAME_LEFT.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
					.call(d3.axisBottom(X_SCALE_L).ticks(8))
						.attr("font-size", "10px")

		// add y-axis
		FRAME_LEFT.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
					.call(d3.axisLeft(Y_SCALE_L).ticks(16))
						.attr("font-size", "10px");

		// add points for the data
		leftPoints = FRAME_LEFT.selectAll("points")
					.data(data)
					.enter()
					.append("circle")
						.attr("id", (d) => {return d.id;})
						.attr("cx", (d) => {return (MARGINS.left + X_SCALE_L(d.Sepal_Length));})
						.attr("cy", (d) => {return (MARGINS.top + Y_SCALE_L(d.Petal_Length));})
						.attr("r", 4)
						.attr("class", (d) => {return "point " + d.Species});


	// RIGHT PLOT (bar chart)
		const BAR_DATA = [{Species: "virginica", Count:50}, {Species: "versicolor", Count:50}, {Species: "setosa", Count:50}];

		// x-axis scaling
		const X_SCALE_R = d3.scaleBand()
							.domain(d3.range(BAR_DATA.length))
							.range([0, VIS_WIDTH])
							.padding(0.2);

		// y-axis scaling
		const Y_SCALE_R = d3.scaleLinear()
							.domain([0, 60])
							.range([VIS_HEIGHT, 0]);

		// add x-axis
		FRAME_RIGHT.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
					.call(d3.axisBottom(X_SCALE_R).tickFormat((i) => {return BAR_DATA[i].Species}))
						.attr("font-size", "10px")

		// add y-axis
		FRAME_RIGHT.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
					.call(d3.axisLeft(Y_SCALE_R).ticks(10))
						.attr("font-size", "10px");

		// create bars for each species 
		bars = FRAME_RIGHT.selectAll("bars")
							.data(BAR_DATA)
							.enter()
							.append("rect")
								.attr("x", (d,i) => {return MARGINS.left + X_SCALE_R(i)})
								.attr("y", (d) => {return MARGINS.top + Y_SCALE_R(d.Count)})
								.attr("width", X_SCALE_R.bandwidth())
								.attr("height", (d) => {return VIS_HEIGHT - Y_SCALE_R(d.Count)})
								.attr("class", (d) => {return d.Species});


	// BRUSH
		// brush
		FRAME_MIDDLE.call(d3.brush()
						.extent([[MARGINS.left,MARGINS.top], [FRAME_WIDTH,(FRAME_HEIGHT - MARGINS.bottom)]])
						.on("brush end", highlight_charts));


		//function to highlight points when brushed (should also change the other plots here?)
		function highlight_charts(event) {
			// coordinates of the selected region
		    const selection = event.selection;

		    // emppty set to store selected species names
		    let selectedSpecies = new Set();

		    // clears when brush restarts
		    if (selection === null) {
		    	middlePoints.classed('selected', false);
		    	leftPoints.classed('selected', false);
		    } 
		    // gives the border/opacity and gives the species class to the set
		    else {
		    	/*middlePoints.classed("selected", (d) => 
		    		isSelected = isBrushed(selection, (MARGINS.left + X_SCALE_M(d.Sepal_Width)), (MARGINS.top + Y_SCALE_M(d.Petal_Width))));
		    		if (isSelected) { (d) => 
		    			selectedSpecies.add(d.Species);
		    		}
		    		return isSelected;

					console.log(selectedSpecies);*/

				middlePoints.classed("selected", (d) => isBrushed(selection, (MARGINS.left + X_SCALE_M(d.Sepal_Width)), (MARGINS.top + Y_SCALE_M(d.Petal_Width))));
				leftPoints.classed("selected", (d) => isBrushed(selection, (MARGINS.left + X_SCALE_M(d.Sepal_Width)), (MARGINS.top + Y_SCALE_M(d.Petal_Width))));



				console.log(middlePoints.select(".selected"));

				for (var i = 0; i < middlePoints.length; i++) {
					if (middlePoints[i].classed(".selected")) {
						selectedSpecies.add(middlePoints[i].Species)
					}
				}
		    }

		    //console.log(middlePoints.selectAll(".selected"));

			//console.log(selectedSpecies);

		}

		// returns if a point is in the brush selection
		function isBrushed(brush_coords, cx, cy) {
	    	let x0 = brush_coords[0][0];
	        let x1 = brush_coords[1][0];
	        let y0 = brush_coords[0][1];
	        let y1 = brush_coords[1][1];
	      	return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  		}
	})
}
build_plots();

