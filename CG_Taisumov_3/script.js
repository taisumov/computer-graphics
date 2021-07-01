var canv = document.getElementById("canvas");
    canv.width = 700;
    canv.height = 700;
    canv.strokeStyle = 'rgba(255,255,255,255)';
    var ctx = canv.getContext('2d');
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.strokeStyle = 'rgba(255,255,255,255)';
    var arrX = [];
    arrX.push(document.getElementById("x1Text"));
    arrX.push(document.getElementById("x2Text"));
    arrX.push(document.getElementById("x3Text"));
    arrX.push(document.getElementById("x4Text"));
    var arrY = [];
    arrY.push(document.getElementById("y1Text"));
    arrY.push(document.getElementById("y2Text"));
    arrY.push(document.getElementById("y3Text"));
    arrY.push(document.getElementById("y4Text"));
    var arrZ = [];
    arrZ.push(document.getElementById("z1Text"));
    arrZ.push(document.getElementById("z2Text"));
    arrZ.push(document.getElementById("z3Text"));
    arrZ.push(document.getElementById("z4Text"));
    xDegreeText1 = document.getElementById("xDegreeText");
    yDegreeText1 = document.getElementById("yDegreeText");
    draw(ctx, arrX, arrY, arrZ, xDegreeText1, yDegreeText1);

    function draw(ctx, arrX, arrY, arrZ, xDegreeText1, yDegreeText1) {
        ctx.clearRect(0, 0, canv.width, canv.height);
        ctx.fillRect(0, 0, canv.width, canv.height);
        let teta = parseInt(xDegreeText1.value);
        let teta1 = parseInt(yDegreeText1.value);
        let points = [[parseInt(arrX[0].value),
                       parseInt(arrY[0].value),
                       parseInt(arrZ[0].value)],
        [parseInt(arrX[1].value), parseInt(arrY[1].value), parseInt(arrZ[1].value)],
        [parseInt(arrX[2].value), parseInt(arrY[2].value), parseInt(arrZ[2].value)],
        [parseInt(arrX[3].value), parseInt(arrY[3].value), parseInt(arrZ[3].value)]];
        let us = [];
        let ws = [];
        us = linspace(0, 1, 11);
        ws = linspace(0, 1, 11);
        let surface_points = [];
        for(let i = 0; i < us.length; i++){
            surface_points.push([]);
            let first_time = true;
            for(let j = 0; j < ws.length; j++){
                let Q = [];
                for(let t = 0; t < 3; t++){
                    Q.push(points[0][t] * (1 - us[i]) * (1 - ws[j]) + points[1][t] * us[i] * (1 - ws[j]));

                    Q[t] += points[2][t] * (1 - us[i]) * ws[j] + points[3][t] * us[i] * ws[j];
                }
                if(!first_time){
                    showLine(Q, surface_points[i][surface_points[i].length - 1]);
                    
                }else{
                    first_time = false;
                }
                surface_points[i].push(Q); 
            }
        }
        for(let j = 0; j < surface_points.length; j++){
            for(let i = 0; i < surface_points.length - 1; i++){
                showLine(surface_points[i][j], surface_points[i+1][j]);  
            }
        }
        ctx.clearRect(0, 0, canv.width, canv.height);
        ctx.fillRect(0, 0, canv.width, canv.height);
        let ort = getOrt(points);
        surface_points = rotate(surface_points, ort, teta, [1, 0, 0]);
        surface_points = rotate(surface_points, ort, teta1, [0, 1, 0]);
        showSurface(surface_points);
    }

    function getRotationMatrix(ort, teta){
        let cos = Math.cos(toRadians(teta));
        let sin = Math.sin(toRadians(teta));
        let x = ort[0];
        let y = ort[1];
        let z = ort[2];

        let matrix = [[cos + (1 - cos) * x**2,
                       (1 - cos) * x * y - sin * z,
                       (1 - cos) * x * z + sin * y],

                      [(1 - cos) * x * y + sin * z,
                       cos + (1 - cos) * y**2,
                       (1 - cos) * y * z - sin * x],

                      [(1 - cos) * z * x - sin * y,
                       (1 - cos) * z * y + sin * x,
                       cos + (1 - cos) * z**2]]
        return matrix;
    }

    function getOrt(base_points){
        let maxi = [];
        let mini = [];
        for(let j = 0; j < 3; j++){
            let maximum = -100000;
            let minimum = 100000;
            for(let i = 0; i < 4; i++){
                if (parseInt(base_points[i][j]) < minimum){
                    minimum = parseInt(base_points[i][j], 10);
                }
                if (parseInt(base_points[i][j]) > maximum){
                    maximum = parseInt(base_points[i][j]);
                } 
            }
            maxi.push(maximum);
            mini.push(minimum);
        }
        let result = [];
        for(let i = 0; i < maxi.length; i++){
            result.push((maxi[i] + mini[i])/2);
        }
        return result;
    }

    function rotate(vector2d, ort, teta, mat)
    {
        let matrix = getRotationMatrix(mat, teta);
        let center = ort;
        let new_vector2d = [];
        for(let i = 0; i < vector2d.length; i++)
        {
            new_vector2d.push([]);
            for(let j = 0; j < vector2d.length; j++){
                let matrixNew = [];
                for(let t = 0; t < center.length; t++){
                    let vvv = vector2d[i][j][t] - center[t];
                    matrixNew.push(vvv); 
                }
                let matrixNewNew = [];
                matrixNewNew[0] = matrix[0][0]*matrixNew[0] + matrix[0][1]*matrixNew[1] + matrix[0][2]*matrixNew[2];
                matrixNewNew[1] = matrix[1][0]*matrixNew[0] + matrix[1][1]*matrixNew[1] + matrix[1][2]*matrixNew[2];
                matrixNewNew[2] = matrix[2][0]*matrixNew[0] + matrix[2][1]*matrixNew[1] + matrix[2][2]*matrixNew[2];
                for(let t = 0; t < 3; t++){
                    matrixNewNew[t] = matrixNewNew[t] + center[t]; 
                }
                new_vector2d[i].push(matrixNewNew);
            }
        }
        console.log(new_vector2d);
        return new_vector2d;
    }

    function transform(point3d){
        let matrix = [(point3d[0] / ((1200-point3d[2])/1000 + 1)), (point3d[1] / ((1200-point3d[2])/1000 + 1))];
        return matrix;
    }

    function showSurface(vector2d){
        for(let i = 0; i < vector2d.length; i++){
            for(let j = 0; j < vector2d.length; j++){
                if(i != vector2d.length - 1){
                    showLine(vector2d[i][j], vector2d[i + 1][j]);
                }
                if(j != vector2d.length - 1){
                    showLine(vector2d[i][j], vector2d[i][j + 1]);
                }
            }
        }
    }

    function showLine(start, end){
        let start_t = transform(start);
        let end_t = transform(end);
        ctx.beginPath();
        ctx.moveTo(start_t[0], start_t[1]);
        ctx.lineTo(end_t[0], end_t[1]);
        ctx.stroke();
        ctx.closePath();

    }

    function linspace(a, b, n) {
        if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);
        if (n < 2) {
            return n === 1 ? [a] : [];
        }
        var i, ret = Array(n);
        n--;
        for (i = n; i >= 0; i--) {
            ret[i] = (i * b + (n - i) * a) / n;
        }
        return ret;
    }

    function toRadians (angle) {
        return angle * (Math.PI / 180);
    }
