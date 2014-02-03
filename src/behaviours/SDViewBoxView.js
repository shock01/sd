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
}

SDViewBoxView.prototype = {

    attach: function(element) {

        if (!(element instanceof SVGSVGElement)) {
            throw 'Hey you, please use an svg element for zoomable!';
        }

        this.svgSvgElement = element;


        element.addEventListener('pinch', this, false);
        element.addEventListener('transformstart', this, false);
        element.addEventListener('transformend', this, false);

        element.addEventListener('drag', this, false);
        element.addEventListener('dragstart', this, false);
        element.addEventListener('dragend', this, false);

        Hammer(element);

    },

    destroy: function() {
        var element = this.svgSvgElement;

        element.removeEventListener('pinch', this, false);
        element.removeEventListener('transformstart', this, false);
        element.removeEventListener('transformend', this, false);

        element.removeEventListener('drag', this, false);
        element.removeEventListener('dragstart', this, false);
        element.removeEventListener('dragend', this, false);
    },

    prepare: function() {
        var element = this.svgSvgElement,
            viewBox = element.viewBox.baseVal;

        this.x = parseFloat(viewBox.x);
        this.y = parseFloat(viewBox.y);
        this.width = parseFloat(viewBox.width || element.width.baseVal.value);
        this.height = parseFloat(viewBox.height || element.height.baseVal.value);

        this.currentViewBox = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    },

    zoom: function(factor) {
        var width = this.width / factor,
            height = this.height / factor,
            x = parseFloat(this.x),
            y = parseFloat(this.y),
            viewBox;

        x = this.x - (width - this.width) / 2 //this.x - ((width - this.width) / 2);
        y = this.x - (height - this.height) / 2 //((this.height - height) / 2) * factor//this.y - ((height - this.height) / 2);

        viewBox = {
            x: x,
            y: y,
            width: width,
            height: height
        };

        return viewBox;
    },

    pan: function(deltaX, deltaY) {
        return {
            x: this.currentViewBox.x + deltaX,
            y: this.currentViewBox.y + deltaY,
            width: this.currentViewBox.width,
            height: this.currentViewBox.height
        };
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

    handleEvent: function(event) {
        var gesture = event.gesture;
        switch (event.type) {
            case 'dragstart':
                this.dispatchEvent('panbegin', viewBox);
                this.prepare();
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
                this.prepare();
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
