/***
  *   Generated gulpfile for:
  *   <%=appName%>
  **/


/***********************************************
**               Require Stuff                **
************************************************/
var gulp    = require('gulp'),
    del     = require('del'),
    loggit  = require('loggit'),
    time    = require('./node_modules/timestamp/timestamp.js'),
    glob    = require('glob'),
    plug    = require('gulp-load-plugins')({
                scope: ['devDependencies'],
                replaceString: 'gulp-',
              }),
//  Here's where you can specify which browsers Autoprefixer tests against
//  The default you see here goes back really far, in reality something like 'last 2 versions' gets you > 90% coverage
    supportedBrowsers = [ 'last 4 versions', '> 0.5%', 'ie 7', 'ff 3', 'Firefox ESR', 'Android 2.1' ];


/***********************************************
**          Default Task (dev/watch)          **
************************************************/
gulp.task( 'default', [ 'serve-me', 'reload-me' ]);


/***********************************************
**          Development/Watch Task            **
************************************************/
gulp.task( 'reload-me', function(){

  <% if(preprocessor === 'less') { %>gulp.watch( 'app/css/*.less', ['compile-css'] );<% }else { %>gulp.watch( 'app/css/*.sass', ['compile-css'] );<% } %>
  <% if(coffee){ %>gulp.watch( 'app/js/*.coffee', ['compile-coffee'] );<% } if(es6){ %>gulp.watch( 'app/js/*.js', ['compile-es6'] );
  <% }else { %>gulp.watch( 'app/js/*.js', ['move-js'] );<% } %>

  plug.livereload.listen();
  gulp.watch( ['app/**/*.css', 'app/**/*.js', 'app/**/*.html'], function(){
    loggit( "I've reloaded your page, <% if(greeting === 'sir'){ %>sir!<% } if(greeting === 'ma\'am'){ %>ma'am!<% } if(greeting === 'cap\'n'){ %>cap'n!<% } if(greeting === 'homie'){ %>homie!<% } if(greeting === 'hombre'){ %>hombre!<% } if(greeting === 'miss'){ %>miss!<% } if(greeting === 'boss'){ %>boss!<% } %>\n    "+time.timePlz(),
            "yellow",
            "+" );
  })
  .on('change', plug.livereload.changed);
});


/***********************************************
**              Server Tasks                  **
************************************************/
gulp.task( 'serve-me', function(){

  plug.connect.server({
          root: 'app/',
          port: 6969
        });

});

gulp.task( 'build-server', [ 'uncss-me', 'js-me', 'css-me' ], function(){

  loggit( 'Check out your build at:\nhttp://localhost:7070', 'blue', '<>' );
  plug.connect.server({
        root: 'build/',
        port: 7070
      });

});


/***********************************************
**              Validation Task               **
************************************************/
gulp.task( 'validate-me', [<% if (coffee) { %>'compile-coffee', <% } %>'validate-js', 'validate-css' ]);


//  VALIDATION JS
gulp.task( 'validate-js',<% if (coffee) { %> ['compile-coffee'],<% } %> function(){

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
gulp.task( 'build', [ 'compile-css', <% if (coffee) { %>'compile-coffee', <% } %>'css-me', <% if (depsJS.angular) { %>'annotate-me', 'partials-me',<% } %>'js-me', 'assets-me', 'html-me', 'clean-me', 'uncss-me', 'build-server' ]);


/**
  *   CSS COMPILATION
  */
gulp.task( 'compile-css', function(){

<% if(preprocessor === 'less') { %>return gulp.src('app/css/style.less')
          .pipe( plug.less() )<% }else{ %>return gulp.src('app/css/style.sass')
          .pipe( plug.sass() )<% } %>
          .on('error', errorLog)
          .pipe( gulp.dest('app/lib/css/') );

});
<% if(coffee){ %>
/**
  *   COFFEESCRIPT COMPILATION
  */
gulp.task( 'compile-coffee', function(){

  return gulp.src( 'app/js/*.coffee' )
          .pipe( plug.coffee() )
          .on('error', function(e){
            loggit('Error compiling ','red', '*');
          })
          .pipe( gulp.dest( 'app/lib/js/' ) );

})
<% } if( es6 ){ %>
gulp.task( 'compile-es6', function(){

  return gulp.src( 'app/js/*.js' )
            .pipe(plug.babel())
            .pipe(gulp.dest('app/lib/js/'));

})
<% } %>


/***********************************************
**                  deploy                    **
************************************************/
gulp.task( 'deploy', [ 'build', 'deploy-me' ] )


gulp.task( 'deploy-me', [ 'build' ], function(){

  return gulp.src( './build/**/*' )
          .pipe(plug.ghPages());

})

gulp.task( 'deploy-message', ['deploy-me'], function(){

  return loggit( 'Your build has been deployed to the gh-pages branch of this repo!', 'blue', '<>' );

})


/***********************************************
**                 CSS Tasks                  **
************************************************/
gulp.task( 'css-me', ['compile-css'], function(){

  return  gulp.src( [ <% if (depsCSS.bootstrap) { %>'app/lib/css/bootstrap.css',<% } if (depsCSS.skeleton) { %> 'app/lib/css/skeleton.css',<% } if (depsCSS.animate) { %> 'app/lib/css/animate.css',<% } %> 'app/lib/css/style.css' ] )
            .pipe( plug.concat('styles.css') )
            .pipe( gulp.dest( 'tmp/css' ) )
            .pipe( plug.autoprefixer({
                      browsers: supportedBrowsers,
                      cascade: false
                    }))
            .pipe( gulp.dest( 'build/css/' ) );

});
gulp.task( 'uncss-me', ['css-me',<% if (depsJS.angular) { %> 'partials-me',<% } %> 'html-me'], function(){

  return gulp.src('build/css/styles.css')
          .pipe(plug.uncss({
            html: <% if (depsJS.angular) { %>glob.sync('build/**/*.html')<% }else { %>['build/index.html']<% } %>
          }))
          .pipe( plug.csscomb() )
          .pipe( plug.minifyCss({keepSpecialComments: 0}) )
          .pipe(gulp.dest('build/css/'));
});



/***********************************************
**                  JS Tasks                  **
************************************************/
<% if (depsJS.angular) { %>
gulp.task( 'annotate-me',  function(){

  return  gulp.src( 'app/lib/js/app.js' )
          .pipe( plug.ngAnnotate() )
          .on('error', errorLog)
          .pipe(gulp.dest('app/lib/js/'));

});
<% } %>gulp.task( 'js-me',<% if (depsJS.angular) { %> ['annotate-me'],<% } %> function(){

  return  gulp.src([<% if(depsJS.angular){ %>
                  'app/lib/js/angular.js',<% } if (depsJS.jquery) { %>
                  'app/lib/js/jquery.js',<% } if (depsJS.underscore) { %>
                  'app/lib/js/underscore.js',<% } if(depsJS.react){ %>
                  'app/lib/js/react.js',
                  'app/lib/js/JSXTransformer.js',<% } if(depsJS.gsap){ if(depsJS.gsap.minMax === 'TweenLite'){ %>
                  'app/lib/js/TweenLite.js',
                  'app/lib/js/TimelineLite.js',<% }else { %>
                  'app/lib/js/TweenMax.js',
                  'app/lib/js/TimelineMax.js',<% } depsJS.gsap.plugs.forEach(function(plug){ %>
                  'app/lib/js/<%= plug %>.js',<% }) } %>
                  'app/lib/js/app.js' ])
          .pipe( plug.concat('scripts.js') )
          .pipe( gulp.dest( 'tmp/js' ) )
          .pipe( plug.uglify( {mangle: false} ) )
          .pipe( gulp.dest( 'build/js' ) );

});


/***********************************************
**                Move Tasks                  **
************************************************/
gulp.task( 'assets-me', function(){

  //  IMAGES
  gulp.src( 'app/img/**/*' )
    .pipe(plug.imagemin({
      progressive: true,
      optimizationLevel: 5
    }))
    .pipe( gulp.dest('build/img/') );
  //  Favicon move
  gulp.src( 'app/favicon.ico' )
    .pipe( gulp.dest('build/') );

});<%  if(depsJS.angular){ %>

gulp.task( 'partials-me', function(){

  return gulp.src( 'app/partials/*' )
          .pipe(plug.angularHtmlify())
          .pipe( gulp.dest('build/partials/') );

});<% } %>

<% if(!coffee && !es6){ %>
gulp.task( 'move-js', function(){

  return gulp.src( 'app/js/*.js' )
          .pipe( gulp.dest('app/lib/js/') );

});
<% } %>

//HTMLMOVE/REPLACE
gulp.task( 'html-me', function(){

  return gulp.src( 'app/index.html' )<%  if(depsJS.angular){ %>
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
    loggit(dels, 'cyan');
  });

});


/***********************************************
**          Utility/Logging Functions         **
**   Nothing (gulp) to see here, move along   **
************************************************/
var errorLog = function (er){

  var log = "*****************************************\n"+
            "**          CATASTROPHIC ERROR!        **\n"+
            "**                                     **\n"+
            "**       User attempted to use the     **\n"+
            "**     program in the manner it was    **\n"+
            "**          intended to be used!       **\n"+
            "**                                     **\n"+
            "**            ERROR MESSAGE:           **\n"+
            "   "+er.message+"\n"+
            "*****************************************\n";

  loggit( log, 'red', '  ' );

},
CSSReport = function(file) {

  var ers = file.csslint.errorCount+' errors in '+file.path+'\n';

  file.csslint.results.forEach(function(result) {

    var col = 'yellow';
    if( result.error.type === "error" ){
      col = "red";
    }

    if(result.error.line !== undefined){
      ers += 'LINE '+result.error.line+': ' + result.error.message + "\n";
      ers += '  ' + result.error.evidence + '\n';
    }else{
      ers += 'GENERAL:' + ' ' + result.error.message + "\n";
    }

  });

  loggit(ers, 'white', '=');

};
