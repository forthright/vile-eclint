"use strict";

var path = require("path");
var eclint = require("eclint");
var gulp = require("gulp");
var Promise = require("bluebird");
var _ = require("lodash");
var vile = require("@brentlintner/vile");

var LINE_NUMBER = /line\s(\d{1,})\s?:?\s?/;

var eclint_line = function eclint_line(message) {
  var match = message.match(LINE_NUMBER);
  return match && match.length > 1 ? match[1] : undefined;
};

var allowed = function allowed(ignore) {
  return function (file) {
    return !vile.ignored(file, ignore);
  };
};

var eclint_check = function eclint_check(files) {
  return new Promise(function (resolve, reject) {
    var issues = [];
    var stream = gulp.src(files).pipe(eclint.check({
      reporter: function reporter(file, message) {
        var title = message.replace(LINE_NUMBER, "");
        issues.push(vile.issue({
          type: vile.STYL,
          path: path.relative(".", file.path),
          title: title,
          message: title,
          signature: "eclint::" + title,
          where: { start: { line: eclint_line(message) } }
        }));
      }
    })).on("finish", function () {
      return resolve(issues);
    });

    stream.resume();
  });
};

var get_all_allowed_files = function get_all_allowed_files(config) {
  return new Promise(function (resolve, reject) {
    // TODO: use a bluebird helper
    var all_files = [];
    return vile.promise_each(process.cwd(), allowed(_.get(config, "ignore", [])), function (filepath) {
      return all_files.push(filepath);
    }, { read_data: false }).then(function () {
      return resolve(all_files);
    });
  });
};

var punish = function punish(config) {
  return get_all_allowed_files(config).then(eclint_check);
};

module.exports = {
  punish: punish
};