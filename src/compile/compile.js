/**
 * A reusuable service that other custom directives
 * can use for rendering custom SVG templates
 */
angular.module('sd').factory('svgCompile', function($compile) {

    var xmlSerializer = new XMLSerializer();

    /**
     * Pass in the template string, element from angular
     * directive, scope and xpointer and the template
     * will be rendered on the provided element
     */
    function buildSvg(template, iElement, scope, xpointer) {
        var element = iElement[0],
            parentNode = element.parentNode,
            tpl = '<svg>' + template + '</svg>',
            wrapper = document.createElement('div'),
            frag = document.createDocumentFragment(),
            xPathWrapper,
            xPathResult,
            nodes = [],
            xml = '',
            node,
            j,
            childNode;
        wrapper.insertAdjacentHTML('afterBegin', tpl);

        if (xpointer) {
            xPathWrapper = document.createElement('div');
            xPathWrapper.insertAdjacentHTML('afterBegin', '<svg/>');
            xPathResult = document.evaluate(xpointer, wrapper, null, XPathResult.ANY_TYPE, null);
            while (xPathResult && (node = xPathResult.iterateNext())) {
                nodes.push(node);
            }
            angular.forEach(nodes, function(node) {
                xml += xmlSerializer.serializeToString(node, 'text/xml');
            });
            xPathWrapper.insertAdjacentHTML('afterBegin', '<svg>' + xml + '</svg>');
            for (j = 0; childNode = xPathWrapper.firstChild.childNodes[j++];) {
                frag.appendChild(childNode);
            }
        } else {
            frag.appendChild(wrapper.firstChild.firstChild);
        }

        element.appendChild(frag);

        $compile(iElement.contents())(scope, function(clonedElement, scope) {
            var frag = document.createDocumentFragment(),
                i,
                ii;
            for (i = 0, ii = clonedElement.length; i < ii; i++) {
                frag.appendChild(clonedElement[i]);
            }
            parentNode.replaceChild(frag, element);
        });

        wrapper = null;
        xPathWrapper = null;
    }

    return {
        build: buildSvg
    }

});
