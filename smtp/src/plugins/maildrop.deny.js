exports.register = function () {
  const plugin = this;
  plugin.register_hook('queue', 'rcpt');
};

exports.rcpt = function(next, connection, params) {
  const plugin = this;
  const recipient = params[0]; // Get the recipient address

  // Allow emails to kodewith.me domain
  if (recipient && recipient.endsWith('@kodewith.me')) {
    return next(); // Allow this recipient
  }

  plugin.logwarn(`exports.rcpt ${JSON.stringify(params)}`);
  next(DENY, "Testing");
};
