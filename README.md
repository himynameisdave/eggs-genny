# Welcome to [eggs-genny](http://himynameisdave.github.io/eggs-genny/#/) [![npm](https://img.shields.io/npm/v/generator-eggs-genny.svg?style=flat-square)](https://www.npmjs.com/package/generator-eggs-genny)
##### *Dumb name, great generator.*

---

[eggs-genny](http://himynameisdave.github.io/eggs-genny/#/
) is a robust webapp-building [Yeoman](http://yeoman.io/) generator. The terriblly [punny](http://en.wikipedia.org/wiki/Pun) name comes from this line that I wrote when I initialized the repo:

>*An EGGS-ellent Yeoman GENNY-erator for building modern web apps.*

![Simulated animation of using eggs-genny](http://i.imgur.com/UbHYhNa.gif)

In case you don't know what [Yeoman](http://yeoman.io/) is, it essentially like builds you out a "template" project or project skeleton. It can also do other cool stuff like installing dependencies for you. It's fucking dope, saves you a shit load of time, and there are [literally](https://github.com/yeoman/generator-webapp) [a bunch](https://github.com/yeoman/generator-polymer) [of prebuilt ones](https://github.com/yeoman/generator-bootstrap). You can also write your own, obviously, which is how [eggs-genny](https://www.npmjs.com/package/generator-eggs-genny) was born.


To learn all about Yeoman and how to get up and running with eggs-genny, take a look at [the (hilarious and thorough) wiki](https://github.com/himynameisdave/eggs-genny/wiki).

---
## Quick Install

This presumes you've installed a Yeoman generator before. If not, check out the [wiki](https://github.com/himynameisdave/eggs-genny/wiki/Installation-Setup). eggs-genny is on [npm](https://www.npmjs.com/package/generator-eggs-genny), so installing it is a breeze:

```bash
npm install -g generator-eggs-genny
```

If that didn't work try running it with [`sudo`](https://github.com/himynameisdave/eggs-genny/wiki/Installation-Setup#what-the-s-h-i-t-is-this) in front of the command.

Now just `cd` into your little rag-tag project and run:

```bash
yo eggs-genny
```

This is where shit gets real. Answer some questions and in no time you'll have a web app with your name on it, customized to exactly how you like it.

You can also optionally skip the bower and npm installs by adding `--skip-install` to the end of the command, like so:

```bash
yo eggs-genny --skip-install
```

That's it. You're done! Although if you'd like, I just read about [this command](https://docs.npmjs.com/cli/star) so for lol's you could try it out:
```bash
npm star generator-eggs-genny
```


---
## Options Overview

eggs-genny gives you a lot of options to customize your project's setup. It starts by asking some procedural stuff, such as the name and description of your application. eggs-genny is always growing, but as of writing this here are the options that eggs-genny provides to customize what your project will use:

**Preprocessors**

- [Less](http://lesscss.org/)
- [Sass](http://sass-lang.com/)

**CSS Frameworks/Tools**

- [Bootstrap CSS](http://getbootstrap.com/css/)
- [Skeleton](http://getskeleton.com/)
- [Animate.CSS](http://daneden.github.io/animate.css/)
- [Lesslie](https://github.com/himynameisdave/Lesslie)

**JS Frameworks/Tools**

- [jQuery](http://jquery.com)
- [Underscore](http://underscorejs.org/)
- [Angular](https://angularjs.org/)
- [React](http://facebook.github.io/react/)
- [GSAP](https://greensock.com/gsap)

In addition, you will be prompted about whether or not you would like to use [CoffeeScript](https://www.npmjs.com/package/coffee-script), as well as what [GSAP plugins](https://greensock.com/plugins/) you need if you are using GSAP.

You will also be asked if you use Sublime Text, because if you do eggs-genny is going to hook you up with a sweet [project file](http://code.tutsplus.com/tutorials/sublime-text-2-project-bliss--net-27256) to get you started.

Another prompt you will be met with is whether or not you would like eggs-genny to add & link up some default [Apple touch icons](http://taylor.fausak.me/2015/01/27/ios-8-web-apps/) for you to use, as well as [Windows 10 tile icons](http://bit.ly/1AknLat).

<!-- ## Documentation

If you want to know about the automated Gulp [build process](https://github.com/himynameisdave/eggs-genny/wiki/Gulp:-Build) or [development process](https://github.com/himynameisdave/eggs-genny/wiki/Gulp:-Development), or the [directory structure](https://github.com/himynameisdave/eggs-genny/wiki/Basic-Directory-Structure) that eggs-genny produces, the best source are [the docs](http://himynameisdave.github.io/eggs-genny/#/).


You could also head over to [the wiki](https://github.com/himynameisdave/eggs-genny/wiki) which should make you laugh while answering all of your questions, although it's essentially the same as the docs. -->

---

## Running Tasks

Currently, eggs-genny builds you a great task-running system based on [Gulp](gulpjs.com). It can do wonderful things such as provide you a local file server, compile your pre-processed stylesheets, and make your code production-ready.


##### Default Task

The default task in Gulp is run simply by running `gulp` after eggs-genny is done building your project. This sets up a server at the address [`localhost:6969`](http://localhost:6969) so that you can locally test your app. It also tells gulp to watch all of your main style, script and HTML files for any changes, and to [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) the page should any changes occur.


##### Compile Tasks

Compilation of CoffeeScript, Less or Sass files happens automatically as part of the default task. However if you would like to run these tasks independently, they can be done as follows:
```bash
gulp compile-css


gulp compile-coffee
```

##### Build Task

To produce a production-ready version of your code (which is generated into the `/build` directory of the project by default), simply run the following command:
```bash
gulp build
```

This task has a lot of moving parts, but as a quick overview this task will:

- compile CSS and CoffeeScript
- concatenate all CSS files (all the ones in the `app/lib/` plus whichever ones you've created)
- concatenate all scripts (again, all of the `app/lib` scripts plus whatever one's you've added)
- minify all files
- perform some optimizations (such as [uncss](https://www.npmjs.com/package/gulp-uncss) and [ng-annotate](https://www.npmjs.com/package/gulp-ng-annotate))
- move all files to the `build/` directory, while doing things like [image minification](https://github.com/sindresorhus/gulp-imagemin) along the way

 

Eventually, the plan is to offer a Grunt option, as well as a solution that [moves away from these build tools entirely](http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/) and instead relying purely on npm & it's modules directly.

---
## Contribute

Wanna [help a brother out?](http://himynameisdave.github.io/eggs-genny/#/help-a-brother-out) Feel free to make suggestions here or [on Twitter](https://twitter.com/dave_lunny), or better yet create a pull request and help build eggs-genny!

---

*Created by [Dave Lunny](https://himynameisdave.github.io) in the beautiful year 2015.*
