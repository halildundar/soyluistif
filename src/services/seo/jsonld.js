export const jsonLdMiddleware = (req, res, next)=> {
  res.locals.jsonLd = [];

  // JSON-LD eklemek için helper
  res.addJsonLd = function (data) {
    if (typeof data === "object") {
      res.locals.jsonLd.push(data);
    }
  };

  next();
}