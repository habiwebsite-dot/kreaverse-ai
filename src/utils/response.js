function success(res, data, message = 'OK') { res.json({ success: true, message, data }); }
function error(res, message, statusCode = 400) { res.status(statusCode).json({ success: false, message }); }
module.exports = { success, error };