
/**
 * Module dependencies.
 */

var raf = require('raf')

/**
 * Loop system.
 */

var loop = module.exports = {}

/**
 * Init loop.
 *
 * @api public
 */

loop.init = function () {
  this.dt = 1000/60
  this.maxDiff = this.dt * 5
  this.reset()
}

/**
 * Resets loop.
 *
 * @api private
 */

loop.reset = function () {
  this.running = false
  this.now = 0
  this.before = 0
  this.diff = 0
  this.frame = 0
  this.timeElapsed = 0
  this.accumulator = 0
}

/**
 * Starts loop.
 *
 * @api public
 */

loop.start = function () {
  this.running = true
  // subtracting diff recovers in case of pause
  this.before = Date.now() - this.diff
  this.tick()
}

/**
 * Pauses loop.
 *
 * @api public
 */

loop.pause = function () {
  this.running = false
  this.diff = Date.now() - this.before
}

/**
 * Stops loop.
 * 
 * @api private
 */

loop.stop = function () {
  this.running = false
  this.reset()
}

/**
 * Ticks loop.
 *
 * @return {object} this
 * @api private
 */

loop.tick = function () {
  function tick () {
    if (this.running) raf(tick)

    this.frame++

    this.now = Date.now()
    this.diff = this.now - this.before
    this.before = this.now

    if (this.diff > this.maxDiff) {
      this.diff = 0
    }
    this.add(this.diff)

    while (this.overflow()) {
      this.emit('update', this.frame, this.timeElapsed)
    }
    this.emit('render', this.alpha())
  }

  tick = tick.bind(this)
  tick()
  
  return this
}

/**
 * Adds to loop accumulator and elapsed.
 *
 * @param {number} ms
 * @return {object} this
 * @api private
 */

loop.add = function (ms) {
  this.timeElapsed += ms
  this.accumulator += ms
  return this
}

/**
 * Overflow loop.
 * 
 * @return {boolean} whether this is an underrun
 * @api private
 */

loop.overflow = function () {
  if (this.accumulator >= this.dt) {
    this.accumulator -= this.dt
    return true
  }
  return false
}

/**
 * Calculate alpha. In short, a float of the
 * loop position between this tick and the next.
 * 
 * @return {float} alpha value
 * @api private
 */

loop.alpha = function () {
  return this.accumulator / this.dt
}
