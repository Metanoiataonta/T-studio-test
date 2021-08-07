var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    browserSync = require('browser-sync'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    svgSprite = require('gulp-svg-sprite'),
    plumber = require('gulp-plumber'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    spritesmith = require('gulp.spritesmith'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    replace = require('gulp-replace'),
    imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache');

gulp.task('sass', function () {
    return gulp.src('src/css/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(gulp.dest('dist/src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});
gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(gulp.dest('dist'))
});
gulp.task('js', function () {
    return gulp.src(['src/js/main.js', 'src/js/*.js'])
        .pipe(concat('main.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('dist/src/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});
gulp.task('img', function () {
    return gulp.src('src/img/*') // Берем все изображения из app
        .pipe(cache(imagemin({ // С кешированием
            // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })) /**/ )
        .pipe(gulp.dest('dist/src/img')); // Выгружаем на продакшен
});
gulp.task('sprite', async function () {
    var spriteData =
        gulp.src('src/img/sprite/*.png') // путь, откуда берем картинки для спрайта
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss',
            cssFormat: 'scss',
            algorithm: 'binary-tree',
            imgPath: '../img/sprite.png'
        }));

    spriteData.img.pipe(gulp.dest('dist/img/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('src/css/')); // путь, куда сохраняем стили
});
assetsDir = "./";
gulp.task('svgSpriteBuild', function () {
    return gulp.src(assetsDir + 'src/img/sprite/*.svg')
        // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
                $('[opacity]').removeAttr('opacity');
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg",
                    render: {
                        scss: {
                            dest: '../../src/css/_sprite.scss',
                            // template: assetsDir + "js/template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest(assetsDir + 'dist/'));
});
gulp.task('watch', function () {
    gulp.watch('src/css/**/*.scss', gulp.parallel('sass'));
    gulp.watch('index.html', gulp.parallel('html'));
    gulp.watch('src/js/**/*.js', gulp.parallel('js'));
});
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './dist'
        },
        notify: false,
        startPath: "index.html",
        open: false
    });
});

gulp.task('clean', async function () {
    return del.sync('dist')
});

gulp.task('prebuild', async function () {
    var buildCss = gulp.src(['dist/style.scss'])
        .pipe(gulp.dest('dist'))
});


gulp.task('default', gulp.parallel('sprite', 'sass', 'html', 'browser-sync', 'watch', 'js', 'img'));