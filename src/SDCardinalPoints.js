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
    points.nw = point.matrixTransform(matrix);

    point.x += offsetWidth;
    points.n = point.matrixTransform(matrix);

    point.x += offsetWidth;
    points.ne = point.matrixTransform(matrix);

    point.y += offsetHeight;
    points.e = point.matrixTransform(matrix);

    point.y += offsetHeight;
    points.se = point.matrixTransform(matrix);

    point.x -= offsetWidth;
    points.s = point.matrixTransform(matrix);

    point.x -= offsetWidth;
    points.sw = point.matrixTransform(matrix);

    point.y -= offsetHeight;
    points.w = point.matrixTransform(matrix);

    point.x += offsetWidth;
    points.c = point.matrixTransform(matrix);

    return points;

}
