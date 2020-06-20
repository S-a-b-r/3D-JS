//requestAnimFrame;
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   || 
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
        P1: new Point(-10,  10, -30),
        P2: new Point(-10, -10, -30),
        P3: new Point( 10, -10, -30),
        CENTER: new Point(0, 0, -300), // центр окошка, через которое видим мир
        CAMERA: new Point(0, 0, -500) // точка, из которой смотрим на мир
    };
    let canMove = false;
    const ZOOM_IN = 1.1;
    const ZOOM_OUT = 0.9;
    let canPrint = {
        points: false,
        edges: false,
        polygons: true
    }

    const sur = new Surfaces;
    const canvas = new Canvas({ width: 600, height: 600, WINDOW, callbacks: { wheel, mousemove, mousedown, mouseup}});
    const graph3D = new Graph3D({ WINDOW });
    const ui = new UI({callbacks:{ rotate, printPoints, printPolygons, printEdges}});

    //Солнечная система. Год = +-2 сек) 
    const SCENE = [
                sur.sfera( 60, 20, new Point(0, 0, 0), '#f46d11'),//Солнце
                sur.sfera(5, 20, new Point(0, 100, 100), '#9F9F9F',{ rotateOx: new Point(0, 0, 0, 174) }),//Меркурий
                sur.sfera(12.2, 20, new Point(0, -100, 150), '#bf871a',{ rotateOx: new Point(0, 0, 0, 448) }),//Венера
                sur.sfera(12, 20, new Point(0, 300, -210), '#0048D8',{ rotateOx: new Point(0, 0, 0, 720) }),//Земля
                sur.sfera(7, 20, new Point(0, -300, 300), '#ad8763',{ rotateOx: new Point(0, 0, 0, 1312) }),//Марс
                sur.sfera(35, 20, new Point(0, -500, -502), '#7e6b5a',{ rotateOx: new Point(0, 0, 0, 1400) }),//Юпитер
                sur.sfera(30, 20, new Point(0, 700, 700), '#fac45a',{ rotateOx: new Point(0, 0, 0, 1300) }),//Сатурн
                sur.bublik(45,30, new Point(0, 700, 700), '#84614e',{ rotateOx: new Point(0, 0, 0, 1300) }),//Кольца Сатурна
                sur.sfera(13, 20, new Point(0, -890, 890), '#36c0ee',{ rotateOx: new Point(0, 0, 0, 1400) }),//Уран
                sur.sfera(12, 20, new Point(0, 1000, -1000), '#313e9c',{ rotateOx: new Point(0, 0, 0, 1400) }),//Нептун
                   ]; // сцена

    const LIGHT = new Light(0, 0, 100, 10000);

    // about callbacks
    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_IN : ZOOM_OUT;
        graph3D.zoomMatrix(delta);
        SCENE.forEach(subject => {
            subject.points.forEach(point => graph3D.transform(point));
            if (subject.animation) {
                for (let key in subject.animation) {
                    graph3D.transform(subject.animation[key]);
                }
            }
        });    
    }

    function mousedown(){
        canMove = true;
    };
    function mouseup(){
        canMove = false;
    };

    function mousemove(event) {
        if(canMove){
            let alphaX = 0.002 * event.movementY;
            let alphaY = 0.002 * event.movementX;
            graph3D.moveMatrix(alphaX,alphaY,0);
            SCENE.forEach(subject => {
            graph3D.transform(WINDOW.CAMERA);
            graph3D.transform(WINDOW.CENTER);
            graph3D.transform(WINDOW.P1);
            graph3D.transform(WINDOW.P2);
            graph3D.transform(WINDOW.P3);
                if(subject.animation){
                    for(let key in subject.animation){
                        graph3D.transform(subject.animation[key]);
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

    function rotate(direction){
        switch(direction){
            case 'up': graph3D.rotateOyMatrix(-Math.PI/180);break;
            case 'down': graph3D.rotateOyMatrix(Math.PI/180);break;
            case 'left': graph3D.rotateOxMatrix(Math.PI/180);break;
            case 'right': graph3D.rotateOxMatrix(-Math.PI/180);break;
        }
        graph3D.transform(WINDOW.CAMERA);
        graph3D.transform(WINDOW.CENTER);
        graph3D.transform(WINDOW.P1);
        graph3D.transform(WINDOW.P2);
        graph3D.transform(WINDOW.P3);
    }


    function printSubject(subject) {
        // print edges
        if(canPrint.edges){
            for (let i = 0; i < subject.edges.length; i++) {
                const edges = subject.edges[i];
                const point1 = subject.points[edges.p1];
                const point2 = subject.points[edges.p2];
                canvas.line(graph3D.getProection(point1).x, graph3D.getProection(point1).y, graph3D.getProection(point2).x, graph3D.getProection(point2).y);
            }
        }
        // print points
        if(canPrint.points){
            for (let i = 0; i < subject.points.length; i++) {
                const points = subject.points[i];
                canvas.point(graph3D.getProection(points).x, graph3D.getProection(points).y);
            }
        }
    }

    function printAllPolygons(){
        if(canPrint.polygons){
            const polygons = [];

            SCENE.forEach(subject =>{
                graph3D.calcCorner(subject, WINDOW.CAMERA);
                graph3D.calcCenter(subject);
                graph3D.calcDistance(subject, WINDOW.CAMERA,'distance');
                graph3D.calcDistance(subject, LIGHT ,'lumen');
            });
            
            SCENE.forEach(subject =>{
                for (let i = 0; i < subject.polygons.length; i++){
                    if(subject.polygons[i].visible){
                        const polygon = subject.polygons[i];
                        const point1 = graph3D.getProection(subject.points[polygon.points[0]]);
                        const point2 = graph3D.getProection(subject.points[polygon.points[1]]);
                        const point3 = graph3D.getProection(subject.points[polygon.points[2]]);
                        const point4 = graph3D.getProection(subject.points[polygon.points[3]]);
                        let {r, g, b} = polygon.hexToRgb(polygon.color);
                        let {isShadow, dark} = graph3D.calcShadow(polygon,subject, SCENE, LIGHT);
                        let lumen = (isShadow)? dark: graph3D.calcIllummination(polygon.lumen, LIGHT.lumen);
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
        canvas.render();
    }

    function animation(){
        //Закрутим фигуру
        SCENE.forEach(subject =>{
            if(subject.animation){
                for(let key in subject.animation){
                    //Переместить объект в центр координат;
                    const xn = 0 - subject.animation[key].x;
                    const yn = 0 - subject.animation[key].y;
                    const zn = 0 - subject.animation[key].z;

                    const alpha = Math.PI / subject.animation[key].s;
                    graph3D.animateMatrix(xn, yn, zn, key, alpha, -xn, -yn, -zn);
                    subject.points.forEach(point => graph3D.transform(point));            
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
        graph3D.calcPlaneEquation();
        graph3D.calcWindowVectors();
        render();
        requestAnimFrame(animloop);
    })();
}; 