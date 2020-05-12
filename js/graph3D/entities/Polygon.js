class Polygon{
    constructor(points = [], color = '#71DC00') {
        this.points = points;
        this.color = color;
        this.distance = 0;
        this.lumen = 1;
        this.visible = true;
    }

    hexToRgb(hex) {
  		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
		    r: parseInt(result[1], 16),
		    g: parseInt(result[2], 16),
		    b: parseInt(result[3], 16)
		} : null;
	}

    rgbToHex(r, g, b){
        return `rgb(${r},${g},${b}`;
    	//Может выйти красота)
        //return "#" + ((r << 16) + (g << 8) + b).toString(16);
    }
}