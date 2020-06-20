//Доделан
Surfaces.prototype.cone = (R = 10, count = 20, point = new Point(0, 0, 0), color = '#FFFF47') => {
	const points = [];
	const edges = [];
    const polygons = [];
    const a = 0.1;
    const b = 0.2;
    const da = 2 * Math.PI / count;
    //точки
    for(let i = 0; i <= 2 * Math.PI; i += da){
        for(let j = - count; j <= count; j+=2){
            const x = point.x + R * a * j * Math.sin(i);
            const y = point.y + R * b * j;
            const z = point.z + R * a * j * Math.cos(i);
            points.push(new Point(x, y, z));
        }
	}

    //ребра
    for(let i = 0; i < points.length; i++){
        if( (i  < points.length - 1) && ((i + 1) % (count + 1)  !=  0)){
            edges.push(new Edge( i, i + 1));
        }

        if( i + count < points.length -1){
            edges.push(new Edge(i ,i + count + 1));
        }
    }

    //полигоны
    for(let i = 1 ; i < points.length; i++){
        if(i + count < points.length - 1 && (i + count + 1) % (count + 1) != 0){
            polygons.push(new Polygon([i , i - 1 , i + count , i + count + 1], color));
        }
    }
    //Крышки
    return new Subject(points, edges, polygons);
}