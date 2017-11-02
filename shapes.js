var Mesh = function(color)
{
    this.points = [];
    this.x = 0;
    this.y = 0;
    this.theta = 0;
    this.solid = true;
    this.color = (color != undefined) ? color : "#eee";

    this.translate = function(x, y)
    {
        this.x += x;
        this.y += y;

        for (var i in this.points)
        {
            this.points[i][0] += x;
            this.points[i][1] += y;
        }
    }

    this.rotate = function(theta)
    {
        this.theta += theta;

        for (var i in this.points)
        {
            var tmp = rot(this.points[i][0], this.points[i][1], theta);
            this.points[i] = tmp;
        }
    }

    this.add_point = function(point)
    {
        var tmp = rot(point[0], point[1], this.theta);
        tmp[0] += this.x;
        tmp[1] += this.y;
        this.points.push(tmp);
    }

    this.colliding = function(mesh)
    {
        var isp = [];

        if ((!this.solid) || (!mesh.solid) || (mesh == this))
        {
            return undefined;
        }

        for (var i = 1; i < this.points.length; i++)
        {
            var p11 = this.points[i-1];
            var p12 = this.points[i];
            for (var j = 1; j < mesh.points.length; j++)
            {
                var p21 = mesh.points[j-1];
                var p22 = mesh.points[j];
                p = isect(p11[0], p11[1], p12[0], p12[1],
                          p21[0], p21[1], p22[0], p22[1]);
                if (p != undefined)
                {
                    isp.push(p);
                }
            }
        }

        return (isp.length == 0) ? undefined : isp;
    }

    this.render = function(canvas)
    {
        var ctx = canvas.getContext("2d");

        if (this.points.length > 0)
        {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.font = "10px courier";
            ctx.moveTo(this.points[0][0], this.points[0][1]);

            for (var i = 1; i < this.points.length; i++)
            {
                ctx.lineTo(this.points[i][0], this.points[i][1]);
            }

            ctx.stroke();
        }
    }
}

var Group = function()
{
    this.meshes = [];
    this.x = 0;
    this.y = 0;
    this.theta = 0;

    this.translate = function(x, y)
    {
        this.x += x;
        this.y += y;

        for (var i in this.meshes)
        {
            this.meshes[i].translate(x, y);
        }
    }

    this.rotate = function(theta)
    {
        this.theta += theta;
        
        for (var i in this.meshes)
        {
            this.meshes[i].rotate(theta);
        }
    }

    this.add_mesh = function(mesh)
    {
        mesh.rotate(this.theta);
        mesh.translate(this.x, this.y);
        this.meshes.push(mesh);
    }

    this.colliding = function(group)
    {
        var isp = [];

        if (this == group)
        {
            return undefined;
        }

        for (var i in this.meshes)
        {
            for (var j in group.meshes)
            {
                var ps = this.meshes[i].colliding(group.meshes[j]);

                if (ps != undefined)
                {
                    isp = isp.concat(ps);
                }
            }
        }

        return (isp.length == 0) ? undefined : isp;
    }

    this.render = function(canvas)
    {   
        for (var i in this.meshes)
        {
            this.meshes[i].render(canvas);
        }
    }
}

var Ray = function(x, y, theta, len)
{
    this.x = x;
    this.y = y;
    this.theta = theta;
    this.max_len = len;

    this.translate = function(x, y)
    {
        this.x += x;
        this.y += y;
    }

    this.rotate = function(theta)
    {
        var temp = rot(this.x, this.y, theta);
        this.x = temp[0];
        this.y = temp[1];
        this.theta += theta;
    }
    
    this.nearest_encounter = function(group)
    {
        var nx = this.x + (this.max_len * Math.cos(this.theta));
        var ny = this.y + (this.max_len * Math.sin(this.theta));
        var nl = null;
        var np = null;

        /* Find nearest intersection */
        var tmp = new Mesh();
        var gtmp = new Group();
        tmp.add_point([this.x, this.y]);
        tmp.add_point([nx, ny]);
        gtmp.add_mesh(tmp);
        var isp = gtmp.colliding(group);

        if (isp == undefined)
        {
            return [nx, ny];
        }

        for (var i in isp)
        {
            var tl = Math.sqrt(Math.pow((isp[i][0] - this.x), 2)
                             + Math.pow((isp[i][1] - this.y), 2));

            if ((nl == null) || (tl < nl))
            {
                nl = tl;
                np = isp[i];
            }
        }

        if (np != null)
        {
            return np;
        }

        return [nx, ny];
    }

    this.get_distance = function(group)
    {
        var p = this.nearest_encounter(group);

        return Math.sqrt(Math.pow(p[0]-this.x, 2)
                       + Math.pow(p[1]-this.y, 2));
    }

    this.render = function(canvas, group)
    {
        var ctx = canvas.getContext("2d");

        var p = this.nearest_encounter(group);
        var d = Math.floor(Math.sqrt(Math.pow(p[0]-this.x, 2)
                                   + Math.pow(p[1]-this.y, 2)));

        ctx.fillStyle = "#f00";
        ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
        ctx.strokeStyle = "#f00";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(p[0], p[1]);
        ctx.stroke();
        ctx.font = "10px arial";
        ctx.fillText(d, (p[0]-this.x)/2+this.x,
                        (p[1]-this.y)/2+this.y);
    }
}
