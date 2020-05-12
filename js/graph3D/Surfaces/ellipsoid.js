Surfaces.prototype.ellipsoid = ( R = 15, count = 30, point = new Point(0, 0, 0), color = '#50FFDE') => {
	const points = [];
	const edges = [];
	const polygons = [];
    const a = 1;
    const b = 1;
    const c = 0.9;

    const da = 2 * Math.PI / count;
    //Точки
    for(let i = 0; i <= Math.PI; i += da){
        for (let j = 0; j < 2* Math.PI; j += da) {
            const x = point.x + R * Math.sin(i) * Math.cos(j) / (a * a);
            const y = point.y + R * Math.sin(i) * Math.sin(j) / (b * b);
            const z = point.z + R * Math.cos(i) / (c * c);
            points.push(new Point(x, y, z));
        }
    }

    //ребра
    for(let i = 0; i < points.length; i++){
        if(i + count < points.length){
            edges.push(new Edge( i, i + count));
        }

        if(i + 1 < points.length && (i + 1) % count != 0){
            edges.push(new Edge(i, i + 1));
        } else if((i + 1) % count == 0){
            edges.push(new Edge(i, i + 1 - count));
        }
    }

    //полигоны
    for(let i = 0; i < points.length; i++){
        if(i + 1 + count < points.length && (i + 1) % count != 0){
            polygons.push(new Polygon([i, i+1, i + 1 + count, i + count], color));
        } else if((i + 1) % count == 0   &&   i + count < points.length){
            polygons.push(new Polygon([i, i + 1 - count, i + 1 , i + count], color));
        }
    }

    return new Subject(points, edges, polygons);
}