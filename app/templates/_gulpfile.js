/***********************************************
||          WELCOME TO EGGS GENNNY's          ||
||                gulpfile.js                 ||
||                                            ||
||                                            ||
|| Methodology:                               ||
||                                            ||
|| Require Stuff: uses gulp-load-plugins to   ||
|| go and get plugins from the package.json   ||
||                                            ||
|| Default: very simple watch>compile>reload  ||
||                                            ||
|| Build:dev: is gunna compile the LESS, then ||
|| autoprefix, csscomb, concat+minify css, &  ||
||                                            ||
************************************************/


/***********************************************
**               Require Stuff                **
************************************************/
var gulp  = require('gulp'),
    chalk = require('chalk'),
    plug  = require('gulp-load-plugins')({
              scope: ['devDependencies'],
              replaceString: 'gulp-',
            }),
//  Here's where you can specify which browsers Autoprefixer tests against
//  The default you see here goes back really far, in reality something like 'last 2 versions' gets you > 90% coverage
    supportedBrowsers = [ 'last 4 versions', '> 0.5%', 'ie 7', 'ff 3', 'Firefox ESR', 'Android 2.1' ];



/***********************************************
**          Default Task (dev/watch)          **
************************************************/
gulp.task( 'default', [ 'dev' ]);



/***********************************************
**          Development/Watch Task            **
************************************************/
gulp.task( 'dev', function(){

  plug.livereload.listen()
  gulp.watch('app/css/style.less', [ 'build:dev' ] )
  .on('change', plug.livereload.changed);

});



/***********************************************
**                 build:dev                  **
************************************************/
gulp.task( 'build:dev', function(){

  gulp.src('app/css/*.less')
    .pipe( plug.less() )
    .on('error', errorLog)
    .pipe( plug.autoprefixer({
              browsers: supportedBrowsers,
              cascade: false
            }))
    .pipe( plug.csscomb() )
    .pipe( gulp.dest('app/css/') );

});



/***********************************************
**                build:dist                  **
************************************************/
gulp.task( 'build:dist', function(){

  //  compile LESS
  gulp.src('app/css/*.less')
    .pipe( plug.less() )
    .on('error', errorLog)
    .pipe( gulp.dest('app/tmp/css/') );

  //  copy over styles
  <% if (deps.bootstrap) { %>
  gulp.src( 'app/lib/bootstrap/dist/css/bootstrap.css'  )
    .pipe( gulp.dest('app/tmp/css/') );
  <% } %>

  //  mincatclean the css
  gulp.src( 'app/tmp/css/*.css' )
    .pipe( plug.concatCss('styles.css') )
    .pipe( plug.autoprefixer({
              browsers: supportedBrowsers,
              cascade: false
            }))
    .pipe( plug.csscomb() )
    .pipe( plug.uglify() )
    .pipe( gulp.dest( 'build/css/' ) );


})



/***********************************************
**          Utility/Logging Functions         **
**   Nothing (gulp) to see here, move along   **
************************************************/
function loggit(l){
  var log = "*****************************************\n"+
            " - "+l+"\n"+
            "*****************************************\n"
  console.log( chalk.cyan(log) );
}

function errorLog(er){
  var log = "*****************************************\n"+
            "**          CATASTROPHIC ERROR!        **\n"+
            "**                                     **\n"+
            "**       User attempted to use the     **\n"+
            "**     program in the manner it was    **\n"+
            "**          intended to be used!       **\n"+
            "**                                     **\n"+
            "              ERROR MESSAGE:             \n"+
            " - "+er+"\n"+
            "*****************************************\n";

  console.log( chalk.red( log )  );
}


