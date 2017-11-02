/* Rotations */
function rot(x, y, t)
{
    var tt = Math.atan(y/x);
    var tl = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    if (x < 0) tt += Math.PI;
    return [Math.cos(tt + t) * tl, Math.sin(tt + t) * tl];
}

/* Intersections */
function isect(Ax1, Ay1, Ax2, Ay2, Bx1, By1, Bx2, By2)
{
    var ix, iy;

    /* Both lines are verticals, not intersecting */
    if ((Ax1 == Ax2) && (Bx1 == Bx2))
    {
        return undefined;
    }

    /* First line is vertical */
    if (Ax1 == Ax2)
    {
        var k2 = (By2 - By1) / (Bx2 - Bx1);
        var b2 = By1 - (k2 * Bx1);
        ix = Ax1;
        iy = k2*ix + b2;
    }
    /* Second line is vertical */
    else if (Bx1 == Bx2)
    {
        var k1 = (Ay2 - Ay1) / (Ax2 - Ax1);
        var b1 = Ay1 - (k1 * Ax1);
        ix = Bx1;
        iy = k1*ix + b1;
    }
    else
    {
        /* Calculate line coefficients */
        var k1 = (Ay2 - Ay1) / (Ax2 - Ax1);
        var k2 = (By2 - By1) / (Bx2 - Bx1);

        /* If lines are parallel, they do not intersect */
        if (k1 == k2) return undefined;

        /* Calculate shifts */
        var b1 = Ay1 - (k1 * Ax1);
        var b2 = By1 - (k2 * Bx1);

        /*  Find the intersection point
            y = K1x + B1
            y = K2x + B2
            -->
            x = (y - B2) / K2
            y = (K2B1 - K1B2) / (K2 - K1)
            -->
            x = (y - B1) / K1
            y = (K1B2 - K2B1) / (K1 - K2)
        */
        if (k2 == 0)
        {
            iy = (k1*b2 - k2*b1) / (k1 - k2);
            ix = (iy - b1) / k1;
        }
        else
        {
            iy = (k2*b1 - k1*b2) / (k2 - k1);
            ix = (iy - b2) / k2;
        }
        
    }

    /* Check if point lies in the short ranges */
    if ((ix > Math.max(Ax1, Ax2)) || (ix < Math.min(Ax1, Ax2))
        || (iy > Math.max(Ay1, Ay2)) || (iy < Math.min(Ay1, Ay2))
        || (ix > Math.max(Bx1, Bx2)) || (ix < Math.min(Bx1, Bx2))
        || (iy > Math.max(By1, By2)) || (iy < Math.min(By1, By2)))
    {
        return undefined;
    }

    return [ix, iy];
}

