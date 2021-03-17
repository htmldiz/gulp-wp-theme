# Gulp 4 Wordpress theme

------------------
### Basic features

* Simple, intuitive, clean code.
* Autoreload on edit code.
* Minify styles and script
* Removed all default wordpress scripts and styles



## Dependencies

* Wordpress
* NodeJS
* Gulp-CLI – installed globally
* Node packages for the following devDependencies:
    * path
    * gulp-concat
    * gulp-sass
    * del
    * fs
    * gulp-if
    * gulp-cssnano
    * gulp-useref
    * gulp-uglify
    * gulp-imagemin
    * gulp-webp
    * imagemin-jpeg-recompress
    * gulp-cache
    * gulp-livereload ( how change port look at Config options -  point 5 )



### Instalation gide

1. Install [NodeJS](https://nodejs.org/).
2. Install [Gulp-CLI](https://gulpjs.com/docs/en/getting-started/quick-start) globally, using your terminal:
```
npm install --global gulp-cli
```
3. install all Node packages
```
npm install
```

### Usage gide

1. Run default watchers, using your terminal:
```
gulp
```
2. To change javascript you need use dev/js/script.js
3. To change styles you need use dev/scss/style.scss ( its fully support scss )
4. Open wordpress site localy

### Configurations

1. Open config.json
2. Change parameter witch you need

#### Parameters
* themename - Theme name ( will rename theme name)
* author - Theme author
* version - Theme version
* description - Theme description
* port - For gulp-livereload watcher (it's for reload page ones js or scss files changed)
* tags - Theme tags
* assets - Theme assets folder name
* temp - Theme temp folder name
* dev - Theme dev folder name
* scss - Theme scss folder name
* css - Theme css folder name
* js - Theme js folder name
* images - Theme images folder name
* fonts - Theme fonts folder name