(function() {
    // declare the module
    'use strict';
    angular.module('sd', []);

    // namespaces
    var XMLNS = {
        XML: 'http://www.w3.org/XML/1998/namespace',
        SVG: 'http://www.w3.org/2000/svg',
        XLINK: 'http://www.w3.org/1999/xlink',
        XMLNS: 'http://www.w3.org/2000/xmlns/',
        XI: 'http://www.w3.org/2001/XInclude'
    },
        SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g,

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

    /**
     * A reusuable service that other custom directives 
     * can use for rendering custom SVG templates
     */
    angular.module('sd').factory('svgBuilder', function( $compile ) {
        
        var xmlSerializer = new XMLSerializer();

        /**
         * Pass in the template string, element from angular
         * directive, scope and xpointer and the template
         * will be rendered on the provided element
         */
        function buildSvg( template, iElement, scope, xpointer  ){
            var element = iElement[0];
            var parentNode = element.parentNode;
            var tpl = '<svg>' + template + '</svg>',
                wrapper = document.createElement('div'),
                xPathWrapper = document.createElement('div'),
                frag = document.createDocumentFragment(),
                xPathResult,
                nodes = [],
                xml = '',
                node;
            wrapper.insertAdjacentHTML('afterBegin', tpl);

            if (xpointer) {
                xPathWrapper.insertAdjacentHTML('afterBegin', '<svg></svg>');
                xPathResult = document.evaluate(xpointer, wrapper, null, XPathResult.ANY_TYPE, null);
                while (xPathResult && (node = xPathResult.iterateNext())) {
                    nodes.push(node);
                }
                angular.forEach(nodes, function(node) {
                    xml += xmlSerializer.serializeToString(node, 'text/xml');
                });
                xPathWrapper.insertAdjacentHTML('afterBegin', '<svg>' + xml + '</svg>');
                for (var j = 0, childNode; childNode = xPathWrapper.firstChild.childNodes[j++];) {
                    frag.appendChild(childNode);
                }
            } else {
                frag.appendChild(wrapper.firstChild.firstChild);
            }

            element.appendChild(frag);

            $compile(iElement.contents())(scope, function(clonedElement, scope) {
                var frag = document.createDocumentFragment();
                for (var i = 0, ii = clonedElement.length; i < ii; i++) {
                    frag.appendChild(clonedElement[i]);
                }
                parentNode.replaceChild(frag, element);
            });

            wrapper = null;
            xPathWrapper = null;
        }

        return {
            build : buildSvg
        }
      
    });

    /**
     * xinclude directive.
     * TODO implement full spec: http://www.w3.org/TR/xinclude/
     * TODO polyfill for XPathEvaluator
     */
    angular.module('sd').directive('sdXinclude', function($http, $templateCache, svgBuilder ) {

        
        return {
            restrict: 'E',
            compile: function compile(tElement, tAttrs, transclude) {

                return function postLink(scope, iElement, iAttrs, controller) {
                    var element = iElement[0],
                        href = iAttrs['href'],
                        xpointer = iAttrs['xpointer'],
                        parentNode = element.parentNode;
                    $http.get(href, {
                        cache: $templateCache
                    }).success(function(response) {
                        svgBuilder.build( response, iElement, scope, xpointer  );
                    }).error(function(error) {

                    });
                };
            }
        };
    });

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
