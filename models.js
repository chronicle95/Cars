var Car = function(x, y, theta, col, name)
{
    this.x = x;
    this.y = y;
    this.theta = theta;
    this.speed = 0;
    this.name = name;
    this.color = col;

    this.sens_fl = new Ray(11, -20, -Math.PI*3/4, 150);
    this.sens_fr = new Ray(-11, -20, -Math.PI/4, 150);
    this.sens_sl = new Ray(-11, -5, -Math.PI, 150);
    this.sens_sr = new Ray(11, -5, 0, 150);
    this.mesh = new Mesh(this.color);
    this.group = new Group();

    this.sens_fl.rotate(this.theta);
    this.sens_fl.translate(this.x, this.y);
    this.sens_fr.rotate(this.theta);
    this.sens_fr.translate(this.x, this.y);
    this.sens_sl.rotate(this.theta);
    this.sens_sl.translate(this.x, this.y);
    this.sens_sr.rotate(this.theta);
    this.sens_sr.translate(this.x, this.y);
    this.mesh.add_point([-10, -20]);
    this.mesh.add_point([10, -20]);
    this.mesh.add_point([10, 20]);
    this.mesh.add_point([-10, 20]);
    this.mesh.add_point([-10, -20]);
    this.group.add_mesh(this.mesh);
    this.group.rotate(this.theta);
    this.group.translate(this.x, this.y);

    this.move = function(group)
    {
        if (this.speed == 0) return;
        var p = rot(0, this.speed, this.theta);
        this.group.translate(p[0], p[1]);
        this.sens_fl.translate(p[0], p[1]);
        this.sens_fr.translate(p[0], p[1]);
        this.sens_sl.translate(p[0], p[1]);
        this.sens_sr.translate(p[0], p[1]);
        if (this.group.colliding(group))
        {
            this.group.translate(-p[0], -p[1]);
            this.sens_fl.translate(-p[0], -p[1]);
            this.sens_fr.translate(-p[0], -p[1]);
            this.sens_sl.translate(-p[0], -p[1]);
            this.sens_sr.translate(-p[0], -p[1]);
            return;
        }
        this.x += p[0];
        this.y += p[1];
    }

    this.go_forward = function()
    {
        if (this.speed <= 0)
        {
            this.speed = -2;
        }
        else
        {
            this.speed = 0;
        }
    }

    this.go_backward = function()
    {
        if (this.speed >= 0)
        {
            this.speed = 2;
        }
        else
        {
            this.speed = 0;
        }
    }

    this.go_stop = function()
    {
        this.speed = 0;
    }

    this.rotate = function(theta)
    {
        this.group.translate(-this.x, -this.y);
        this.sens_fl.translate(-this.x, -this.y);
        this.sens_fr.translate(-this.x, -this.y);
        this.sens_sl.translate(-this.x, -this.y);
        this.sens_sr.translate(-this.x, -this.y);

        this.group.rotate(theta);
        this.sens_fl.rotate(theta);
        this.sens_fr.rotate(theta);
        this.sens_sl.rotate(theta);
        this.sens_sr.rotate(theta);

        this.group.translate(this.x, this.y);
        this.sens_fl.translate(this.x, this.y);
        this.sens_fr.translate(this.x, this.y);
        this.sens_sl.translate(this.x, this.y);
        this.sens_sr.translate(this.x, this.y);

        this.theta += theta;
    }

    this.turn_left = function(group)
    {
        this.rotate(-Math.PI/90);
        if (this.group.colliding(group))
        {
            this.rotate(Math.PI/90);
        }
    }

    this.turn_right = function(group)
    {
        this.rotate(Math.PI/90);
        if (this.group.colliding(group))
        {
            this.rotate(-Math.PI/90);
        }
    }
    
    this.render = function(canvas, group)
    {
        this.sens_fl.render(canvas, group);
        this.sens_fr.render(canvas, group);
        this.sens_sl.render(canvas, group);
        this.sens_sr.render(canvas, group);
        this.group.render(canvas);

        var ctx = canvas.getContext("2d");
        ctx.fillStyle = this.color;
        ctx.font = "14px sans";
        ctx.fillText(this.name, this.x, this.y);
    }

    this.update = function(group)
    {
        var dist_fl = this.sens_fl.get_distance(group);
        var dist_fr = this.sens_fr.get_distance(group);
        var dist_sl = this.sens_sl.get_distance(group);
        var dist_sr = this.sens_sr.get_distance(group);

        if ((dist_fl < 40) && (dist_fr < 40))
        {
            this.go_backward();
            this.go_backward();
            if (dist_sl > dist_sr)
            {
                this.turn_left(group);
            }
            else
            {
                this.turn_right(group);
            }
        }
        else
        {
            this.go_forward();
            this.go_forward();
            if (dist_fl > dist_fr)
            {
                this.turn_left(group);
            }
            else
            {
                this.turn_right(group);
            }
        }
    }
}
