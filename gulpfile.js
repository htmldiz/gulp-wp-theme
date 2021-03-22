const { watch, series, src, dest,parallel } = require('gulp');
const path           = require("path");
const concat         = require('gulp-concat');
const autoprefixer   = require('gulp-autoprefixer');
const sass           = require('gulp-sass');
const del            = require('del');
const fs             = require('fs');
const gulpIf         = require('gulp-if');
const cssnano        = require('gulp-cssnano');
const useref         = require('gulp-useref');
const uglify         = require('gulp-uglify')
const imagemin       = require('gulp-imagemin')
const conf           = require('./config.json');
const webp           = require('gulp-webp');
const jpegRecompress = require('imagemin-jpeg-recompress');
const cache          = require('gulp-cache')
const list_plugins   = require('./list_plugins.js');
const livereload     = require('gulp-livereload');
const imageminSvgo   = require('imagemin-svgo');
const {extendDefaultPlugins} = require('svgo');

const con = {
   'scss'   : './'+conf.dev+'/'+conf.scss+'/',
   'css'    : './'+conf.dev+'/'+conf.css+'/',
   'js'     : './'+conf.dev+'/'+conf.js+'/',
   'images' : './'+conf.dev+'/'+conf.images+'/',
   'fonts'  : './'+conf.dev+'/'+conf.fonts+'/',
    assets  : {
        'path'   : './'+conf.assets,
        'js'     : './'+conf.js+'/',
        'images' : './'+conf.assets+'/'+conf.images+'/',
        'fonts'  : './'+conf.assets+'/'+conf.fonts+'/',
    },
    temp : {
        'path'   : './'+conf.temp,
        'css'    : './'+conf.temp+'/'+conf.css+'/',
        'js'     : './'+conf.temp+'/'+conf.js+'/',
        'images' : './'+conf.temp+'/'+conf.images+'/',
        'fonts'  : './'+conf.temp+'/'+conf.fonts+'/',
    },
};
function convertImageToWebp() {
    return src([con.assets.images + '**/*.{png,jpg,jpeg}', '!webp'])
        .pipe(webp())
        .pipe(dest(con.assets.images + '/webp'))
}
function clean(cb) {
    del.sync(con.assets.path);
    cb();
}
function pluginsScripts(cb) {
    src(list_plugins)
        .pipe(concat('plugins.js'))
        .pipe(dest(con.js));
    cb();
}
function sass_tocss() {
    return src(con.scss + '**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano({zindex: false}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(dest(con.temp.css))
    // cb();
}
function css() {
    return src(con.css + '**/*.css')
        .pipe(cssnano({zindex: false}))
        .pipe(dest(con.temp.css));
    // cb();
}
function fonts() {
    del.sync(con.assets.fonts);
    return src(con.fonts + '**/*.{woff,woff2,ttf,otf,svg}')
        .pipe(dest(con.assets.fonts));
    // cb();
}
async function csstemp(cb) {
    // cb
    let   out_file    = "";
    let   style_out   = "";
    let out_path    = "./style.css";
    try{
        style_out   += fs.readFileSync('./.wptheme', 'utf8');
        for (const confKey in conf) {
            style_out = style_out.replace(new RegExp('@@'+confKey+'@@','g'),conf[confKey]);
        }
    }catch (e){}
    style_out    += "\n";
    try{
        style_out   += fs.readFileSync(con.temp.css+'style.css', 'utf8');
    }catch (e){}
    style_out    += "\n";
    fs.writeFile(out_path, style_out, function (err) {
        if (err) {
            return console.log(err);
        }
    });
    await Promise.resolve('');
    out_path = path.resolve(out_path);
    livereload.reload(out_path);
    cb();
}
function watch_change() {
    livereload.listen(conf.port);
    watch(con.scss+'**/*.scss', series(sass_tocss));
    // watch(con.css+'**/*.css', series(css));
    watch(con.temp.css+'**/*.css', series(csstemp));
    // watch(con.js+'**/*.js', series(javascripttmp));
    watch(con.js+'**/*.js', series(javascript));
    watch(con.images + '**/*.{png,jpg,jpeg,svg}', series(images));
    watch(con.assets.images + '**/*.{png,jpg,jpeg}', series(convertImageToWebp));
    let watcherphp = watch(['**/*.php']);
    watcherphp.on('change', function(path, stats) {
        livereload.reload(path);
    });
}
function javascripttmp(cb) {
    return src(con.js + '**/*.js')
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(dest(con.assets.js))
        .pipe(livereload());
        // .pipe(dest(con.temp.js));
    // cb();
}
function javascript(cb) {
    return src(con.js + '**/*.js')
        .pipe(concat('all.js'))
        .pipe(dest(con.assets.js))
        .pipe(livereload());
    // cb();
}
function php(cb) {
    return src('**/*.php')
        .pipe(livereload());
    // cb();
}

function images(cb) {
    // del.sync(con.assets.images);
    return src(con.images + '**/*.{png,jpg,jpeg,svg}')
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            jpegRecompress({
                loops:4,
                min: 50,
                max: 95,
                quality:'high'
            }),
            imagemin.optipng({optimizationLevel: 7}),
            // imageminSvgo({
            //     plugins: extendDefaultPlugins([
            //         {name: 'removeViewBox', active: false}
            //     ])
            // })
        ])))
        .pipe(dest(con.assets.images));
}
exports.default = series( clean, fonts, images,convertImageToWebp, sass_tocss, csstemp, pluginsScripts, javascript, watch_change );
exports.build = series( clean, fonts, images,convertImageToWebp, sass_tocss, csstemp, pluginsScripts, javascripttmp );