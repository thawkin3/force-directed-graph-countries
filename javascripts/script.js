$(document).ready(function() {

	var url = "javascripts/countries.json";

	// GET THE COUNTRIES JSON DATA, THEN BUILD THE FORCE DIRECTED CHART TO VISUALIZE IT
	d3.json(url, function(error, data) {

		// IF THERE WAS AN ERROR, STOP NOW AND SHOW AN ERROR MESSAGE
		if (error) {
			$(".graphContainer").hide();
			$(".errorMessage").show();
			return error;
		}

		// SET SOME STYLING VARIABLES FOR THE CHART
		var width = 1000;
		var height = 800;

		// VARIABLES FOR FORCE DIRECTED CHART
		var animationStep = 200;
		var nodeRadius = 4;
		var forceCharge = -100;
		var linkDistance = 50;

		// GET EXISTING ELEMENTS FROM THE DOM
		var mainContainer = d3.select(".mainContainer");
		var graphContainer = d3.select(".graphContainer");
		var tooltip = d3.select("#tooltip");
		
		// CREATE A SPACE FOR THE CHART TO BE FORMED
		var svg = graphContainer.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "chart");

		// CREATE THE FORCE LAYOUT
		// SET THE SIZE
		// FEED IT THE NODES AND LINKS DATA FROM THE JSON DATASET
		// SET THE DEFAULT DISTANCE FOR HOW FAR APART THE NODES SHOULD BE
		// ADD IN THE CHARGE FOR HOW THEY REPEL EACH OTHER LIKE ELECTRICAL CHARGES
		var force = d3.layout.force()
			.size([width, height])
			.nodes(data.nodes)
			.links(data.links)
			.linkDistance(linkDistance)
			.charge(forceCharge);

		// CREATE THE LINES TO LINK THE NODES
		var link = svg.selectAll('.link')
			.data(data.links)
			.enter()
			.append('line')
			.attr('class', 'link');

		// CREATE THE NODES FOR THE DATA POINTS
		// SINCE THIS IS INVOLVING COUNTRIES, CREATE A FLAG FOR EACH NODE
		// (OTHERWISE WE WOULD USUALLY DO SOMETHING SIMPLE LIKE A CIRCLE)
		// SET UP THE TOOLTIP SO THAT WHEN YOU HOVER OVER A FLAG YOU CAN SEE THE COUNTRY NAME
		// ALLOW THE NODES TO BE DRAGGED
		var node = graphContainer.select('.flagbox').selectAll('.node')
			.data(data.nodes)
			.enter()
			.append('img')
			.attr('class', d => 'flag flag-' + d.code)
			.on("mouseover", (d) => {
				tooltip.style("display", "block");
				tooltip.html(d.country)
					.style("left", (d3.event.pageX + 5) + "px")
					.style("top", (d3.event.pageY - 30) + "px");
			})
			.on("mouseout", (d) => {
				tooltip.style("display", "none");
			})
			.call(force.drag);

		// WHEN THE NODES ARE DRAGGED, REPOSITION ALL THE OTHER NODES
		// SET THE POSITION FOR THE FLAGS
		// SET THE START AND END COORDINATES FOR ALL OF THE LINES
		force.on('tick', function() {
			node.style('left', d => (d.x - 8) + "px")
				.style('top', d => (d.y - 5) + "px");
			link.attr('x1', d => d.source.x)
				.attr('x2', d => d.target.x)
				.attr('y1', d => d.source.y)
				.attr('y2', d => d.target.y);
		});

		// START THE SIMULATION
		force.start();

	});

});