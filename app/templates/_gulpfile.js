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
  plug.livereload.listen()
  gulp.watch( 'app/css/*.less', ['compile-me'] );
  gulp.watch( ['app/css/*.css', 'app/js/*.js', 'app/index.html'<% if(deps.angular){ %>, 'app/partials/*.html'<% } %> ], function(){
    loggit("I've reloaded your page, <% if(greeting === 'sir'){ %>sir!<% }else{ %>ma'am!<% } %>\n    "+timePlz());
  })
  .on('change', plug.livereload.changed);
});



/***********************************************
**                   build                    **
************************************************/

gulp.task( 'build', [ 'compile-me', 'css-me', <% if (deps.angular) { %>'annotate-me',<% } %>'js-me', 'assets-me', 'html-me', 'clean-me' ]);

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
            .pipe( plug.minifyCss() )
            .pipe( gulp.dest( 'build/css/' ) );

});

//  JSTASKS
<% if (deps.angular) { %>
gulp.task( 'annotate-me',  function(){

  return  gulp.src( 'app/js/app.js' )
          .pipe( plug.ngAnnotate() )
          .on('error', errorLog)
          .pipe(gulp.dest('app/js/'));

});
<% } %>
gulp.task( 'js-me',<% if (deps.angular) { %> ['annotate-me'],<% } %> function(){

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

<%  if(deps.angular){ %>//  PARTIALS
  gulp.src( 'app/partials/*' )
    .pipe(plug.angularHtmlify())
    .pipe( gulp.dest('build/partials/') );
  <% } %>//  IMAGES
  gulp.src( 'app/img/*' )
    .pipe(plug.imagemin({
      progressive: true,
      optimizationLevel: 5
    }))
    .pipe( gulp.dest('build/img/') );
  //  Favicon move
  gulp.src( 'app/favicon.ico' )
    .pipe( gulp.dest('build/favicon.ico') );

})

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
    })
    loggit(dels);
  });

});



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

function timePlz(){

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
      if(h > 12){ h = h - 12 };
      if(h === 0){ h = 12 };

      //  in case seconds is lower than 10
      if( s < 10 ){ s = '0' + s }

      return mt + ' ' + dt + ', ' + yr + ' at ' + h + ':' + m + ':' + s;

}
