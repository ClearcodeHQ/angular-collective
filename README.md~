Angular Collective
=========

Angular Collective is a web-app similar to ng-modules agregating and showing information about modules. Primarly written for use in ClearCode recurring angular modules (such as directives, services, filters). Application connects to GitHub user repository to download modules to DB.
Application offers:

* tagging
* liking / disliking modules
* grouping into projects
* searching via faceted search
* editing tags and projects (tags will be updated on github)
* newsletter
* RSS
* sorting
    * alphabetically
    * by updated
    * by likes
* filtering
    * by fork / user repos
    * by directive in name
    * by service in name
    * by filter in name
    
Application is written using [mean stack] with grunt, tests are written in jasmine. Code follows JavaScript Code Style [JSCS] and jshint [JSHINT] .

Version
----

1.0

Tech
-----------

Angular Collective uses a number of open source projects as components:

* [Angular-JS]  Angular JS as frontend
* [Ui.Bootstrap] Bootrstrap for better data presentation
* [Node.js] Node JS as backend
* [MongoDB] MongoDB database
* [angular-marked] Angular markdown directive
* [angucomplete-alt] Autocomplete for search
* [ng-tags-input] For editing tags and projects
* [angular-ui-notification] For notification


Installation
--------------

```sh
git clone ssh://git@stash.clearcode.cc:6969/ac/acwebsite.git 
cd acwebsite
npm install
bower install
```
Running on production settings:

```sh
NODE_ENV=production grunt serve
```

Tests
----
E2E tests

```sh
npm install -g protractor (install protractor and webdriver)
webdriver-manager update --standalone (install webdrivers, standalone version)
webdriver-manager start (start selenium server)
mongod (run mongo server)
grunt serve (run node server)
protractor protractor_conf.js (run tests)
```

backend tests

```sh
NODE_ENV=test grunt serve  (runs server in test env)
grunt testbackend
```

jscs check

just run

```sh
grunt jscs
```


License
----

MIT (pending)
[mean stack]:http://meanjs.org/
[Angular-JS]:https://angularjs.org/
[Ui.Bootstrap]:http://angular-ui.github.io/bootstrap/
[Node.js]:http://nodejs.org/
[MongoDB]:http://www.mongodb.org/
[angular-marked]:https://github.com/Hypercubed/angular-marked
[angucomplete-alt]:https://github.com/ghiden/angucomplete-alt
[ng-tags-input]:https://github.com/mbenford/ngTagsInput
[angular-ui-notification]:https://github.com/alexcrack/angular-ui-notification
[JSCS]:https://github.com/jscs-dev/node-jscs
[JSHINT]:https://github.com/gruntjs/grunt-contrib-jshint