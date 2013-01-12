
# loop

## install

`component install entity/loop`

## example

[here](http://entity.github.com/arkanoid) ([source](https://github.com/entity/arkanoid))

## usage

```js
var loop = require('loop')(1000/60) // init delta time
world.use(loop)
```

The loop emits `update` and `render` events when appropriate.

It uses a fixed timestep.

### update (frame, timeElapsed)

The `update` event is emitted on every timestep. It passes the current `frame` count and `timeElapsed` (the time since the loop started), to the listeners.

### render (alpha)

The `render` event is emitted when we are ready to render or display something. It passes an `alpha` value to the listeners, which is a float 0..1 of the current frame position in time. To utilize this, you would need to interpolate the values of the previous and current position of an object using this value.

The advantages of using this fixed timestep loop is that the render events are decoupled from our game logic steps. Thus you can have a delta time of, say, 1000/5 and the game will still feel and play smoothly as render is called at the frequence of `requestAnimationFrame` and not at the frequence of our timestep.

## licence

MIT