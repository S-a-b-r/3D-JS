class UI{
	constructor({callbacks = {}}){
	this.rotate = (callbacks.rotate instanceof Function ) ? callbacks.rotate: function(){};
	const printPoints = (callbacks.printPoints instanceof Function) ? callbacks.printPoints : function(){};
	const printEdges = (callbacks.printEdges instanceof Function) ? callbacks.printEdges : function(){};
	const printPolygons = (callbacks.printPolygons instanceof Function) ? callbacks.printPolygons : function(){};


	document.addEventListener('keydown', event => this.keyDown(event));
	document.getElementById('pointCheck')
		.addEventListener('click',function(){printPoints( this.checked)});
	document.getElementById('edgesCheck')
		.addEventListener('click',function(){printEdges( this.checked)});
	document.getElementById('polygonCheck')
		.addEventListener('click',function(){printPolygons( this.checked)});
	}
	
	keyDown(event){
		switch(event.keyCode){
			case 37:return this.rotate('left');
			case 38:return this.rotate('up');
			case 39:return this.rotate('right');
			case 40:return this.rotate('down');
		}
	}
}