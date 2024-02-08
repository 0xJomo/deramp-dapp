module.exports = function (app) {
  app.use(function (req, res, next) {
    if (req.path === "/buy" || req.path.startsWith("/pkg-mt") || req.path === "/workerHelper.js" || req.path === "/wasm_worker.js") {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
    next();
  });
};