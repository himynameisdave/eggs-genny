/***********************************************
||          WELCOME TO EGGS GENNNY's          ||
||                gulpfile.js                 ||
||                                            ||
||     Alter to suit your needs, this is      ||
||          just a starting place =)          ||
||                                            ||
************************************************/


/***********************************************
**               Require Stuff                **
************************************************/
var gulp   = require('gulp'),
    chalk  = require('chalk'),
    del    = require('del'),
    plug   = require('gulp-load-plugins')({
              scope: ['devDependencies'],
              replaceString: 'gulp-',
            }),
//  Here's where you can specify which browsers Autoprefixer tests against
//  The default you see here goes back really far, in reality something like 'last 2 versions' gets you > 90% coverage
    supportedBrowsers = [ 'last 4 versions', '> 0.5%', 'ie 7', 'ff 3', 'Firefox ESR', 'Android 2.1' ];



/***********************************************
**          Default Task (dev/watch)          **
************************************************/
gulp.task( 'default', ['reload-me']);



/***********************************************
**          Development/Watch Task            **
************************************************/
gulp.task( 'reload-me', function(){
  plug.livereload.listen();
  gulp.watch( 'app/css/*.less', ['compile-me'] );
  gulp.watch( 'app/js/*.js', ['validate-js'] );
  gulp.watch( ['app/css/*.css', 'app/js/*.js', 'app/index.html'<% if(deps.angular){ %>, 'app/partials/*.html'<% } %> ], function(){
    loggit("I've reloaded your page, <% if(greeting === 'sir'){ %>sir!<% } if(greeting === 'ma\'am'){ %>ma'am!<% } if(greeting === 'cap\'n'){ %>cap'n!<% } if(greeting === 'homie'){ %>homie!<% } if(greeting === 'hombre'){ %>hombre!<% } %>\n    "+timePlz());
  })
  .on('change', plug.livereload.changed);
});

//   VALIDATION SHIT
gulp.task( 'validate-me', [ 'validate-js', 'validate-css' ]);

//  VALIDATION JS
gulp.task( 'validate-js', function(){

  return gulp.src('app/js/*.js')
          .pipe(plug.jshint())
          .pipe(plug.jshint.reporter('default'));

});

//  VALIDATION CSS
gulp.task( 'validate-css', function(){

  return gulp.src('app/css/*.css')
          .pipe(plug.csslint())
          .pipe(plug.csslint.reporter(CSSReport));

});


/***********************************************
**                   build                    **
************************************************/


gulp.task( 'build', [ 'compile-me', 'css-me', <% if (deps.angular) { %>'annotate-me', 'partials-me',<% } %>'js-me', 'assets-me', 'html-me', 'clean-me', 'uncss-me' ]);


//  LESS compile
gulp.task( 'compile-me', function(){

  return gulp.src('app/css/*.less')
          .pipe( plug.less() )
          .on('error', errorLog)
          .pipe( gulp.dest('app/css/') );

});
//  CSSTASKS
gulp.task( 'css-me', ['compile-me'], function(){

  return  gulp.src( [ <% if (deps.bootstrap) { %>'app/lib/bootstrap.css',<% } %> 'app/css/*.css' ] )
            .pipe( plug.concat('styles.css') )
            .pipe( gulp.dest( 'tmp/css' ) )
            .pipe( plug.autoprefixer({
                      browsers: supportedBrowsers,
                      cascade: false
                    }))
            .pipe( plug.csscomb() )
            .pipe( gulp.dest( 'build/css/' ) );

});
gulp.task( 'uncss-me', ['css-me',<% if (deps.angular) { %> 'partials-me',<% } %> 'html-me'], function(){
  <% if (deps.angular) { %>
    //  Alert for angular users to add partials to the uncss task.
    //  You can delete once you've seen this message
    console.log(chalk.red(  '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n'+
                            '           WARNING!             \n'+
                            ' Add your partial files to the  \n'+
                            ' uncss task or their css will   \n'+
                            ' be stripped out!!              \n'+
                            '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n'));

  <% } %>return gulp.src('build/css/styles.css')
          .pipe(plug.uncss({
            //  UNCSS (sadly) does not support globbing, so 'build/partials/*.html' does not work here
            //  Manually add your partial files to this array so they can be parsed
            html: ['build/index.html']
          }))
          .pipe( plug.minifyCss() )
          .pipe(gulp.dest('build/css/'));
});

//  JSTASKS
<% if (deps.angular) { %>
gulp.task( 'annotate-me',  function(){

  return  gulp.src( 'app/js/app.js' )
          .pipe( plug.ngAnnotate() )
          .on('error', errorLog)
          .pipe(gulp.dest('app/js/'));

});
<% } %>gulp.task( 'js-me',<% if (deps.angular) { %> ['annotate-me'],<% } %> function(){

  return  gulp.src([<% if (deps.jquery) { %>
                  'app/lib/js/jquery.js',<% } if(deps.gsap){ %>
                  'app/lib/js/TweenMax.min.js',
                  'app/lib/js/TimelineMax.js',
                  'app/lib/js/CSSPlugin.js',
                  'app/lib/js/EasePack.js',<% } if(deps.angular){ %>
                  'app/lib/js/angular.js',<% } %>
                  'app/js/*.js' ])
          .pipe( plug.concat('scripts.js') )
          .pipe( gulp.dest( 'tmp/js' ) )
          .pipe( plug.uglify( {mangle: false} ) )
          .pipe( gulp.dest( 'build/js' ) );

});


//MOVE ASSETS
gulp.task( 'assets-me', function(){

  //  IMAGES
  gulp.src( 'app/img/*' )
    .pipe(plug.imagemin({
      progressive: true,
      optimizationLevel: 5
    }))
    .pipe( gulp.dest('build/img/') );
  //  Favicon move
  gulp.src( 'app/favicon.ico' )
    .pipe( gulp.dest('build/favicon.ico') );

});<%  if(deps.angular){ %>

gulp.task( 'partials-me', function(){

  return gulp.src( 'app/partials/*' )
          .pipe(plug.angularHtmlify())
          .pipe( gulp.dest('build/partials/') );

});<% } %>

//HTMLMOVE/REPLACE
gulp.task( 'html-me', function(){

  return gulp.src( 'app/index.html' )<%  if(deps.angular){ %>
          .pipe(plug.angularHtmlify())
          <% } %>.pipe(plug.htmlReplace({
              css: {
                src: 'css/styles.css',
                tpl: '  <link rel="stylesheet" type="text/css" href="%s" />'
              },
              js: {
                src: 'js/scripts.js',
                tpl: '  <script type="text/javascript" src="%s"></script>'
              }
          }))
          .pipe(gulp.dest( 'build/' ));
});

gulp.task( 'clean-me', [ 'css-me', 'js-me' ], function(){

  var dels = 'Cleaned up the following: \n';
  del( ['tmp/**','tmp'] , function (err, deletedFiles) {
    deletedFiles.forEach( function( val, index ){
        dels +=  '  - '+val+'\n';
    });
    loggit(dels);
  });

});



/***********************************************
**          Utility/Logging Functions         **
**   Nothing (gulp) to see here, move along   **
************************************************/
var loggit = function (l){
  var log = "*****************************************\n"+
            l+"\n"+
            "*****************************************\n";
  console.log( chalk.cyan(log) );
},
errorLog = function (er){
  var log = "*****************************************\n"+
            "**          CATASTROPHIC ERROR!        **\n"+
            "**                                     **\n"+
            "**       User attempted to use the     **\n"+
            "**     program in the manner it was    **\n"+
            "**          intended to be used!       **\n"+
            "**                                     **\n"+
            "**            ERROR MESSAGE:           **\n"+
            "**                                     **\n"+
            er+"\n"+
            "*****************************************\n";

  console.log( chalk.red( log )  );
},
timePlz = function(){

  var D  = new Date(),
      h  = D.getHours(),
      m  = D.getMinutes(),
      s  = D.getSeconds(),
      dt = D.getDate(),
      yr = D.getFullYear(),
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      mt = months[D.getMonth()];

      //  convert to 12 hour time
      if(h > 12){ h = h - 12; }
      if(h === 0){ h = 12; }

      //  in case seconds is lower than 10
      if( s < 10 ){ s = '0' + s; }

      return mt + ' ' + dt + ', ' + yr + ' at ' + h + ':' + m + ':' + s;

},
CSSReport = function(file) {

  var ers = file.csslint.errorCount+' errors in '+file.path+'\n';

  file.csslint.results.forEach(function(result) {

    var col = 'yellow';
    if( result.error.type === "error" ){
      col = "red";
    }

    if(result.error.line !== undefined){
      ers += chalk.underline[col]('LINE '+result.error.line+':') + ' ' +result.error.message + "\n";
    }else{
      ers += chalk.underline.green('GENERAL:') + ' ' + result.error.message + "\n";
    }

  });

  loggit(ers);

};
