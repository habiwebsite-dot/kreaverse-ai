const success = (res, data, message = 'Berhasil', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const error = (res, message = 'Terjadi kesalahan', statusCode = 500, details = null) => {
  const payload = { success: false, message };
  if (details && process.env.NODE_ENV !== 'production') payload.details = details;
  return res.status(statusCode).json(payload);
};

const paginated = (res, data, pagination) => {
  return res.status(200).json({ success: true, data, pagination });
};

module.exports = { success, error, paginated };