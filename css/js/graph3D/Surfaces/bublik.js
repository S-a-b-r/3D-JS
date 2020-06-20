Surfaces.prototype.bublik = (R = 10, count = 10, point = new Point(0, 0, 0), color = '#A5FF50', animation =  null) => {
    const points = [];
    const edges = [];
    const polygons = [];
    function setRoundOfPoints(count, R) {
        const da = 2 * Math.PI / count;
        for (let i = 0; i < 2 * Math.PI; i += da) {
            const x = point.x + R * Math.sin(i);
            const y = point.y;
            const z = point.z + R * Math.cos(i);
            points.push(new Point(x, y, z));
        }
    }

    setRoundOfPoints(count, R);
    setRoundOfPoints(count, R / 1.4);

    for (let i = 0; i < points.length; i++) {
        if (points[i + count]) {
            edges.push(new Edge(i, i + count));
        }
        if (points[i + 1] && i !== count - 1) {
            edges.push(new Edge(i, i + 1));
        }
    }
    edges.push(new Edge(0, count - 1));
    edges.push(new Edge(count, 2*count - 1));

    for(let i = 1; i < count  ; i++){
        polygons.push(new Polygon([i-1,count+i-1, count+i, i], color));
    }
    polygons.push(new Polygon([count,count*2-1,count-1,0], color));

    return new Subject(points, edges, polygons, animation);

}