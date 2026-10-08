export const asyncHandler = (controller) => {   //the asyncHandler catches Promise rejections from async controllers.
  return (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
};