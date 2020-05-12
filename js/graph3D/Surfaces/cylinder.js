//Доделан
Surfaces.prototype.cylinder = (R = 10, count = 30, height = 20, point = new Point(0, -R/2, 0), color = '#FFFF47') => {
	const points = [];
	const edges = [];
    const polygons = [];
    
    const da = 2 * Math.PI / count;
    //Точки
    for(let i = 0; i <= 2 * Math.PI; i += da){
        for (let j = 0; j < height ; j ++) {
            const x = point.x + R * Math.sin(i) ;
            const y = point.y + j ;
            const z = point.z + R * Math.cos(i);
            points.push(new Point(x, y, z));
        }
	}

    //Ребра
    for(let i = 0; i < points.length; i++){
        //По горизонтали
        if(i + height < points.length){
            edges.push(new Edge( i , i + height));
        }

        if(i < height){
            edges.push(new Edge( i , points.length - height + i));
        }

        //По вертикали
        if(i % height < height - 1 ){
            edges.push(new Edge( i, i + 1));
        }
    }

    //Полигоны
    for(let i = 0; i < points.length; i++){
        if(i + height + 1 < points.length && (i + 1) % height != 0){
            polygons.push(new Polygon([i, i+1, i + height + 1, i + height], color));
        }
        if(i < height-1 && (i + 1) % height != 0){
            polygons.push(new Polygon([ i , points.length - height + i, points.length - height + i + 1, i + 1],color));
        }
    }

    return new Subject(points, edges, polygons);
}