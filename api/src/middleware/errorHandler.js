function errorHandler(err, req, res, next) {
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    return res.status(413).json({
      success: false,
      message: 'Request payload is too large. Please upload a smaller image and try again.',
    });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: 'Internal server error' });
}

module.exports = {
  errorHandler,
};
