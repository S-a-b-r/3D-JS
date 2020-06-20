Surfaces.prototype.sfera = ( R = 7,count = 40, point = new Point(0, 0, 0), color = null, animation) => {
    let points = [];
    let edges = [];
    let polygons = [];
    const PI = Math.PI;
    let delta = 2 * PI / count;


    // Расставить точки
    for (let i = 0; i <= PI; i += delta) {
        for (let j = 0; j < 2 * PI; j += delta) {
            const x = point.x + R * Math.sin(i) * Math.cos(j);
            const y = point.y + R * Math.sin(i) * Math.sin(j);
            const z = point.z + R * Math.cos(i);
            points.push(new Point(x, y, z));
        }
    }
    //Провести рёбра
    for (let i = 0; i < points.length; i++) {
        //вдоль
        if ((i + 1) < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1))
        } else if ((i + 1) % count === 0) {
            edges.push(new Edge(i, i + 1 - count));
        }
        //поперёк
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count))
        }
    }
    //Полигоны

    if (color === null) {
        let color = [];
        let r;
        let g;
        let b;
        for (let i = 0; i <= points.length; i++) {
            r = Math.floor(Math.random() * (256));
            g = Math.floor(Math.random() * (256));
            b = Math.floor(Math.random() * (256));
            color[i] = '#' + r.toString(16) + g.toString(16) + b.toString(16);
        }
        for (let i = 0; i < points.length; i++) {
            if ((i + 1 + count) < points.length && (i + 1) % count !== 0) {
                polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color[i]))
            } else if ((i + count) < points.length && (i + 1) % count === 0) {
                polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color[i]))
            }
        }
    } else {
        for (let i = 0; i < points.length; i++) {
            if ((i + 1 + count) < points.length && (i + 1) % count !== 0) {
                polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color))
            } else if ((i + count) < points.length && (i + 1) % count === 0) {
                polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color))
            }
        }
    }
    return new Subject(
        points, edges, polygons, animation);

}