'use strict';
const gulp = require('gulp');
const clean = require('gulp-clean');
const minifyCSS = require('gulp-clean-css'); // gulp-minify-css;
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const replaceString = require('gulp-replace');
const insert = require('gulp-insert');
const fs = require('fs');
const entorno = require('./config-module.js').config();

require('dotenv').config();
var config = require('./config');
var sourceFolder = 'dist';
var buildDest = process.env.USERPROFILE + process.env.DIRDEST;
//var buildDest = process.env.DIRDEST;
console.log('\x1b[32m%s\x1b[0m', '************************************************************************************************************');
console.log('\x1b[32m%s\x1b[0m', '************************************************************************************************************');
console.log('\x1b[32m%s\x1b[0m', '*****', `MODO: ${process.argv[2]}`);
console.log('\x1b[32m%s\x1b[0m', '*****');
console.log('\x1b[32m%s\x1b[0m', '*****', `RESULTADO EN:`);
console.log('\x1b[32m%s\x1b[0m', '*****', `   ${buildDest}`);
console.log('\x1b[32m%s\x1b[0m', '*****', `Fichero de aplicaciones: ` + entorno.FILEURL);
console.log('\x1b[32m%s\x1b[0m', '*****', `Enviroment: ` + process.env.NODE_ENV);
console.log('\x1b[32m%s\x1b[0m', '************************************************************************************************************');
console.log('\x1b[32m%s\x1b[0m', '************************************************************************************************************\n');

var dependencies = {
    generate: ['delete-all', 'file-qext', 'file-wbl', 'css-minify', 'fonts-devextreme', 'fonts-roboto', 'copy-rename']
};
// Definición de directorios origen
var srcPaths = {
    config: '_configenv',
    root: 'src/',
    images: 'src/assets/img/',
    styles: 'src/styles/',
    fonts: 'src/fonts/',
    lib: 'lib/',
    init: '',
};
// Definición de directorios destino
var distPaths = {
    config: 'src/configApp/',
    images: '/assets/img/',
    styles: '/styles/',
    fonts: '/fonts/',
    lib: 'lib/',
    init: buildDest,
};

/*
*Limpiar carpeta
*/
gulp.task('delete-all', function () {
    return gulp.src(buildDest, { read: false, allowEmpty: true })
        .pipe(clean({ force: true }));
});

//Leemos fichero con ID de aplicaciones
gulp.task('read-env-config', function () {
    return gulp.src([srcPaths.config + '/initConfigGlobal.jsx'])
        .pipe(replaceString('/*ARRAPPS*/', () => {
            const data = fs.readFileSync(entorno.FILEURL, "utf-8");
            return data;
        }))
        .pipe(rename('configGlobal.jsx'))
        .pipe(gulp.dest(distPaths.config));
});





gulp.task('copy-rename', function (done) {
    setTimeout(function() {
        gulp.src('dist/**/*')
        // Copiar la carpeta
        //.pipe(gulp.dest(buildDest))
        // Cambiar el nombre de la carpeta
        // .pipe(through2.obj(function (file, _, cb) {
        //     const newFileName = 'new_folder_name'; // Nuevo nombre de la carpeta
        //     if (file.isDirectory()) {
        //         const oldPath = file.path;
        //         const newPath = oldPath.replace(/[^/]+$/, newFileName);
        //         file.path = newPath;
        //     }
        //     cb(null, file);
        // }))
        // Pegar la carpeta renombrada en la ruta de destino
        .pipe(gulp.dest(buildDest))
        .on('end', done);
    }, 1000);
});
/* 
* Procesamiento de ficheros CSS
*/
var list_css = [
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "node_modules/devextreme/dist/css/dx.light.css",
    // "node_modules/devextreme/dist/css/dx.material.teal.light.compact.css",
    "node_modules/devextreme/dist/css/dx.material.blue.light.compact.css",    
    'src/styles/**/*.css'
]
gulp.task('css-minify', () => {
    return gulp.src(list_css)
        .pipe(concat('application.css'))
        .pipe(minifyCSS({
            compatibility: 'ie8',
            keepSpecialComments: 0,
            rebase: false
        }))
        .pipe(gulp.dest(sourceFolder + distPaths.styles));
});
// Fonts
gulp.task('fonts-devextreme', function () {
    return gulp.src(["node_modules/devextreme/dist/css/icons/*"])
        .pipe(gulp.dest(sourceFolder + distPaths.styles + '/icons'));
});
gulp.task('fonts-roboto', function () {
    return gulp.src(["node_modules/devextreme/dist/css/fonts/*"])
        .pipe(gulp.dest(sourceFolder + distPaths.styles + '/fonts'));
});

gulp.task('file-qext', function () {
    return gulp.src(srcPaths.init + 'Template.qextmpl')
        .pipe(rename(config.name + '.qext'))
        .pipe(insert.append(JSON.stringify(config, null, 1)))
        .pipe(gulp.dest(sourceFolder));
})
gulp.task('file-wbl', async function () {
    return fs.writeFile(srcPaths.init + 'wbfolder.wbl', process.env.NAMEAPP + '.qext;index.html;', function (e, d) {
        return gulp.src([srcPaths.init + 'wbfolder.wbl'])
            .pipe(gulp.dest(sourceFolder))
    })
})

///*
// * Desarrollo
// * Sin minimizar los JS,CSS,HTML ni optimizar imágnes
// */
gulp.task('generate', gulp.series(dependencies.generate));



