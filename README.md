# eggs-genny
> An EGGSellent [Yeoman](http://yeoman.io/) GENNY-erator by [Dave Lunny](http://himynameisdave.github.io/)

Creates a template project after asking a few dependency-related questions.

In case you don't know what [Yeoman](http://yeoman.io/) is, it's essentially like builds you out a "template" project or project skeleton. It's fucking dope, saves you a shit load of time, and there are [literally](https://github.com/yeoman/generator-webapp) [a bunch](https://github.com/yeoman/generator-polymer) [of prebuilt ones](https://github.com/yeoman/generator-bootstrap). You can also write your own, obviously, which is how EggsGenny was born.


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
Install the greatest Yeoman genny known to man (not really doe).
```bash
npm install -g git://github.com/himynameisdave/eggs-genny.git
```

####Step 3:
`cd` to your rag-tag little project and run:
```bash
yo eggs-genny
```

####Step 4:
Answer some questions about the following dependencies:
- [jQuery](http://jquery.com/)
- [Angular](https://angularjs.org/)
- [GSAP](http://greensock.com/gsap)
- [Bootstrap](http://getbootstrap.com/) (only the CSS, [fuck their goofy JS components](http://getbootstrap.com/javascript/))

####Step 5:
Develop like Dave, or as I call it, Davelop.
Pretty bitchin', isn't it?

