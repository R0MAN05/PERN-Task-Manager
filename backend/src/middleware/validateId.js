export const validateId = (paramName, resourceName) => {
  return (req, res, next) => {
    const id = Number(req.params[paramName]);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: `Invalid ${resourceName} ID`,
      });
    }

    req.params[paramName] = id;

    next();
  };
};