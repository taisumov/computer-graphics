let _ = undefined;
    let c = document.getElementById('pic');
    let ctx = c.getContext('2d');
    let colors = ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000']
    let prevPointer = [];
    let ctxClicked = false;
    let xRotation = 0,
        yRotation = 0;
    let K = 30;
    class Face {
        constructor(pts) {
            this.center = [];
            this.points = pts.slice();
            for (let i in this.points[0]) {
                this.center[i] = 0;
                for (let j of this.points)
                    this.center[i] += j[i];
                this.center[i] /= this.points.length;
            }
            this.normal = [(this.points[0][1] - this.points[1][1]) * (this.points[2][2] - this.points[1][2]) -
                           (this.points[0][2] - this.points[1][2]) * (this.points[2][1] - this.points[1][1]),

                           (this.points[0][2] - this.points[1][2]) * (this.points[2][0] - this.points[1][0]) -
                           (this.points[0][0] - this.points[1][0]) * (this.points[2][2] - this.points[1][2]),

                           (this.points[0][0] - this.points[1][0]) * (this.points[2][1] - this.points[1][1]) -
                           (this.points[0][1] - this.points[1][1]) * (this.points[2][0] - this.points[1][0])];
        }
        rotate(alpha = undefined, axis = 0, self = false)
            {
                let x, y, z;
                let offset = [];
                if (axis != 0 && alpha != undefined) {
                    alpha = alpha * (Math.PI / 180);
                    if (self)
                    {
                        for (const o in this.center)
                            offset[o] = this.center[o];
                        for (const i in this.points)
                            for (const j in this.points[i])
                                this.points[i][j] -= offset[j];
                        for (const i in this.center) {
                            this.center[i] -= offset[i]
                            this.normal[i] -= offset[i]
                        }
                    }
                    for (const i in this.points) {
                        x = this.points[i][0];
                        y = this.points[i][1];
                        z = this.points[i][2];
                        if (axis == 1) this.points[i] = [x, y * Math.cos(alpha) + z * Math.sin(alpha), -y * Math.sin(alpha) + z * Math.cos(alpha)];
                        else if (axis == 2) this.points[i] = [x * Math.cos(alpha) + z * Math.sin(alpha), y, -x * Math.sin(alpha) + z * Math.cos(alpha)];
                        else if (axis == 3) this.points[i] = [x * Math.cos(alpha) + y * Math.sin(alpha), -x * Math.sin(alpha) + y * Math.cos(alpha), z];
                    }

                    if (axis == 1) {
                        this.normal = [this.normal[0], this.normal[1] * Math.cos(alpha) + this.normal[2] * Math.sin(alpha), -this.normal[1] * Math.sin(alpha) + this.normal[2] * Math.cos(alpha)];
                        this.center = [this.center[0], this.center[1] * Math.cos(alpha) + this.center[2] * Math.sin(alpha), -this.center[1] * Math.sin(alpha) + this.center[2] * Math.cos(alpha)];
                    } else if (axis == 2) {
                        this.normal = [this.normal[0] * Math.cos(alpha) + this.normal[2] * Math.sin(alpha), this.normal[1], -this.normal[0] * Math.sin(alpha) + this.normal[2] * Math.cos(alpha)];
                        this.center = [this.center[0] * Math.cos(alpha) + this.center[2] * Math.sin(alpha), this.center[1], -this.center[0] * Math.sin(alpha) + this.center[2] * Math.cos(alpha)];
                    } else if (axis == 3) {
                        this.normal = [this.normal[0] * Math.cos(alpha) + this.normal[1] * Math.sin(alpha), -this.normal[0] * Math.sin(alpha) + this.normal[1] * Math.cos(alpha), this.normal[2]];
                        this.center = [this.center[0] * Math.cos(alpha) + this.center[1] * Math.sin(alpha), -this.center[0] * Math.sin(alpha) + this.center[1] * Math.cos(alpha), this.center[2]];
                    }
                    if (self) {
                        for (const i in this.points)
                            for (const j in this.points[i])
                                this.points[i][j] += offset[j];
                        for (const i in this.center) {
                            this.center[i] += offset[i]
                            this.normal[i] += offset[i]
                        }
                    }
                }
            }
    }
    let shape = [
        new Face([[-10, -10, -10],
                  [-10, -10, 10],
                  [-10, 10, 10],
                  [-10, 10, -10]]),
        new Face([[10, 10, 10],
                  [10, -10, 10],
                  [10, -10, -10],
                  [10, 10, -10]]),

        new Face([[-10, 10, -10],
                  [10, 10, -10],
                  [10, -10, -10],
                [-10, -10, -10]]),
        new Face([[-10, 10, 10],
                  [10, 10, 10],
                  [10, -10, 10],
                  [-10, -10, 10]]),

        new Face([[-10, 10, -10],
                  [-10, 10, 10],
                  [10, 10, 10],
                  [10, 10, -10]]),
        new Face([[-10, -10, -10],
                  [-10, -10, 10],
                  [10, -10, 10],
                  [10, -10, -10]])];

    checkNormals(shape);
    c.onmousedown = (e) => {
        ctxClicked = true;
        prevPointer = [e.pageX - 8, e.pageY - 8];
    }
    c.onmouseup = (e) => {
        ctxClicked = false;
        prevPointer = [];
    }
    c.onmousemove = (e) => {
        if (ctxClicked) {
            x = e.pageX - 8;
            y = e.pageY - 8;
            if (prevPointer[0] != x || prevPointer[1] != y) {
                xRotation = ((x - prevPointer[0]) * 150) / (Math.PI * 180);
                yRotation = ((y - prevPointer[1]) * 150) / (Math.PI * 180);
                draw(-yRotation, -xRotation);
                prevPointer = [x, y];
            }
        }
    }

    function getProjectionXY(x, y, z, k = K, x_bias = 350, y_bias = 350)
    {
        let scale = 15;
        return [((k * x) / (z + k)) * scale + x_bias, ((k * y) / (z + k)) * scale + y_bias];
    }

    function checkNormals(shp) {
        let testVector = [0, 0, 0];
        let result = 0;
        for (let i in shp) {
            for (let j in shp[i].center)
                testVector[j] += shp[i].center[j];
            for (let j in testVector)
                result += shp[i].normal[j] * (shp[i].center[j] - (testVector[j] / shp.length));
            if (result < 0)
                for (let j in shp[i].normal)
                    shp[i].normal[j] *= -1;
            result = 0;
            testVector = [0, 0, 0];
        }
    }

    function draw(xRotation, yRotation) {
        ctx.clearRect(0, 0, 700, 700);
        for (const i in shape) {
            ctx.beginPath();
            ctx.fillStyle = colors[i];
            shape[i].rotate(xRotation, 1);
            shape[i].rotate(yRotation, 2);
            for (let j in shape[i].points) {
                if (((shape[i].normal[0] * (-shape[i].center[0])) + (shape[i].normal[1] * (-shape[i].center[1])) + (shape[i].normal[2] * (-K - shape[i].center[2]))) > 0)
                    ctx.lineTo(...getProjectionXY(...shape[i].points[j]));
            }
            ctx.closePath();
            ctx.fill();
        }
    }
