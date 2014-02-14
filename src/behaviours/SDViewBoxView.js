/**
 *
 * @constructor
 *
 * @param x
 * @param y
 * @param width
 * @param height
 * @returns
 */
function SDViewBoxView(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.svgSvgElement = null;
    this.currentViewBox = null;
    this.hammer = null;
    this.cardinalPoints = null;
}

SDViewBoxView.prototype = {

    zoomable: true,
    pannable: true,
    zoomOrigin: SDOrigin.CENTER,

    attach: function(element) {

        if (!(element instanceof SVGSVGElement)) {
            throw 'Hey you, please use an svg element for zoomable!';
        }

        this.svgSvgElement = element;
        this.cardinalPoints = new SDCardinalPoints(element);
        this.enablePan(this.pannable);
        this.enableZoom(this.zoomable);

        this.hammer = Hammer(element);
    },

    destroy: function() {
        this.removePanEventListeners();
        this.removeZoomEventListeners();
        this.svgSvgElement = null;
        this.hammer = null;
    },

    prepare: function(pointer) {
        var element = this.svgSvgElement,
            viewBox = element.viewBox.baseVal;

        this.x = parseFloat(viewBox.x);
        this.y = parseFloat(viewBox.y);
        this.width = parseFloat(viewBox.width || element.width.baseVal.value);
        this.height = parseFloat(viewBox.height || element.height.baseVal.value);

        if (pointer) {
            var point = element.createSVGPoint();
            point.x = pointer.pageX;
            point.y = pointer.pageY;
            this.pointer = point.matrixTransform(element.getScreenCTM().inverse());
        } else {
            this.pointer = null;
        }

        this.currentViewBox = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    },

    zoom: function(factor) {
        if (!this.zoomable) {
            return null;
        } else {
            var offset = this.zoomOffset(factor),
                width = this.width / factor,
                height = this.height / factor,
                x = parseFloat(this.x),
                y = parseFloat(this.y),
                viewBox;

            x = this.x - offset.x;
            y = this.x - offset.y;

            viewBox = {
                x: x,
                y: y,
                width: width,
                height: height
            };

            return viewBox;
        }
    },

    pan: function(deltaX, deltaY) {
        if (!this.pannable) {
            return null;
        } else {
            return {
                x: this.currentViewBox.x + deltaX,
                y: this.currentViewBox.y + deltaY,
                width: this.currentViewBox.width,
                height: this.currentViewBox.height
            };
        }
    },

    commit: function() {
        this.x = this.currentViewBox.x;
        this.y = this.currentViewBox.y;
        this.width = this.currentViewBox.width;
        this.height = this.currentViewBox.height;
    },

    draw: function(viewBox) {
        this.svgSvgElement.viewBox.baseVal.x = viewBox.x;
        this.svgSvgElement.viewBox.baseVal.y = viewBox.y;
        this.svgSvgElement.viewBox.baseVal.width = viewBox.width;
        this.svgSvgElement.viewBox.baseVal.height = viewBox.height;
    },

    zoomOffset: function(factor) {
        var zoomOrigin = this.zoomOrigin,
            originalCardinalPoints = this.cardinalPoints.points(this.width, this.height),
            cardinalPoints = this.cardinalPoints.points(this.width / factor, this.height / factor),
            pointer = this.pointer,
            offsetX = 0,
            offsetY = 0;


        switch (zoomOrigin) {
            case SDOrigin.TOP:
                offsetX = cardinalPoints.c.x - originalCardinalPoints.c.x;
                break;
            case SDOrigin.TOPLEFT:
                offsetX = cardinalPoints.w.x - originalCardinalPoints.w.x;
                break;
            case SDOrigin.TOPRIGHT:
                offsetX = cardinalPoints.e.x - originalCardinalPoints.e.x;
                break;
            case SDOrigin.RIGHT:
                offsetX = cardinalPoints.e.x - originalCardinalPoints.e.x;
                offsetY = cardinalPoints.e.y - originalCardinalPoints.e.y;
                break;
            case SDOrigin.BOTTOMRIGHT:
                offsetX = cardinalPoints.e.x - originalCardinalPoints.e.x;
                offsetY = cardinalPoints.s.y - originalCardinalPoints.s.y;
                break;
            case SDOrigin.BOTTOM:
                offsetX = cardinalPoints.c.x - originalCardinalPoints.c.x;
                offsetY = cardinalPoints.s.y - originalCardinalPoints.s.y;
                break;
            case SDOrigin.BOTTOMLEFT:
                offsetX = cardinalPoints.w.x - originalCardinalPoints.w.x;
                offsetY = cardinalPoints.s.y - originalCardinalPoints.s.y;
                break;
            case SDOrigin.LEFT:
                offsetX = cardinalPoints.w.x - originalCardinalPoints.w.x;
                offsetY = cardinalPoints.w.y - originalCardinalPoints.w.y;
                break;
            case SDOrigin.CENTER:
                offsetX = cardinalPoints.c.x - originalCardinalPoints.c.x;
                offsetY = cardinalPoints.c.y - originalCardinalPoints.c.y;
                break;
        }
        return {
            x: offsetX,
            y: offsetY
        }
    },

    enablePan: function(flag) {
        this.pannable = flag;
        if (flag) {
            this.addPanEventListeners();
        } else {
            this.removePanEventListeners();
        }
    },

    enableZoom: function(flag) {
        this.zoomable = flag;
        if (flag) {
            this.addZoomEventListeners();
        } else {
            this.removeZoomEventListeners();
        }
    },

    addPanEventListeners: function() {
        var element = this.svgSvgElement;
        element.addEventListener('drag', this, false);
        element.addEventListener('dragstart', this, false);
        element.addEventListener('dragend', this, false);
    },

    addZoomEventListeners: function() {
        var element = this.svgSvgElement;
        element.addEventListener('pinch', this, false);
        element.addEventListener('transformstart', this, false);
        element.addEventListener('transformend', this, false);
    },

    removePanEventListeners: function() {
        var element = this.svgSvgElement;
        element.removeEventListener('drag', this, false);
        element.removeEventListener('dragstart', this, false);
        element.removeEventListener('dragend', this, false);
    },

    removeZoomEventListeners: function() {
        var element = this.svgSvgElement;
        element.removeEventListener('pinch', this, false);
        element.removeEventListener('transformstart', this, false);
        element.removeEventListener('transformend', this, false);
    },

    handleEvent: function(event) {
        var svg = this.svgSvgElement,
            gesture = event.gesture;

        if (!gesture) {
            return;
        }

        switch (event.type) {
            case 'dragstart':
                this.dispatchEvent('panbegin', viewBox);
                this.prepare(gesture.center);
                break;
            case 'drag':
                var viewBox = this.pan(-gesture.deltaX, -gesture.deltaY);
                this.dispatchEvent('pan', viewBox);
                this.draw(viewBox);
                break;
            case 'dragend':
                this.dispatchEvent('panend', viewBox);
                this.commit();
                break;
            case 'transformstart':
                this.dispatchEvent('zoombegin', this.currentViewBox);
                this.prepare(gesture.center);
                break;
            case 'pinch':
                var viewBox = this.zoom(gesture.scale);
                this.dispatchEvent('zoom', viewBox);
                this.currentViewBox = viewBox;
                this.draw(viewBox);
                break;
            case 'transformend':
                this.dispatchEvent('zoomend', this.currentViewBox);
                this.commit();
                break;
            default:
        }
        gesture.preventDefault();
    },

    dispatchEvent: function(eventType, detail) {
        var element = this.svgSvgElement,
            event = element.ownerDocument.createEvent('CustomEvent');
        event.initCustomEvent(eventType, true, true, detail);
        element.dispatchEvent(event);
        return event;
    }
}
