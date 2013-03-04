
/*!
 *
 * Loop system.
 * A fixed timestep loop.
 *
 * MIT
 *
 */

/**
 * Module dependencies.
 */

var raf = require('raf')

/**
 * Exports.
 */

module.exports = Loop

/**
 * Loop system class.
 *
 * @param {Object} opts
 * @api public
 */

function Loop (opts) {
  opts = opts || {}
  this.dt = opts.dt || 1000 / 60
}

/**
 * Resets loop.
 *
 * @api private
 */

Loop.prototype.reset = function () {
  this.running = false
  this.now = 0
  this.before = 0
  this.diff = 0
  this.frame = 0
  this.timeElapsed = 0
  this.accumulator = 0
}

/**
 * Init loop.
 *
 * @api public
 */

Loop.prototype.init = function () {
  this.maxDiff = this.dt * 5
  this.reset()
}

/**
 * Starts loop.
 *
 * @api public
 */

Loop.prototype.start = function () {
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

Loop.prototype.pause = function () {
  this.running = false
  this.diff = Date.now() - this.before
}

/**
 * Stops loop.
 *
 * @api public
 */

Loop.prototype.stop = function () {
  this.running = false
  this.reset()
}

/**
 * Ticks loop.
 *
 * @return {Loop} this
 * @api private
 */

Loop.prototype.tick = function () {
  function tick () {
    if (this.running) raf(tick)
    else return

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
 * @param {Number} ms
 * @return {Loop} this
 * @api private
 */

Loop.prototype.add = function (ms) {
  this.timeElapsed += ms
  this.accumulator += ms
  return this
}

/**
 * Overflow loop.
 *
 * @return {Boolean} is_underrun
 * @api private
 */

Loop.prototype.overflow = function () {
  if (this.accumulator >= this.dt) {
    this.accumulator -= this.dt
    return true
  }
  return false
}

/**
 * Calculate alpha. In short, a float of the
 * loop position between this tick and the next
 * to pass to an interpolate function.
 *
 * @return {Number} alpha
 * @api private
 */

Loop.prototype.alpha = function () {
  return this.accumulator / this.dt
}
