(function () {
    // declare the module
    angular.module('sd', []);
    
    // namespaces
    var XMLNS = {
    	  XML: 'http://www.w3.org/XML/1998/namespace',
    	  SVG: 'http://www.w3.org/2000/svg',
    	  XLINK: 'http://www.w3.org/1999/xlink',
    	  XMLNS: 'http://www.w3.org/2000/xmlns/'
    };
    
    // Viewport Attributes
    var viewAttrs = ['viewBox','preserveAspectRatio'];
    
    //Animation event attributes
    var animationAttrs = ['onbegin', 'onend', 'onload', 'onrepeat'];

    // Animation attribute target attributes
    var animationTargetAttrs = ['attributeType', 'attributeName'];

    // Animation timing attributes
    var animationTimerAttrs = ['begin', 'dur', 'end', 'min', 'max', 'restart', 'repeatCount', 'repeatDur', 'fill'];

    // Animation value attributes
    var animationValueAttrs = ['calcMode', 'values', 'keyTimes', 'keySplines', 'from', 'to', 'by'];

    // Animation addition attributes
    var animationAdditionAttrs = ['additive', 'accumulate'];

    // Conditional processing attributes
    var processingAttrs = ['requiredExtensions', 'requiredFeatures', 'systemLanguage'];

    // Core attributes
    var coreAttrs = ['id', 'xml:base', 'xml:lang', 'xml:space'];

    // Document event attributes
    var documentEventAttrs = ['onabort', 'onerror', 'onresize', 'onscroll', 'onunload', 'onzoom'];

    // Filter primitive attributes
    var filterPrimitiveAttrs = ['height', 'result', 'width', 'x', 'y'];

    // Graphical event attributes
    var graphicalEventAttrs = ['onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup'];

    // Presentation attributes
    var presentationAttrs = ['alignment-baseline', 'baseline-shift', 'clip', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering',
        'cursor', 'direction', 'display', 'dominant-baseline', 'enable-background', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'flood-color', 'flood-opacity',
        'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-orientation-horizontal', 'glyph-orientation-vertical',
        'image-rendering', 'kerning', 'letter-spacing', 'lighting-color', 'marker-end', 'marker-mid', 'marker-start', 'mask',
        'opacity', 'overflow', 'pointer-events', 'shape-rendering', 'stop-color', 'stop-opacity', 'stroke', 'stroke-dasharray', 'stroke-dashoffset',
        'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width',
        'text-anchor', 'text-decoration', 'text-rendering', 'unicode-bidi', 'visibility', 'word-spacing', 'writing-mode'
    ];

    // Transfer function attributes
    var transferFunctionAttrs = ['type', 'tableValues', 'slope', 'intercept', 'amplitude', 'exponent', 'offset'];

    // XLink attributes
    var xlinkAttrs = ['xlink:href', 'xlink:type', 'xlink:role', 'xlink:arcrole', 'xlink:title', 'xlink:show', 'xlink:actuate'];

    var PREFIX_REGEXP = /^(x[\:\-_]|data[\:\-_])/i;
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;

    function camelCase(name) {
      return name.
        replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
          return offset ? letter.toUpperCase() : letter;
        }).
        replace(MOZ_HACK_REGEXP, 'Moz$1');
    }

    function attributeToDirectiveName(attrName) {
        return camelCase('sd-' + attrName);
    }

    // event attributes
    angular.forEach([].concat(
    	animationAttrs, 
    	graphicalEventAttrs), function (attrName) {
        var directiveName = attributeToDirectiveName(attrName);
        angular.module('sd').directive(directiveName, function ($parse) {
            return {
                compile: function compile(tElement, tAttrs, transclude) {
                    var fn = $parse(tAttrs[directiveName]);
                    return function postLink(scope, iElement, iAttrs, controller) {
                        var element = iElement[0];
                        element[attrName] = function (event) {
                            scope.$apply(function () {
                                fn(scope, {
                                    event: (event || window.event)
                                });
                            });
                        }
                    }
                }
            }
        });
    });
    // normal attributes
    angular.forEach([].concat(
    	viewAttrs,
    	animationTargetAttrs, 
    	animationTimerAttrs, 
    	animationValueAttrs, 
    	animationAdditionAttrs, 
    	processingAttrs, 
    	coreAttrs, 
    	filterPrimitiveAttrs, 
    	presentationAttrs, 
    	transferFunctionAttrs,
    	xlinkAttrs), function (attrName) {
      
        var directiveName = attributeToDirectiveName(attrName);
        angular.module('sd').directive(directiveName, function () {
          var pair = attrName.split(':'),
              localName = pair.length === 1 ? pair[0] : pair[1],
              prefix = pair.length > 1 ? pair[0] : null;
          
            return function (scope, iElement, iAttrs) {
                var element = iElement[0];
                
                scope.$watch(iAttrs[directiveName], function (value) {
                    if (typeof value !== 'undefined') {
                      	if(prefix) {
                      	 var ns = XMLNS[prefix.toUpperCase()],
                      	 	nsPrefix = element.lookupPrefix(ns);
                      	 console.log(prefix, XMLNS)
                      	 element.setAttributeNS(ns, nsPrefix + ':' + localName, value); 
                      	} else {
                      	  element.setAttributeNS(null, localName, value);
                      	}
                    }
                });
            };
        });
    });
}());