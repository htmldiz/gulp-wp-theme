const { watch, series, src, dest,parallel } = require('gulp');
const path           = require("path");
const concat         = require('gulp-concat');
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
        .pipe(dest(con.temp.css))
    // cb();
}
function css() {
    return src(con.css + '**/*.css')
        .pipe(cssnano({zindex: false}))
        .pipe(dest(con.temp.css));
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
exports.default = series( clean, sass_tocss, csstemp, pluginsScripts, javascript, watch_change );
exports.build = series( clean, sass_tocss, csstemp, pluginsScripts, javascripttmp );