sd
==

SVG Directive for angular

# Intro

## Basic support for AngularJS SVG Bindings.
- Supports all camelCases attributes like viewBox
```
<svg sd:view-box="0 0 {{width}} {{height}}"/>
<image sd:xlink-href="{{href}}"/>

```

## Support for xinclude

ng:include does not work on svg elements because the browser does not parse the svg content as svg elements.
HTML5 supposed to be namespace unware. But it isn't. So working on a replacement solution for ng:include

the included svg files can contain normal angular binding stuff like ng-repeat and so on. Just check the index.html for example

- Partial support for xinclude. Work in Progress.
- xpointer, parse and fallback not supported yet.
- only works on svg content

```
<svg>
  <sd:xinclude href="..."/>
</svg>
```

# Installation
- bower install angular bootstrap
- npm install
- run grunt and go to localhost:800 

# Best practices
- Use namespaces!! They don't harm you
```
<svg xmlns="http://www.w3.org/2000/svg" xmlns:sd="uri:whatevermakesyouhappy" xmlns:xlink="http://www.w3.org/1999/xlink">
```

# Not Supported Yet
- viewBox , preserveAspectRatio etc.
- xinclude xpointer,parse attributes

# Hey it's just a quick commit
- Add test cases (angular scenario)
- Add more attributes
- Add documentation 'To Whom It May Concern'