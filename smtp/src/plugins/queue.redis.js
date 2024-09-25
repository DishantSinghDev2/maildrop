const shortid = require('shortid');
const simpleParser = require('mailparser').simpleParser;

let dateformat; // Declare dateformat outside the functions

async function loadDependencies() {
  // Dynamically import the dateformat module
  dateformat = (await import('dateformat')).default;
}

exports.register = function() {
  const plugin = this;
  plugin.load_ini();
  plugin.register_hook('queue', 'save_to_redis');

  // Load the dateformat dependency when the plugin is registered
  loadDependencies().catch(err => {
    plugin.logerror("Error loading dependencies: " + err);
  });
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
      simpleParser(body, async (error, parsed) => {
        if (error) {
          plugin.logerror("Error parsing email: " + error);
          return next(OK);
        }

        for (const recipient of recipients) {
          const destination = recipient.user.toLowerCase();
          const key = `mailbox:${destination}`;
          const message = {
            id: shortid.generate(),
            from: parsed.from.text,
            to: destination,
            subject: parsed.headers.get('subject'),
            date: `${dateformat(new Date(), "isoDateTime")}`.replace("+0000", "Z")
          };
          let html = parsed.html || parsed.textAsHtml;
          const messageBody = Object.assign({}, message, { body: body, html: html });
          plugin.logwarn("Saving message from " + connection.transaction.mail_from.original + " to " + destination);
          redis.lpush(key, JSON.stringify(message));
          redis.lpush(key + ":body", JSON.stringify(messageBody));
          redis.ltrim(key, 0, mailbox_size);
          redis.ltrim(key + ":body", 0, mailbox_size);
          redis.expire(key, mailbox_ttl);
          redis.expire(key + ":body", mailbox_ttl);
        }
        next(OK);
      });
    });
    stream.resume();
  }
};
