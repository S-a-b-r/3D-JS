Surfaces.prototype.parabaloid = ( count = 8) => {
    const points = [];
    const polygons =[];
    const edges = [];
    const a = 5;
    const b = 3;
    
    for(let j = - count; j < count; j ++){
        for(let i = - count; i < count; i ++){
            points.push(new Point(j, j * j / a / a - i * i / b / b, i));
        }
    }

    for(let i = 0; i < count * 2; i++){
        for( let j = i * 2 * count; j < 2 *(i + 1)* count - 1; j ++){
            edges.push(new Edge(j, j + 1));
        }
    }
    //ребра по горизонтали
    for(let i = 0; i <= count * 2 - 1; i++){
        let k = 0;
        let j = i;
        while(k < 2 * count - 1){
            edges.push(new Edge(j, j + 2 * count));
            j+= 2 * count;
            k++;
        }
    }

//polygons
    for(let i = 0; i < count * 2 - 1; i++){
        let k = 0;
        let j = i;
        while(k < 2 * count - 1){
            polygons.push(new Polygon([j, j + 2 * count, j + 2 * count + 1, j + 1], '#50CAFF'));
            j+= 2 * count;
            k++;
        }
    }
    return new Subject(points, edges, polygons);
}