let path = require("path")
let eclint = require("eclint")
let gulp = require("gulp")
let Promise = require("bluebird")
let _ = require("lodash")
let vile = require("@brentlintner/vile")

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
        reporter: (file, message) =>
          issues.push(vile.issue(
            vile.ERROR,
            path.relative(".", file.path),
            message.replace(LINE_NUMBER, ""),
            { line: eclint_line(message) }
          ))
      }))
      .on("finish", () => resolve(issues))

    stream.resume()
  })

let get_all_files = (config) =>
  new Promise((resolve, reject) => {
    let all_files = []
    let ignore = _.get(config, "ignore", [])
    return vile.promise_each(
      process.cwd(),
      allowed(ignore),
      (filepath) => all_files.push(filepath),
      { read_data: false }
    )
    .then(() => resolve(all_files))
  })

let punish = (config) =>
  get_all_files(config).then(eclint_check)

module.exports = {
  punish: punish
}
