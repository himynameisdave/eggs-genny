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

This is where shit gets real. Answer some questions and in no time you'll have a web app with you name on it, customized to exactly how you like it.

You can also optionally skip the bower and npm installs by adding `--skip-install` to the end of the command, like so:

```bash
yo eggs-genny --skip-install
```

---
## Options Overview

eggs-genny gives you a lot of options to customize your project's setup. It starts by asking some proceedurial stuff, such as the name and description of your application. eggs-genny is always growing, but as of writing this here are the options that eggs-genny provides to customize what your project will use:

**Preprocessors**

- [Less](http://lesscss.org/)
- [Sass](http://sass-lang.com/)

**CSS Frameworks/Tools**

- [Bootstrap CSS](http://getbootstrap.com/css/)
- [Skeleton](http://getskeleton.com/)
- [Lesslie](https://github.com/himynameisdave/Lesslie)

**JS Frameworks/Tools**

- [jQuery](http://jquery.com)
- [Angular](https://angularjs.org/)
- [React](http://facebook.github.io/react/)
- [GSAP](https://greensock.com/gsap)

---
## Documentation

If you want to know about the automated Gulp [build process](https://github.com/himynameisdave/eggs-genny/wiki/Gulp:-Build) or [development process](https://github.com/himynameisdave/eggs-genny/wiki/Gulp:-Development), or the [directory structure](https://github.com/himynameisdave/eggs-genny/wiki/Basic-Directory-Structure) that eggs-genny produces, the best source are [the docs](http://himynameisdave.github.io/eggs-genny/#/).


You could also head over to [the wiki](https://github.com/himynameisdave/eggs-genny/wiki) which should make you laugh while answering all of your questions, although it's essentially the same as the docs.

---
## Contribute

Wanna [help a brother out?](http://himynameisdave.github.io/eggs-genny/#/help-a-brother-out) Feel free to make suggestions here or [on Twitter](https://twitter.com/dave_lunny), or better yet create a pull request and help build eggs-genny!

---

*Created by [Dave Lunny](https://himynameisdave.github.io) in the beautiful year 2015.*
