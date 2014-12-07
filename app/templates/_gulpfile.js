// //    A gulpfile by Dave Lunny
// var gulp  = require('gulp'),
//     plug  = require('gulp-load-plugins')({
//               scope: ['devDependencies'],
//               replaceString: 'gulp-',
//             });


// ////////////////////////////////////////////////////////
// //  //                                            //  //
// //  //                  PRODUCTION                //  //
// //  //                                            //  //
// ////////////////////////////////////////////////////////

// gulp.task('build', [ 'build-js', 'build-css', 'build-assets' ]);

// //  JS production task
// gulp.task('build-js', function(){

//   console.log('Step 1: ng-annotate & uglify');
//     gulp.src('app/js/app.js')
//     .pipe(plug.ngAnnotate())
//         .on('error', function(e){
//           console.log('ng-annotate error');
//           console.log(e);
//         })
//     .pipe(gulp.dest('app/lib/js/'))
//     .pipe(gulp.src( [
//           'app/lib/js/angular.js',
//           'app/lib/js/jquery.js',
//           'app/lib/js/ui-router.js',
//           'app/lib/js/ng-touch.js',
//           'app/lib/js/app.js'
//         ] ))
//     .pipe(plug.uglify())
//     .on('error', function(e){
//           console.log('uglify js files error');
//           console.log(e);
//         })
//     .pipe(gulp.dest('app/lib/js/'));

//   console.log('Step 2: concat js files');
//     // gulp.src([ 'app/lib/js/*.js' ])
//     gulp.src([
//           'app/lib/js/angular.js',
//           'app/lib/js/jquery.js',
//           'app/lib/js/ui-router.js',
//           'app/lib/js/ng-touch.js',
//           'app/lib/js/app.js'
//         ])
//         .pipe(plug.concat('core.js'))
//         .pipe(gulp.dest('public/js/'));

//   console.log('Step 3: copy over routes');
//     gulp.src('app/js/routes.json')
//       .pipe(gulp.dest('public/js'));

// });

// gulp.task('build-css', function(){

//   console.log('Step 4: Compile LESS, autoprefix, combine media queries, & comb CSS');
//   gulp.src('app/css/style.less')
//     .pipe(plug.less({ style: 'compressed' }))
//     .on('error', function(e){
//       console.log('ERROR ON LINE ' + e.line);
//       console.log(e.message);
//     })
//     .pipe(plug.autoprefixer({
//         browsers: ['last 3 versions'],
//         cascade: true
//     }))
//     .pipe(plug.combineMediaQueries())
//     .pipe(plug.csscomb())
//     .pipe(gulp.dest('app/lib/css/'));

//   console.log('Step 5: Minify, Uncss & Concat CSS');
//   gulp.src( 'app/lib/css/*.css' )
//     .pipe(plug.concatCss('core.css'))
//     .pipe(plug.uncss({
//       //  globbing dont work none
//       html: [   'app/index.html',
//                 'app/partials/desktop.html',
//                 'app/partials/mobile.html',
//                 'app/partials/header.html',
//                 'app/partials/main.html',
//                 'app/partials/sched-view.html',
//             ]
//     }))
//     .pipe(plug.minifyCss())
//     .pipe(gulp.dest('public/css/'));

// });


// gulp.task( 'build-assets', function(){

//   console.log('Step 6: Copy partials');
//     gulp.src( 'app/partials/*' )
//         .pipe(plug.angularHtmlify())
//         .pipe( gulp.dest('public/partials/') );

//   console.log('Step 7: Copy images');
//     gulp.src( 'app/img/*' )
//         .pipe( gulp.dest('public/img/') );

//   console.log('Step 8: Copy fonts');
//     gulp.src( 'app/fonts/*' )
//         .pipe( gulp.dest('public/fonts/') );

//   console.log('Step 8: Copy fonts');
//     gulp.src( 'app/fonts/*' )
//         .pipe( gulp.dest('public/fonts/') );

//   console.log('Step 9: Angular HTML-ify & copy over altered HTML file');
//     gulp.src( 'app/index.html' )
//         .pipe(plug.angularHtmlify())
//         .pipe(plug.htmlReplace({
//               js: {
//                 src: 'js/core.js',
//                 tpl: '<script type="text/javascript" src="%s"></script>'
//               },
//               css: {
//                 src: 'css/core.css',
//                 tpl: '<link rel="stylesheet" type="text/css" href="%s" />'
//               }
//         }))
//         .pipe(gulp.dest( 'public/' ));

// });


// //////////////////
// //    DEPLOY    //
// //////////////////
// gulp.task('deploy', [ 'build', 'gh-pages' ]);

// gulp.task('gh-pages', function(){






// });



// //////////////////////////////////////////////////////////
// //  //                                              //  //
// //  //                  DEVELOPMENT                 //  //
// //  //                                              //  //
// //////////////////////////////////////////////////////////

// gulp.task('reload', function(){
//   plug.livereload.listen()
//   gulp.watch(['app/css/*.css','app/js/app.js','app/index.html', 'app/partials/*.html'], function(){
//     console.log('RELOADING PAGE');
//   })
//   .on('change', plug.livereload.changed);
// });

// gulp.task('less', function(){
//   gulp.src('app/css/style.less')
//     //LESS compilation
//     .pipe(plug.less({
//         style: 'compressed'
//       }))
//     //LESS error catch
//     .on('error', function(e){
//       console.log('ERROR ON LINE ' + e.line);
//       console.log(e.message);
//     })
//     .pipe(gulp.dest('app/css/'));
// });

// gulp.task('styles', function(){
//   gulp.watch('app/css/style.less', ['less']);
// }); 

  


// ///////////////////////////////////////////////////////
// //  //          DEFAULT         //  //
// //  //                      //  //
//   gulp.task('default', ['reload', 'styles']); //  //
// //  //                      //  //
// /////////////////////////////////////////////////////// 