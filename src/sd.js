(function() {
    // declare the module
    'use strict';
    angular.module('sd', []);

    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g,

        // Viewport Attributes
        viewAttrs = ['viewBox', 'preserveAspectRatio'],

        // Animation attribute target attributes
        animationTargetAttrs = ['attributeType', 'attributeName'],

        // Animation timing attributes
        animationTimerAttrs = ['repeatCount', 'repeatDur'],

        // Animation value attributes
        animationValueAttrs = ['calcMode', 'keyTimes', 'keySplines'],

        // Conditional processing attributes
        processingAttrs = ['requiredExtensions', 'requiredFeatures', 'systemLanguage'],

        // Core attributes
        coreAttrs = ['xml:base', 'xml:lang', 'xml:space'],

        // Transfer function attributes
        transferFunctionAttrs = ['tableValues'],

        // XLink attributes
        xlinkAttrs = ['xlink:href', 'xlink:type', 'xlink:role', 'xlink:arcrole', 'xlink:title', 'xlink:show', 'xlink:actuate'];


    function camelCase(name) {
        return name.
        replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
    }

    function attributeToDirectiveName(attrName) {
        return camelCase('sd-' + attrName);
    }

    function setAttrValue(element, attrName, value) {
        var pair = attrName.split(':'),
            localName = pair.length === 1 ? pair[0] : pair[1],
            prefix = pair.length > 1 ? pair[0] : null;
        if (prefix) {
            var ns = XMLNS[prefix.toUpperCase()],
                nsPrefix = element.lookupPrefix(ns);
            element.setAttributeNS(ns, nsPrefix + ':' + localName, value);
        } else {
            element.setAttributeNS(null, localName, value);
        }
    }



    angular.forEach([].concat(
        viewAttrs,
        animationTargetAttrs,
        animationTimerAttrs,
        animationValueAttrs,
        processingAttrs,
        coreAttrs,
        transferFunctionAttrs,
        xlinkAttrs), function(attrName) {

        var directiveName = attributeToDirectiveName(attrName);
        angular.module('sd').directive(directiveName, function($interpolate) {
            return {
                compile: function compile(tElement, tAttrs, transclude) {

                    var interpolated = $interpolate(tAttrs[directiveName], true);

                    return function(scope, iElement, iAttrs) {
                        var element = iElement[0],
                            attrValue = iAttrs[directiveName];

                        if (typeof interpolated === 'function') {
                            setAttrValue(element, attrName, interpolated(scope));
                        }

                        scope.$watch(interpolated ? attrName : attrValue, function(value) {
                            if (typeof value !== 'undefined') {
                                setAttrValue(element, attrName, value);
                            }
                        });
                    };
                }
            };
        });
    });
}());
