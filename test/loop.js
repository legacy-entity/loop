require('stagas-watch-js')
var assert = require('component-assert')
var Loop = require('loop')

describe("Loop()", function () {

  describe("when called with new", function () {
    it("should return a Loop object", function () {
      var loop = new Loop()
      assert('object'===typeof loop)
      assert(loop instanceof Loop)
    })
  })

  describe("when called with new and an options object", function () {
    it("should override defaults", function () {
      var loop = new Loop()
      assert(1000/60===loop.dt)
      var loop = new Loop({
        dt: 1000/30
      })
      assert(1000/30===loop.dt)
    })
  })

  describe(".reset()", function () {
    it("should reset all properties to\
        their starting values", function () {
      var loop = new Loop()
      loop.reset()
      assert(false===loop.running)
      assert(0===loop.now)
      assert(0===loop.before)
      assert(0===loop.diff)
      assert(0===loop.frame)
      assert(0===loop.timeElapsed)
      assert(0===loop.accumulator)
    })
  })

  describe(".init()", function () {
    it("should calculate maxDiff\
        based on dt", function () {
      var loop = new Loop()
      loop.init()
      assert(loop.dt*5===loop.maxDiff)
    })

    it("should call reset", function () {
      var loop = new Loop()
      loop.init()
      assert(false===loop.running)
      assert(0===loop.now)
      assert(0===loop.before)
      assert(0===loop.diff)
      assert(0===loop.frame)
      assert(0===loop.timeElapsed)
      assert(0===loop.accumulator)
    })
  })

  describe(".start()", function () {
    it("should start loop", function () {
      var loop = new Loop()
      var i = 0
      loop.emit = function () {
        i++
      }
      loop.init()
      loop.start()
      assert(true===loop.running)
    })

    it("should start ticking", function (done) {
      var loop = new Loop()
      var i = 0
      loop.emit = function () {
        i++
      }
      loop.init()
      loop.start()
      assert(true===loop.running)
      setTimeout(function () {
        assert(loop.now>0)
        assert(loop.frame>0)
        assert(loop.timeElapsed>0)
        assert(i>0)
        done()
      }, 200)
    })
  })

  describe(".pause()", function () {
    it("should pause ticking", function (done) {
      var loop = new Loop()
      var i = 0
      loop.emit = function () {
        i++
      }
      loop.init()
      loop.start()
      assert(true===loop.running)
      setTimeout(function () {
        loop.pause()
        var vals = {
          now: +loop.now
        , frame: +loop.frame
        , timeElapsed: +loop.timeElapsed
        , i: +i
        }
        setTimeout(function () {
          assert(+loop.now===vals.now)
          assert(+loop.frame===vals.frame)
          assert(+loop.timeElapsed===vals.timeElapsed)
          assert(+i===vals.i)
          done()
        }, 150)
      }, 50)
    })
  })

  describe(".stop()", function () {
    it("should stop ticking and reset", function (done) {
      var loop = new Loop()
      var i = 0
      loop.emit = function () {
        i++
      }
      loop.init()
      loop.start()
      assert(true===loop.running)
      setTimeout(function () {
        loop.stop()
        assert(0===+loop.now)
        assert(0===+loop.frame)
        assert(0===+loop.timeElapsed)
        var vals = {
          now: +loop.now
        , frame: +loop.frame
        , timeElapsed: +loop.timeElapsed
        , i: +i
        }
        setTimeout(function () {
          assert(0===+loop.now)
          assert(0===+loop.frame)
          assert(0===+loop.timeElapsed)
          assert(+loop.now===vals.now)
          assert(+loop.frame===vals.frame)
          assert(+loop.timeElapsed===vals.timeElapsed)
          assert(+i===vals.i)
          done()
        }, 150)
      }, 50)
    })
  })
})
