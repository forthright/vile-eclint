let path = require("path")
let eclint = require("eclint")
let gulp = require("gulp")
let Promise = require("bluebird")
let _ = require("lodash")
let vile = require("@forthright/vile")

const LINE_NUMBER = /line\s(\d{1,})\s?:?\s?/

let eclint_line = (message) => {
  let match = message.match(LINE_NUMBER)
  return match && match.length > 1 ?
    match[1] : undefined
}

let allowed = (ignore) => (file) =>
  !vile.ignored(file, ignore)

let eclint_check = (files) =>
  new Promise((resolve, reject) => {
    let issues = []
    let stream = gulp
      .src(files)
      .pipe(eclint.check({
        reporter: (file, message) => {
          let title, where

          // HACK: look into this later
          if (_.isString(message)) {
            title = message.replace(LINE_NUMBER, "")
            where = { start: { line: eclint_line(message) } }
          } else {
            let line = _.get(message, "lineNumber");
            let col = _.get(message, "columnNumber");
            title = _.get(message, "message", "?")
            where = { start: { line: line, character: col } };
          }

          issues.push(vile.issue({
            type: vile.STYL,
            path: path.relative(".", file.path),
            title: title,
            message: title,
            signature: `eclint::${title}`,
            where: where
          }))
        }
      }))
      .on("finish", () => resolve(issues))

    stream.resume()
  })

let get_all_allowed_files = (config) =>
  new Promise((resolve, reject) => {
    // TODO: use a bluebird helper
    let all_files = []
    return vile.promise_each(
      process.cwd(),
      allowed(_.get(config, "ignore", [])),
      (filepath) => all_files.push(filepath),
      { read_data: false }
    )
    .then(() => resolve(all_files))
  })

let punish = (config) =>
  get_all_allowed_files(config).then(eclint_check)

module.exports = {
  punish: punish
}
