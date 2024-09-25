const shortid = require('shortid');
const format = require('date-fns').format;
const simpleParser = require('mailparser').simpleParser;

exports.register = function() {
  const plugin = this;
  plugin.load_ini();
  plugin.register_hook('queue', 'save_to_redis');
};

exports.load_ini = function() {
  const plugin = this;
  plugin.cfg = plugin.config.get('queue.redis.ini', () => {
    plugin.load_ini();
  });
};

exports.save_to_redis = function(next, connection) {
  const plugin = this;
  const redis = connection.server.notes.redis;
  const stream = connection.transaction.message_stream;
  const recipients = connection.transaction.rcpt_to;

  plugin.cfg = plugin.config.get('queue.redis.ini');

  const mailbox_size = ((plugin.cfg.main || {}).mailbox_size || 10) - 1;
  const mailbox_ttl = ((plugin.cfg.main || {}).mailbox_ttl || 3600);

  // plugin.loginfo("Maildrop.cc plugin");
  plugin.logdebug(JSON.stringify(recipients));

  if (!!redis) {
    const chunks = [];
    let body = "";
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      body = Buffer.concat(chunks).toString();
      plugin.logdebug("have body: " + body);
      simpleParser(body, (error, parsed) => {
        recipients.forEach((recipient) => {
          const destination = recipient.user.toLowerCase();
          const key = `mailbox:${destination}`;
          const message = {
            id: shortid.generate(),
            from: parsed.from.text,
            to: destination,
            subject: parsed.headers.get('subject'),
            date: `${format(new Date(), "isoDateTime")}`.replace("+0000","Z")
          };
          let html;
          if (!!parsed.html) {
            html = parsed.html;
          } else {
            html = parsed.textAsHtml;
          }
          const messageBody = Object.assign({}, message, {body: body, html: html});
          plugin.logwarn("Saving message from " + connection.transaction.mail_from.original + " to " + destination);
          redis.lpush(key, JSON.stringify(message));
          redis.lpush(key + ":body", JSON.stringify(messageBody));
          redis.ltrim(key, 0, mailbox_size);
          redis.ltrim(key + ":body", 0, mailbox_size);
          redis.expire(key, mailbox_ttl);
          redis.expire(key + ":body", mailbox_ttl);
        });
        next(OK);
      });
    });
    stream.resume();
  }
};