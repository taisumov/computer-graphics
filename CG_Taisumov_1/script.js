var canv = document.getElementById("canvas");
            canv.width = 800;
            canv.height = 500;
            canv.strokeStyle = 'rgba(22,22,22,22)';
            var ctx = canv.getContext('2d');
            ctx.fillRect(0, 0, canv.width, canv.height);
            
            var xp = document.getElementById("xpSlider");
            var yp = document.getElementById("ypSlider");
            
            var xc = document.getElementById("xcSlider");
            var yc = document.getElementById("ycSlider");
            
            var r = document.getElementById("rSlider");

            ctx.lineWidth = 2;
            
            
            var xi;
            var yi;
            
            function draw(ctx, xp, yp, xc, yc, r){
                
                ctx.clearRect(0, 0, canv.width, canv.height);
                ctx.fillRect(0, 0, canv.width, canv.height);
                
                xi = ((r.value ** 2 * (xp.value - xc.value) + r.value * (yp.value - yc.value) * ((xp.value - xc.value) ** 2 + (yp.value - yc.value) ** 2 - r.value ** 2) ** 0.5) / ((xp.value - xc.value) ** 2 + (yp.value - yc.value) ** 2)) + 1 * xc.value;
                
                yi = ((r.value ** 2 * (yp.value - yc.value) - r.value * (xp.value - xc.value) * ((xp.value - xc.value) ** 2 + (yp.value - yc.value) ** 2 - r.value ** 2) ** 0.5) / ((xp.value - xc.value) ** 2 + (yp.value - yc.value) ** 2)) + 1 * yc.value;
                
                var t = document.getElementById("text");
                t.innerHTML = xi;
                
                var t = document.getElementById("text1");
                t.innerHTML = yi;
                
                ctx.strokeStyle = 'rgba(255,255,0,0.4)';
                
                ctx.beginPath();
                ctx.arc(xc.value, yc.value, r.value, 0, 2*Math.PI, false);
                ctx.stroke();
                
                ctx.strokeStyle = 'rgba(2,255,255,0.4)';
                
                ctx.beginPath();
                ctx.moveTo(xp.value, yp.value);
                ctx.lineTo(xi, yi);
                ctx.stroke(); 
                ctx.closePath();
            }
