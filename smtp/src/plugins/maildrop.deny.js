exports.register = function () {
  const plugin = this;
  plugin.register_hook('rcpt','rcpt');
  plugin.register_hook('rcpt_ok','rcpt');
};

exports.rcpt = function(next, connection, params) {
  const plugin = this;
  plugin.logwarn('params',params, "connection",connection)

  // Check if params is defined and has at least one element
  if (!params || params.length === 0) {
    plugin.logwarn('No recipient provided');
    return next(DENY, "No recipient provided");
  }

  const recipient = params[0]; // Get the recipient address

  // Allow emails to kodewith.me domain
  if (recipient && recipient.endsWith('@kodewith.me')) {
    return next(); // Allow this recipient
  }

  plugin.logwarn(`exports.rcpt ${JSON.stringify(params)}`);
  next(DENY, "NOT ALLOWED");
};
