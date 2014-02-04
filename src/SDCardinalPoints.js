function SDCardinalPoints(element) {
    this.element = element;
}

SDCardinalPoints.prototype.points = function(width, height, matrix) {
    var svg = this.element instanceof SVGSVGElement ? this.element : this.element.ownerSVGElement,
        point = svg.createSVGPoint(),
        offsetWidth = width / 2,
        offsetHeight = height / 2,
        matrix = typeof matrix !== 'undefined' ? matrix : svg.createSVGMatrix(),
        points = {};

    point.x = 0;
    point.y = 0;
    point = point.matrixTransform(matrix);
    points.nw = {
        x: point.x,
        y: point.y
    };

    point.x += offsetWidth;
    point = point.matrixTransform(matrix);
    points.n = {
        x: point.x,
        y: point.y
    };

    point.x += offsetWidth;
    point = point.matrixTransform(matrix);
    points.ne = {
        x: point.x,
        y: point.y
    };

    point.y += offsetHeight;
    point = point.matrixTransform(matrix);
    points.e = {
        x: point.x,
        y: point.y
    };

    point.y += offsetHeight;
    point = point.matrixTransform(matrix);
    points.se = {
        x: point.x,
        y: point.y
    };

    point.x -= offsetWidth;
    point = point.matrixTransform(matrix);
    points.s = {
        x: point.x,
        y: point.y
    };

    point.x -= offsetWidth;
    point = point.matrixTransform(matrix);
    points.sw = {
        x: point.x,
        y: point.y
    };

    point.y -= offsetHeight;
    point = point.matrixTransform(matrix);
    points.w = {
        x: point.x,
        y: point.y
    };

    point.x += offsetWidth;
    point = point.matrixTransform(matrix);
    points.c = {
        x: point.x,
        y: point.y
    };

    return points;

}
