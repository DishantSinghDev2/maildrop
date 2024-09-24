exports.register = function () {
  const plugin = this;
  plugin.register_hook('queue', 'rcpt');
};

exports.rcpt = function(next, connection, params) {
  const plugin = this;
  plugin.logwarn(`exports.rcpt ${JSON.stringify(params)}`);
  next(DENY, "Testing");
};
