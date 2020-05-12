//Доделан
Surfaces.prototype.parCylinder = (count = 10, point = new Point(0, 0, 0), color = '#FFFF47') => {
	const points = [];
	const edges = [];
    const polygons = [];
    const p = 5;
    
    const da = 2 * Math.PI / count;
    //Точки
    for (let i = -count; i <= count ; i ++) {  
        for (let j = -count; j <= count ; j ++) {
            const x = point.x + i;
            const y = point.y + x * x / 2 / p ;
            const z = point.z + j;
            points.push(new Point(x, y, z));
        }
    }
    //Ребра
    for(let i = 0; i < points.length; i++){
        //По горизонтали
        if(i + 1 < points.length && ((i + 1) % (2 * count + 1) != 0)){
            edges.push(new Edge( i , i + 1));
        }
        
        //По вертикали
        if(2 * count + i + 1 < points.length ){
            edges.push(new Edge( i , 2 * count + i + 1));
        }
    }

    //Полигоны
    for(let i = 0; i < points.length; i++){
        if(i + 2 * count + 2 < points.length && ((i + 1) % (2 * count + 1) != 0)){
            polygons.push(new Polygon([i, i + 1, i + 2 * count + 2, i + 2 * count + 1], color));
        }
    }

    return new Subject(points, edges, polygons);
}