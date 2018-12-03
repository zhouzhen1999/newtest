let gulp = require("gulp");
let sass = require("gulp-sass");
let css = require("gulp-clean-css");
let server = require("gulp-webserver");
let path = require("path");
let fs = require("fs");
let url = require("url");
let js = require("gulp-uglify");
let concat = require("gulp-concat");

gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 9090, //配置端口
            open: true, //自动打开浏览器
            middleware: function(req, res, next) { //拦截前端请求
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }


            }
        }))
})

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(concat("all.css"))
        .pipe(css())
        .pipe(gulp.dest('./src/css'));
});


gulp.task("js", function() {
    return gulp.src("./src/js/*.js")
        .pipe(js())
        .pipe(concat("all.js"))
        .pipe(gulp.dest("./src/js"))
})

//监听(不加watch)
gulp.task("watch", function() {
    gulp.watch("./src/scss/*.scss", gulp.series("sass"))
    gulp.watch("./src/js/*.js", gulp.series("js"))
})


gulp.task("default", gulp.series("server", "sass", "js", "watch"))