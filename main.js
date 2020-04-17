//requestAnimFrame;
window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(callback){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

window.onload = function () {
    const WINDOW = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20,
        CENTER: new Point(0, 0, -30), // центр окошка, через которое видим мир
        CAMERA: new Point(0, 0, -50) // точка, из которой смотрим на мир
    };
    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;
    let canMove = false;
    const printPoint = document.getElementById('pointCheck');
    const printEdges = document.getElementById('edgesCheck');
    const printPolygon = document.getElementById('polygonCheck');

    const sur = new Surfaces;
    const canvas = new Canvas({ width: 600, height: 600, WINDOW, callbacks: { wheel, mousemove, mousedown, mouseup, keydown}});
    const graph3D = new Graph3D({ WINDOW });

    const SCENE = [sur.cube()]; // сцена

    // about callbacks
    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_IN : ZOOM_OUT;
        SCENE.forEach(subject => subject.points.forEach(point => graph3D.zoom(delta, point)));
    }

    function mousedown(){
        canMove = true;
    };

    function mouseup(){
        canMove = false;
    };

    function mousemove(event) {
        if(canMove){
            let alphaX = -0.01 * event.movementX;
            let alphaY = -0.01 * event.movementY;
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.rotateOx(alphaY, point)));
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.rotateOy(alphaX, point)));
        }
    }
    
    // about render
    function clear() {
        canvas.clear();
    }

    function keydown(event){
        if(event.keyCode == 37){
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOx(-1, point)));
        }
        if(event.keyCode == 38){
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOy(1, point)));
        }
        if(event.keyCode == 39){
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOx(1, point)));
        }
        if(event.keyCode == 40){
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOy(-1, point)));
        }
    }

    function printSubject(subject) {
        //print polygone
        graph3D.calcDistance(subject, WINDOW.CAMERA);
        subject.polygons.sort((a, b) => b.distance - a.distance);
        if(printPolygon.checked){
            for (let i = 0; i < subject.polygons.length; i++){
                const polygon = subject.polygons[i];
                const point1 = {
                    x: graph3D.xs(subject.points[polygon.points[0]]),
                    y: graph3D.ys(subject.points[polygon.points[0]])
                };
                const point2 = {
                    x: graph3D.xs(subject.points[polygon.points[1]]),
                    y: graph3D.ys(subject.points[polygon.points[1]])
                };
                const point3 = {
                    x: graph3D.xs(subject.points[polygon.points[2]]),
                    y: graph3D.ys(subject.points[polygon.points[2]])
                };
                const point4 = {
                    x: graph3D.xs(subject.points[polygon.points[3]]),
                    y: graph3D.ys(subject.points[polygon.points[3]])
                };
                canvas.polygon([point1, point2, point3, point4], polygon.color);
            }
        }
        // print edges
        if(printEdges.checked){
            for (let i = 0; i < subject.edges.length; i++) {
                const edges = subject.edges[i];
                const point1 = subject.points[edges.p1];
                const point2 = subject.points[edges.p2];
                canvas.line(graph3D.xs(point1), graph3D.ys(point1), graph3D.xs(point2), graph3D.ys(point2));
            }
        }

        // print points
        if(printPoint.checked){
            for (let i = 0; i < subject.points.length; i++) {
                const points = subject.points[i];
                canvas.point(graph3D.xs(points), graph3D.ys(points));
            }
        }
    }


    function render() {
        clear();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(-10,9,FPSout);
    }

    let FPS = 0;
    let FPSout = 0;
    let timestamp = (new Date()).getTime();
    (function animloop(){
        FPS++;
        const currentTimestamp = (new Date()).getTime();
        if(currentTimestamp - timestamp >= 1000){
            timestamp = currentTimestamp;
            FPSout = FPS;
            FPS = 0;
        }
        render();
        requestAnimFrame(animloop);
    })();
}; 