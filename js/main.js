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

// build left scatterplot: Petal_Length (y) vs Sepal_Length (x)
function build_left_scatter() {
	d3.csv("data/iris.csv").then((data) => {

		// x-axis scaling
		const MAX_VALUE_X = d3.max(data, (d) => {return parseInt(d.Sepal_Length);})
		const X_SCALE = d3.scaleLinear()
							.domain([0, MAX_VALUE_X + 1])
							.range([0, VIS_HEIGHT]);

		// y-axis scaling
		const MAX_VALUE_Y = d3.max(data, (d) => {return parseInt(d.Petal_Length);})
		const Y_SCALE = d3.scaleLinear()
							.domain([0, MAX_VALUE_Y + 1])
							.range([VIS_HEIGHT, 0]);

		// add x-axis
		FRAME_LEFT.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
					.call(d3.axisBottom(X_SCALE).ticks(8))
						.attr("font-size", "10px")

		// add y-axis
		FRAME_LEFT.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
					.call(d3.axisLeft(Y_SCALE).ticks(16))
						.attr("font-size", "10px");

		// add points for the data
		FRAME_LEFT.selectAll("points")
					.data(data)
					.enter()
					.append("circle")
						.attr("id", (d) => {return d.id;})
						.attr("cx", (d) => {return (MARGINS.left + X_SCALE(d.Sepal_Length));})
						.attr("cy", (d) => {return (MARGINS.top + Y_SCALE(d.Petal_Length));})
						.attr("r", 4)
						.attr("class", (d) => {return "point " + d.Species});
		
	});
};
build_left_scatter();

// middle scatterplot frame
const FRAME_MIDDLE = d3.select("#middle")
						.append("svg")
							.attr("height", FRAME_HEIGHT)
							.attr("width", FRAME_WIDTH)
							.attr("class", "frame");

// build middle scatterplot: Petal_Width (y) vs Sepal_Width (x)
function build_middle_scatter() {
	d3.csv("data/iris.csv").then((data) => {

		// x-axis scaling
		const MAX_VALUE_X = d3.max(data, (d) => {return parseInt(d.Sepal_Width);})
		const X_SCALE = d3.scaleLinear()
							.domain([0, MAX_VALUE_X + 1])
							.range([0, VIS_HEIGHT]);

		// y-axis scaling
		const MAX_VALUE_Y = d3.max(data, (d) => {return parseInt(d.Petal_Width);})
		const Y_SCALE = d3.scaleLinear()
							.domain([0, MAX_VALUE_Y + 1])
							.range([VIS_HEIGHT, 0]);

		// add x-axis
		FRAME_MIDDLE.append("g")
						.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
						.call(d3.axisBottom(X_SCALE).ticks(8))
							.attr("font-size", "10px")

		// add y-axis
		FRAME_MIDDLE.append("g")
						.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
						.call(d3.axisLeft(Y_SCALE).ticks(16))
							.attr("font-size", "10px");

		// add points for the data
		let points2 = FRAME_MIDDLE.selectAll("points")
									.data(data)
									.enter()
									.append("circle")
										.attr("id", (d) => {return d.id;})
										.attr("cx", (d) => {return (MARGINS.left + X_SCALE(d.Sepal_Width));})
										.attr("cy", (d) => {return (MARGINS.top + Y_SCALE(d.Petal_Width));})
										.attr("r", 4)
										.attr("class", (d) => {return "point " + d.Species});

		// brush
		FRAME_MIDDLE.call(d3.brush()
						.extent([[MARGINS.left,MARGINS.top], [FRAME_WIDTH,(FRAME_HEIGHT - MARGINS.bottom)]])
						.on("start brush", highlight_charts));

		//function to highlight points when brushed (should also change the other plots here?)
		function highlight_charts(event) {
		    const selection = event.selection;
		    points2.classed("selected", (d) => isBrushed(selection, (MARGINS.left + X_SCALE(d.Sepal_Width)), (MARGINS.top + Y_SCALE(d.Petal_Width))));
		}

		// returns if a point is in the brush selection
		function isBrushed(brush_coords, cx, cy) {
	    	let x0 = brush_coords[0][0];
	        let x1 = brush_coords[1][0];
	        let y0 = brush_coords[0][1];
	        let y1 = brush_coords[1][1];
	      	return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  		}
		
	});
};
build_middle_scatter();

// right bar chart frame
const FRAME_RIGHT = d3.select("#right")
						.append("svg")
							.attr("height", FRAME_HEIGHT)
							.attr("width", FRAME_WIDTH)
							.attr("class", "frame");

// build bar chart 
// note: doesn't use any data binding, everything is hard coded for this right now
function build_barchart() {
	d3.csv("data/iris.csv").then((data) => {

		const SPECIES = ["virginica", "versicolor", "setosa"];

		// x-axis scaling
		const X_SCALE = d3.scaleBand()
							.domain(SPECIES)
							.range([0, VIS_WIDTH])
							.padding(0.2);

		// y-axis scaling
		const Y_SCALE = d3.scaleLinear()
							.domain([0, 60])
							.range([VIS_HEIGHT, 0]);

		// add x-axis
		FRAME_RIGHT.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
					.call(d3.axisBottom(X_SCALE).ticks())
						.attr("font-size", "10px")

		// add y-axis
		FRAME_RIGHT.append("g")
					.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
					.call(d3.axisLeft(Y_SCALE).ticks(10))
						.attr("font-size", "10px");

		// create bars for each species 
		for (let i = 0; i < SPECIES.length; i++) {
			const SPECIES_NAME = SPECIES[i];
			FRAME_RIGHT.append("rect")
							.attr("x", MARGINS.left + X_SCALE(SPECIES_NAME))
							.attr("y", MARGINS.top + Y_SCALE(50))
							.attr("width", X_SCALE.bandwidth())
							.attr("height", VIS_HEIGHT - Y_SCALE(50))
							.attr("class", SPECIES_NAME);
		}

	});
};
build_barchart();