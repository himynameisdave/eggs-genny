# eggs-genny
> An EGGSellent [Yeoman](http://yeoman.io/) GENNY-erator by [Dave Lunny](http://himynameisdave.github.io/)

Creates a template project after asking a few dependency-related questions.


In case you don't know what [Yeoman](http://yeoman.io/) is, it's essentially like builds you out a "template" project or project skeleton. It's fucking dope, saves you a shit load of time, and there are [literally](https://github.com/yeoman/generator-webapp) [a bunch](https://github.com/yeoman/generator-polymer) [of prebuilt ones](https://github.com/yeoman/generator-bootstrap). You can also write your own, obviously, which is how EggsGenny was born.

---
##Installation/Setup

####Step 1:
Install Yeoman.
```bash
npm install -g yo
```
You should have [Bower](http://bower.io/) and [Grunt](http://gruntjs.com/), and if you don't then run this:
```bash
npm install --global yo bower grunt-cli
```
####Step 2:
Install the greatest Yeoman genny known to man (step off, [generator-webapp](https://github.com/yeoman/generator-webapp)!):
```bash
npm install -g git://github.com/himynameisdave/eggs-genny.git
```

####Step 3:
`cd` into your little rag-tag project and run:
```bash
yo eggs-genny
```

####Step 4:
Answer some questions about the following dependencies:
- [jQuery](http://jquery.com/)
- [Angular](https://angularjs.org/)
- [GSAP](http://greensock.com/gsap)
- [Bootstrap](http://getbootstrap.com/) (only the CSS, [fuck their goofy JS components](http://getbootstrap.com/javascript/))

####Step 5 (for some users):
eggs-genny attempts to do an `npm install` of the necessary dependencies. Depending on how permissions are configured on your system, you may also need to run it with `sudo` after doing step 4:
```bash
sudo npm install
```

####Step 6:
Develop like Dave, or as I call it, Davelop.
Pretty bitchin', isn't it?


---
##Build System

By default, eggs-genny uses [Gulp](http://gulpjs.com/) as a task-runner (porting it to Grunt soon!). Here's a rundown of the essential tasks it has:

#####Supported browsers

There is a [variable at the top of the Gulpfile](https://github.com/himynameisdave/eggs-genny/blob/master/app/templates/_gulpfile.js#L23) called `supportedBrowsers` which is how you can set which browsers [Autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) will add vendor prefixes to support. By default it goes back to like the stone age:
```javascript
  supportedBrowsers = [ 'last 4 versions', '> 0.5%', 'ie 7', 'ff 3', 'Firefox ESR', 'Android 2.1' ];
```
...which of course you can reset to whatever you like. Read more on Autoprefixer and the various browser strings [over here](http://css-tricks.com/autoprefixer/).

#####Default
```
gulp OR gulp default
```

By simply running `gulp`, you will get a watch on all the main dev files under the `app`. Any saved LESS files will compile to CSS. A livereload will be triggered on the change of any of these files (for CSS this is after it is compiled from LESS).

#####Build
```
gulp build
```

This is the 'build' or 'distribution' or 'production' or whatever you want to call it. This guy does a bunch of work to build you out a lean and clean app:

- starts by [compiling](https://github.com/plus3network/gulp-less)  all the LESS files
- then [concats](https://www.npmjs.com/package/gulp-concat) the CSS, [autoprefixes](https://www.npmjs.com/package/gulp-autoprefixer) it, before finally [combing](https://www.npmjs.com/package/gulp-csscomb) it for stupid mistakes and then [minifying](https://www.npmjs.com/package/gulp-minify-css) it
- then moves onto the JS by (if your using Angular in your project) prepping your code for minification using [ng-annotate](https://www.npmjs.com/package/gulp-ng-annotate), concating all js files into one and then [uglifying](https://www.npmjs.com/package/gulp-uglify) them
- copy over any assets or partials (and make them [validation-friendly](https://www.npmjs.com/package/gulp-angular-htmlify) if using Angular)
- copy over main `index.html` file, while [replacing](https://www.npmjs.com/package/gulp-html-replace) the many links to external JS/CSS files with just the one for the JS file and one for the CSS files that were just created
- perform a cleanup by [deleting](https://www.npmjs.com/package/del) the `tmp/` directory used to build the files

######Utilities
Yeah, there's two 'utility' functions. One is a [hilarious error message](https://github.com/himynameisdave/eggs-genny/blob/master/app/templates/_gulpfile.js#L164) and the other just logs stuff in a more visible way. These will one day be npm modules too and will then just get required in so as to keep the `gulpfile.js` clean.

You can fully remove all instances of these if you want, they are non-essential.

---