# Brain things

## Dropable

## Transformable -> uses matrix calculations to transform
	- width
	- heigt 
	- matrix
	- origin
	- scaleMode (Scale/Resize)
- CardinalPoints (needs width,height and matrix)
	- n,ne,e,se,s,sw,w,nw,c

- Object
	- cardinalPoints (set on start)
	- currentCardinalPoints (during transformation)

- Have different tools for transforming
```
controls = [
	{
	controlOrigin: Origin.TOP | Origin.LEFT, 
	transformOrigin : Origin.BOTTOM | Origin.RIGHT,
	transformType: TransformType.SCALE,ROTATE,TRANSLATE,
	clip: '',
	clipMode: Cover, Contain
	containment: 0-1,
	autoCorrect: true|false
	}
]
```
- have a directive that listens to Hammer Events and calls API on transformable, recalculates cardinals and rerenders controls

- Use factories for CardinalPoints and Transformable (nice for unit testing)
