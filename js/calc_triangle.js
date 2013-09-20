// This code is based on: http://stackoverflow.com/questions/9956186/raphael-js-maintain-path-between-two-objects
// This makes the calculation and classifies the triangle statement based on their sides and angles

$(function(){
	Raphael.fn.connect = function(obj1, obj2, attribs) {
		// list of paths each object has
		if (!obj1.connections) obj1.connections = []
		if (!obj2.connections) obj2.connections = []
		// get the bounding box of each object
		var box1 = obj1.getBBox()
		var box2 = obj2.getBBox()
		// create a line/path from object 1 to object 2
		var p = this.path("M" + (box1.x + box1.width / 2) + ","
				+ (box1.y + box1.height / 2) + "L" + (box2.x + box2.width / 2)
				+ "," + (box2.y + box2.height / 2))
		// adjust attributes of the path
		p.attr(attribs)
		// set the start and end element for this path
		p.startElement = obj1;
		p.endElement = obj2;
		// add the path to each of the object
		obj1.connections.push(p)
		obj2.connections.push(p)
		// mark each object as being connected
		obj1.connected = true;
		obj2.connected = true;
		// listen for the Raphael frame event
		eve.on("raphael.drag.*", function(obj) {
			// if the object the frame event is fired on is connected
			if (this.connected) {
				// for each connection on this object
				for ( var c in this.connections) {
					var path = this.connections[c]; // temp path
					var b1 = path.startElement.getBBox(); // get the current
															// location of start
															// element
					var b2 = path.endElement.getBBox();// get the current location
														// of end element
					// move the path to the new locations
					path.attr({
						path : "M " + (b1.x + b1.width / 2) + " "
								+ (b1.y + b1.height / 2) + "L "
								+ (b2.x + b2.width / 2) + " "
								+ (b2.y + b2.height / 2),
						opacity : Math.max(path.startElement.attr('opacity'),
								path.endElement.attr('opacity'))
					});
				}
			}
		});
	}

	// Creates canvas
	var paper = Raphael("canvas1", "100%", "100%");

	// all points together
	var points = {
		x1 : 150,
		y1 : 50,
		x2 : 200,
		y2 : 100,
		x3 : 100,
		y3 : 100
	}

	// fill initial values
	for (p in points){
		$("#" + p).html(points[p]);
	}
	var p1p2 = lineDistance(points.x1,points.y1,points.x2,points.y2);
	var p1p3 = lineDistance(points.x1,points.y1,points.x3,points.y3);
	var p2p3 = lineDistance(points.x2,points.y2,points.x3,points.y3);
	$("#t1").html(p1p2);
	$("#t2").html(p1p3);
	$("#t3").html(p2p3);

	// calc the angles
	calcAngles(points);

	// calc the line length
	calcLineLength(points);

	// create small circle for each polygon point
	var p1 = paper.circle(points.x1, points.y1, 10).attr("fill", "blue");
	var p2 = paper.circle(points.x2, points.y2, 10).attr("fill", "green");
	var p3 = paper.circle(points.x3, points.y3, 10).attr("fill", "yellow");
	// assing ids to circles;
	p1.node.id = "1";
	p2.node.id = "2";
	p3.node.id = "3";

	// make points draggable
	var start = function () {
		this.ox = this.attr("cx");
		this.oy = this.attr("cy");
	},
	move = function (dx, dy) {
		this.attr({cx: this.ox + dx, cy: this.oy + dy});

		var $id = $(this[0]).attr('id');

		$("#x" + $id).html(this.ox + dx);
		$("#y" + $id).html(this.oy + dy);
		
		// get coordenades
		var points = {
			x1 : $("#x1").text(),
			y1 : $("#y1").text(),
			x2 : $("#x2").text(),
			y2 : $("#y2").text(),
			x3 : $("#x3").text(),
			y3 : $("#y3").text()
		}

		// calc the angles
		calcAngles(points);
		// calc the line length
		calcLineLength(points);


	},
	up = function () {

	};
	paper.set(p1,p2,p3).drag(move, start, up);

	// connect adjacent polygon points
	paper.connect(p1,p2,{stroke:"red"});
	paper.connect(p1,p3,{stroke:"red"});
	paper.connect(p2,p3,{stroke:"red"});


	///////////////////
	// MY FUNCTIONS //
	///////////////////

	// calc angle
	function calcAngles(points) {

		x1=points.x1;
		x2=points.x2;
		x3=points.x3;
		y1=points.y1;
		y2=points.y2;
		y3=points.y3;

		a=Math.sqrt((x2-x3)*(x2-x3)+(y2-y3)*(y2-y3));
		b=Math.sqrt((x1-x3)*(x1-x3)+(y1-y3)*(y1-y3));
		c=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));

		anga=Math.acos((b*b+c*c-a*a)/(2*b*c))*180/Math.PI;
		angb=Math.acos((a*a+c*c-b*b)/(2*a*c))*180/Math.PI;
		angc=Math.acos((a*a+b*b-c*c)/(2*b*a))*180/Math.PI;

		anga=parseInt(anga, 10);
		angb=parseInt(angb, 10);
		angc=parseInt(angc, 10);
		// write in DOM
		$("#a1").html(Math.round(100*anga)/100+"\u00B0");
		$("#a2").html(Math.round(100*angb)/100+"\u00B0");
		$("#a3").html(Math.round(100*angc)/100+"\u00B0");

		var porangulos;
		if(anga < 90 && angb < 90 && angc < 90) {
			porangulos = "Triângulo acutângulo";

		} else if(anga > 90 || angb > 90 || angc > 90) {
			porangulos = "Triângulo obtusângulo";

		} else if(anga == 90 || angb == 90 || angc == 90) {
			porangulos = "Triângulo retângulo";

		} else {
			porangulos = "";
		}

		$("#porangulo").html(porangulos);
	}

	// calc line length
	function calcLineLength(points) {
		var p1p2 = lineDistance(points.x1,points.y1,points.x2,points.y2);
		var p1p3 = lineDistance(points.x1,points.y1,points.x3,points.y3);
		var p2p3 = lineDistance(points.x2,points.y2,points.x3,points.y3);
		// write in DOM
		$("#t1").html(p1p2);
		$("#t2").html(p1p3);
		$("#t3").html(p2p3);

		var porlados;
		if( p1p2 === p1p3 && p1p2 === p2p3 && p1p3 === p2p3 ) {
			porlados = "Triângulo Equilátero";

		} else if( p1p2 === p1p3 || p1p2 === p2p3 || p1p3 === p2p3 ) {
			porlados = "Triângulo Isósceles";

		} else if( p1p2 !== p1p3 && p1p2 !== p2p3 && p1p3 !== p2p3 ) {
			porlados = "Triângulo Escaleno";

		} else {
			porlados = "";
		}

		$("#porlados").html(porlados);
	}

	function lineDistance( point1x, point1y, point2x, point2y )	{
		var xs = 0;
		var ys = 0;

		xs = point2x - point1x;
		xs = xs * xs;

		ys = point2y - point1y;
		ys = ys * ys;

		var numberfloat = Math.sqrt( xs + ys );

		return parseInt(numberfloat, 10);
	}
});