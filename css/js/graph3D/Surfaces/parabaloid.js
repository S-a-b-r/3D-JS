Surfaces.prototype.parabaloid = ( count = 20) => {
    const points = [];
    const polygons =[];
    const edges = [];
    const size = 20;
    const delta = size / count;
    
    for(let i = 0; i < count; i ++){
        for(let j = 0; j < count; j++){
            const x = i * delta - size / 2;
            const y = j * delta - size / 2;
            const z = (x * x - y * y) / (0.5 * size);
            points.push(new Point(x, y, z)); 
        }       
    }

    for(let i = 0; i < points.length; i++){
        if( i + 1 < points.length && (i + 1) % count != 0){
            edges.push(new Edge(i, i + 1));
        }
        if( i + count < points.length){
            edges.push(new Edge(i, i + count))
        }
    }

    for(let i = 0; i < points.length; i++){
        if(i + 1 + count < points.length && (i + 1) % count != 0){
            polygons.push(new Polygon([i, i+1, i + 1 + count, i + count]));
        }
    }


    return new Subject(points, edges, polygons);
}