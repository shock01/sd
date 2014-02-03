function SDZoomable(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.svgSvgElement = null;
    this.currentViewBox = null;
}

SDZoomable.prototype = {

    attach: function(element) {

        if (!(element instanceof SVGSVGElement)) {
            throw 'Hey you, please use an svg element for zoomable!';
        }

        this.svgSvgElement = element;
        var viewBox = element.viewBox.baseVal;

        element.addEventListener('pinch', this, false);
        element.addEventListener('transformstart', this, false);
        element.addEventListener('transformend', this, false);

        Hammer(element);

        this.x = viewBox.x;
        this.y = viewBox.y;
        this.width = viewBox.width || element.width.baseVal.value;
        this.height = viewBox.height || element.height.baseVal.value;

    },

    destroy: function() {
        var element = this.svgSvgElement;
        element.removeEventListener('pinch', this, false);
        element.removeEventListener('transformstart', this, false);
        element.removeEventListener('transformend', this, false);
    },

    prepare: function() {
        this.currentViewBox = {
            x: parseFloat(this.x),
            y: parseFloat(this.y),
            width: parseFloat(this.width),
            height: parseFloat(this.height)
        }
        this.dispatchEvent('zoombegin', this.currentViewBox);
    },

    zoom: function(factor) {

        var width = this.width / factor,
            height = this.height / factor,
            x = parseFloat(this.x),
            y = parseFloat(this.y),
            viewBox;

        if (this.width > this.currentViewBox.width) {
            x = 0;
        } else {
            x = this.x + (this.width - width) / 2;
        }

        if (this.height > this.currentViewBox.height) {
            y = 0;
        } else {
            y = this.y + (this.height - height) / 2
        }

        viewBox = {
            x: x,
            y: y,
            width: width,
            height: height
        };

        this.currentViewBox = viewBox;
        return viewBox;
    },

    commit: function() {
        this.x = this.currentViewBox.x;
        this.y = this.currentViewBox.y;
        this.width = this.currentViewBox.width;
        this.height = this.currentViewBox.height;
    },

    handleEvent: function(event) {
        switch (event.type) {
            case 'pinch':
                var scale = event.gesture.scale,
                    viewBox = this.zoom(scale);
                this.dispatchEvent('zoom', viewBox);
                this.svgSvgElement.setAttributeNS(null, 'viewBox', [viewBox.x, viewBox.y, viewBox.width, viewBox.height].join(' '));
                break;
            case 'transformstart':
                this.prepare();
                break;
            case 'transformend':
                this.dispatchEvent('zoomend', this.currentViewBox);
                this.commit();
                break;
            default:
        }
    },

    dispatchEvent: function(eventType, detail) {
        var element = this.svgSvgElement,
            event = element.ownerDocument.createEvent('CustomEvent');
        event.initCustomEvent(eventType, true, true, detail);
        element.dispatchEvent(event);
        return event;
    }
}

angular.module('sd').directive('sdZoomable', ['$log',
    function($log) {
        return {
            compile: function compile(tElement, tAttrs, transclude) {
                var zoomable = new SDZoomable();
                return function postLink(scope, iElement, iAttrs, controller) {

                    zoomable.attach(iElement[0]);

                    scope.$on('$destroy', function() {
                        zoomable.destroy();
                    });

                }
            }
        }
    }
]);
