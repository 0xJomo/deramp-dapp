module.exports = function (app) {
  app.use(function (req, res, next) {
    // res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    // res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    // res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    // res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Origin-Trial", "ApjTt2pwtHq0i1v3l9YaUm0zN+1BitDXpwbt2eHsB0rBPHY3eEjMNNIkVyPCfqkkz0yDDihriQ1sR4pl7OAYwwsAAABgeyJvcmlnaW4iOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJmZWF0dXJlIjoiVW5yZXN0cmljdGVkU2hhcmVkQXJyYXlCdWZmZXIiLCJleHBpcnkiOjE3MTkzNTk5OTl9")
    next();
  });
};