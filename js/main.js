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
    let canRotate = false;
    let canPrint = {
        points: true,
        edges: true,
        polygons: true
    }

    const sur = new Surfaces;
    const canvas = new Canvas({ width: 600, height: 600, WINDOW, callbacks: { wheel, mousemove, mousedown, mouseup}});
    const graph3D = new Graph3D({ WINDOW });
    const ui = new UI({callbacks:{ move, printPoints, printPolygons, printEdges}});

    const SCENE = [sur.sfera(
                15, 
                20, 
                new Point(6, 0, 6), 
                '#FFFF47',
                { rotateOz: new Point (6,0,6)},
    )]; // сцена

    const LIGHT = new Light(-20, 2, -20, 400);

    // about callbacks
    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_IN : ZOOM_OUT;
        SCENE.forEach(subject => {
            subject.points.forEach(point => graph3D.zoom(delta, point));
            if(subject.animation){
                for(let key in subject.animation){
                    graph3D.zoom(delta,subject.animation[key]);
                }
            }
        });
    }

    function mousedown(){
        canRotate = true;
    };

    function mouseup(){
        canRotate = false;
    };

    function mousemove(event) {
        if(canRotate){
            let alphaX = -0.01 * event.movementX;
            let alphaY = -0.01 * event.movementY;
            SCENE.forEach(subject => {
                subject.points.forEach(point => graph3D.rotateOx(alphaY, point));
                if (subject.animation) {
                    for(let key in subject.animation){
                        graph3D.rotateOx(alphaY, subject.animation[key]);
                    }
                }
            });
            SCENE.forEach(subject => {
                subject.points.forEach(point => graph3D.rotateOy(alphaX, point));
                if (subject.animation) {
                   for(let key in subject.animation){
                        graph3D.rotateOy(alphaX, subject.animation[key]);
                    }
                }
            });
        }
    }
    
    // about render
    function printPoints(value){
        canPrint.points = value;
    }

    function printEdges(value){
        canPrint.edges = value; 
    }

    function printPolygons(value){
        canPrint.polygons = value;
    }

    function move(direction){
        if (direction == 'up' || direction == 'down'){
            const delta = (direction == 'up') ? 0.1 : -0.1;
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOy(delta,point)));
        }
        if (direction == 'left' || direction == 'right'){
            const delta = (direction == 'left') ? -0.1 : 0.1;
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.moveOx(delta,point)));
        }
    }

    function printSubject(subject) {
        // print edges
        if(canPrint.edges){
            for (let i = 0; i < subject.edges.length; i++) {
                const edges = subject.edges[i];
                const point1 = subject.points[edges.p1];
                const point2 = subject.points[edges.p2];
                canvas.line(graph3D.xs(point1), graph3D.ys(point1), graph3D.xs(point2), graph3D.ys(point2));
            }
        }
        // print points
        if(canPrint.points){
            for (let i = 0; i < subject.points.length; i++) {
                const points = subject.points[i];
                canvas.point(graph3D.xs(points), graph3D.ys(points));
            }
        }
    }

    function printAllPolygons(){
        if(canPrint.polygons){

            const polygons = [];
            SCENE.forEach(subject =>{
                //graph3D.calcGorner(subject, WINDOW.CAMERA);

                graph3D.calcDistance(subject, WINDOW.CAMERA,'distance');
                graph3D.calcDistance(subject, LIGHT ,'lumen');

                for (let i = 0; i < subject.polygons.length; i++){
                    if(subject.polygons[i].visible){
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

                        let {r, g, b} = polygon.hexToRgb(polygon.color);
                        const lumen = graph3D.calcIllummination(polygon.lumen, LIGHT.lumen);
                        r = Math.round(r * lumen);
                        g = Math.round(g * lumen);
                        b = Math.round(b * lumen);
                        polygons.push({
                            points:[point1, point2, point3, point4],
                            color: polygon.rgbToHex(r, g, b),
                            distance: polygon.distance,
                        });
                    } 
                }
            });
            polygons.sort((a, b) => b.distance - a.distance);
            polygons.forEach(polygon => canvas.polygon(polygon.points, polygon.color));
        }
    }
        

    function render() {
        canvas.clear();
        printAllPolygons();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(-10,9,FPSout);
    }

    function animation(){
        //Закрутим фигуру
        SCENE.forEach(subject =>{
            if(subject.animation){
                for(let key in subject.animation){
                    //Переместить объект в центр координат;
                    const {x, y, z} = subject.animation[key];
                    const xn = WINDOW.CENTER.x - x;
                    const yn = WINDOW.CENTER.y - y;
                    const zn = WINDOW.CENTER.z - z;
                    subject.points.forEach(point => graph3D.move(xn, yn, zn, point));

                    //Вращаем объект
                    const alpha = Math.PI / 180;
                    subject.points.forEach(point => graph3D[key](alpha, point));

                    //Перемещаем объект обратно
                    subject.points.forEach(point => graph3D.move(-xn, -yn, -zn, point));
                }
            }
            
        });
    }

    setInterval(animation, 10);

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