# node-rest-api-scaffold

This project has the intention to help developers to build your REST API fastly. The main modules of any application are made, like Authentication, Models, Controllers, Repositories, Routes, Services, etc. You just need to make a simple configuration and run!

### Code Strucutre

- doc/
- src/
    - controllers/
    - models/
    - repositories/
    - routes/
    - services/
    - validators/
    - app.js
    - config.js
- test/
    - config
- www/

### Tech

This scaffold uses a number of open source projects to work properly:

* [Node.js](https://nodejs.org/) - evented I/O for the backend
* [Express](http://expressjs.com/) - fast node.js network app framework
* [Mongoose](http://mongoosejs.com/) - elegant mongodb object modeling for node.js
* [JWT Auth](http://mongoosejs.com/) - JsonWebToken implementation for node.js
* [Sengrid](https://sendgrid.com) - Allows to quickly and easily send emails through SendGrid using nodejs.
* [apiDoc](http://apidocjs.com/) - Inline Documentation for RESTful web APIs
* [Mocha](https://mochajs.org/) - simple, flexible, fun javascript test framework for node.js

### Installation

Requires [Node.js](https://nodejs.org/) (version 8 is recommended).

You need to edit **src/config.js** and put your configuration variables.

Install the dependencies and devDependencies and start the server.

```sh
$ cd node-rest-api-scaffold
$ npm install
$ node www/server
```

### Testing

You need to edit the test config file **test/config** and run:

```sh
$ npm test
```

### Documentation

You can see the API documentation on **doc/** folder. If you want to re-generate the documentation, you need to run this comand:

```sh
$ apidoc -i src/controllers
```

### Development

Want to contribute? Great!
Make a change in your file and instantanously see your updates!

License
----

Apache-2.0