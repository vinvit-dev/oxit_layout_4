var gulp  = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  sourcemaps = require('gulp-sourcemaps'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss      = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  plumber = require('gulp-plumber'),
  replace = require('gulp-replace'),
  newer = require('gulp-newer'),
  browsersync = require('browser-sync'),
  del = require('del');


function server (done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        notify: false,
        port: 3000,
    });
}

function buildCss() {
    return gulp.src("./src/scss/style.scss", { sourcemaps: true})
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(replace(/@img\//g, '../img/'))
        .pipe(postcss([ autoprefixer({ overrideBrowserslist: ['last 3 versions']})]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browsersync.stream())
      }

const fs = require("fs"),
  fonter = require("gulp-fonter"),
  ttf2woff2 = require("gulp-ttf2woff2");

function otfToTtf() {
    return gulp.src("./src/fonts/*.otf", {})
    .pipe(plumber())
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(gulp.dest("./src/fonts/"))
}

function ttfToWoff () {
    return gulp.src("./src/fonts/*.ttf", {})
    .pipe(plumber())
    .pipe(gulp.src("./src/fonts/*.ttf", {}))
    .pipe(ttf2woff2())
    .pipe(gulp.dest("./src/fonts/"))
}

function fontsStyle  () {
    let fontsFile = "./src/scss/fonts.scss";
    fs.readdir("./src/fonts/", function (err, fontsFiles) {
        if(fontsFiles){
            if(!fs.existsSync(fontsFile)) {
                fs.writeFile(fontsFile, '', cb);
                let newFileOnly;
                for(var i = 0; i < fontsFiles.length; i++) {
                    let fontFileName = fontsFiles[i].split('.')[0];
                    if(newFileOnly !== fontFileName) {
                        let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
                        let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
                        if(fontWeight.toLowerCase() === 'thin') {
                            fontWeight = 100;
                        } else if(fontWeight.toLowerCase() === 'extralight') {
                            fontWeight = 200;
                        } else if(fontWeight.toLowerCase() === 'light') {
                            fontWeight = 300;
                        } else if(fontWeight.toLowerCase() === 'medium') {
                            fontWeight = 500;
                        } else if(fontWeight.toLowerCase() === 'semibold') {
                            fontWeight = 600;
                        } else if(fontWeight.toLowerCase() === 'bold') {
                            fontWeight = 700;
                        } else if(fontWeight.toLowerCase() === 'extrabold') {
                            fontWeight = 800;
                        } else if(fontWeight.toLowerCase() === 'black') {
                            fontWeight = 900;
                        } else {
                            fontWeight = 400;
                        }
                        fs.appendFile(fontsFile,
                            `@font-face{
    font-family: ${fontName};
    font-display: swap;
    src: url("../fonts/${fontFileName}.woff2") format("woff2");
    font-weight: ${fontWeight};
    font-style: normal;
} \r\n`, cb);
                            newFileOnly = fontFileName;
                    }
                }
            } else {
                console.log("Delete fonts.scss if you wont to update fonts");
            }
        }
    });

    return gulp.src("./src/");
    function cb() {}
}

function copyFonts () {
    return gulp.src("./src/fonts/*.woff2", {})
    .pipe(gulp.dest("./dist/fonts/"));
}

function html() {
  return gulp.src("./src/*.html")
  .pipe(replace(/@img\//g, './img/'))
  .pipe(gulp.dest("./dist/"))
  .pipe(browsersync.stream());
}

function images () {
    return gulp.src("./src/img/**/*.*", {})
    .pipe(plumber())
    .pipe(gulp.dest("./dist/img/"))
    .pipe(browsersync.stream());
}

function reset() {
  return del("./dist/**", {force: true});
}

function js() {
    return gulp.src("./src/js/**/*.js", {})
    .pipe(gulp.dest("./dist/js/"))
    .pipe(browsersync.stream());
}

function watcher() {
    gulp.watch(['./src/scss/*.scss'], buildCss)
    gulp.watch(['./src/*.html'], html)
    gulp.watch(['./src/img/*.*'], images)
    gulp.watch(['./src/js/*.js'], js)
}


var fonts  = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

var mainTasks = gulp.series(reset, copyFonts, images, html, js ,buildCss);

var dev = gulp.series(mainTasks, gulp.parallel(server, watcher));

gulp.task('default', dev);
gulp.task('fonts', fonts);