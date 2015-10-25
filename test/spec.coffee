path = require "path"
_ = require "lodash"
sinon_chai = require "./helpers/sinon_chai"
Promise = require "bluebird"
util = require "./helpers/util"
mimus = require "mimus"
sinon = require "sinon"
chai = require "chai"
expect = chai.expect
lib = mimus.require "../lib/index", __dirname, [ "vile" ]
vile = mimus.get lib, "vile"

# TODO
describe "vile-eclint", ->
