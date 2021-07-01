var canv = document.getElementById("canvas");
    canv.width = 1000;
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
    arrX.push(document.getElementById("x5Text"));
    arrX.push(document.getElementById("x6Text"));
    arrX.push(document.getElementById("x7Text"));
    var arrY = [];
    arrY.push(document.getElementById("y1Text"));
    arrY.push(document.getElementById("y2Text"));
    arrY.push(document.getElementById("y3Text"));
    arrY.push(document.getElementById("y4Text"));
    arrY.push(document.getElementById("y5Text"));
    arrY.push(document.getElementById("y6Text"));
    arrY.push(document.getElementById("y7Text"));

    degreeText = document.getElementById("degreeText");
    draw(ctx, arrX, arrY, degreeText);

    function draw(ctx, arrX, arrY, degreeText) {
        ctx.clearRect(0, 0, canv.width, canv.height);
        ctx.fillRect(0, 0, canv.width, canv.height);

        let k = parseInt(degreeText.value, 10);

        let x = [];
        x[0] = parseInt(arrX[0].value, 10);
        x[1] = parseInt(arrX[1].value, 10);
        x[2] = parseInt(arrX[2].value, 10);
        x[3] = parseInt(arrX[3].value, 10);
        x[4] = parseInt(arrX[4].value, 10);
        x[5] = parseInt(arrX[5].value, 10);
        x[6] = parseInt(arrX[6].value, 10);

        let y = [];
        y[0] = parseInt(arrY[0].value, 10);
        y[1] = parseInt(arrY[1].value, 10);
        y[2] = parseInt(arrY[2].value, 10);
        y[3] = parseInt(arrY[3].value, 10);
        y[4] = parseInt(arrY[4].value, 10);
        y[5] = parseInt(arrY[5].value, 10);
        y[6] = parseInt(arrY[6].value, 10);

        let t = make_knot_vector(k, x.length);
        let xx = [];
        xx = linspace(100, 600, 300);

        let xt_p = 0,
            yt_p = 0;

        for (let i = 0; i < xx.length; i++) {
            let xt = 0,
                yt = 0;
            for (let j = 0; j < x.length; j++) {
                xt += (x[j] * B(xx[i], k, j, t));
                yt += (y[j] * B(xx[i], k, j, t));
                if (i == 0) {
                    ctx.beginPath();
                    ctx.arc(x[j], y[j], 3, 0, 2 * Math.PI, false);
                    ctx.stroke();
                }
            }
            if ((xt + yt) != 0 && i > 0) {
                ctx.beginPath();
                ctx.moveTo(xt_p, yt_p);

                ctx.lineTo(xt, yt);
                ctx.stroke();
                ctx.closePath();
            }
            xt_p = xt;
            yt_p = yt;
        }
    }


    function B(x, k, i, t) {

        let c1 = 0.0;
        let c2 = 0.0;

        if (k == 0) {

            if (t[i] <= x && x < t[i + 1]) {
                return 1.0;
            } else {
                return 0.0;
            }
        }

        if (t[i + k] == t[i]) {
            c1 = 0.0;
        } else {
            c1 = (x - t[i]) / (t[i + k] - t[i]) * B(x, k - 1, i, t);
        }

        if (t[i + k + 1] == t[i + 1]) {
            c2 = 0.0;
        } else {
            c2 = (t[i + k + 1] - x) / (t[i + k + 1] - t[i + 1]) * B(x, k - 1, i + 1, t)
        }

        return c1 + c2;
    }

    function make_knot_vector(k, n) {

        let total_knots = (2 + n + k) * 1;
        let outer_knots = (1 + k) * 1;
        let inner_knots = total_knots - 2 * outer_knots;
        console.log(inner_knots, outer_knots, total_knots);
        let knots = [];

        for (let i = 0; i < outer_knots; i++) {
            knots.push(100);
        }
        for (let i = 2; i <= inner_knots + 1; i++) {
            knots.push(100 * i);
        }
        for (let i = 0; i < outer_knots; i++) {
            knots.push((inner_knots + 1) * 100);
        }
        return knots;
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
