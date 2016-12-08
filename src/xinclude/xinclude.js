/**
 * xinclude directive.
 * TODO implement full spec: http://www.w3.org/TR/xinclude/
 * TODO polyfill for XPathEvaluator
 */
'use strict';
angular.module('sd').directive('sdXinclude',
    ['$http', '$templateCache', 'svgCompile',
        function ($http, $templateCache, svgCompile) {
            return {
                restrict: 'E',
                compile: function compile(tElement, tAttrs, transclude) {
                    return function postLink(scope, iElement, iAttrs, controller) {
                        var href = iAttrs['href'],
                            xpointer = iAttrs['xpointer'];
                        $http.get(href, {
                            cache: $templateCache
                        }).success(function (response) {
                            svgCompile.build(response, iElement, scope, xpointer);
                        }).error(function (error) {

                        });
                    };
                }
            };
        }]);
