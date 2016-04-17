const gulp = require("gulp");
const mocha = require("gulp-mocha");
const eslint = require("gulp-eslint");

var lintFiles = ["lib/**/*.js", "test/**/*.js", "bin/*", "gulpfile.js", "index.js", "server.js"];
var testFiles = ["lib/**/*.js", "test/**/*.js", "server.js"];

gulp.task("lint", () => {
  return gulp.src(lintFiles)
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format());
});

gulp.task("test", () => {
  return gulp.src("./test/server_test.js")
    .pipe(mocha({
      reporter: "spec"
    }));
});

gulp.task("watch", () => {
  gulp.watch(lintFiles, ["lint"]);
  gulp.watch(testFiles, ["test"]);
});

gulp.task("default", ["lint", "test", "watch"]);
