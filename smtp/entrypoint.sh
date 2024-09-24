#!/bin/bash

HOST=${REDIS_HOST:-127.0.0.1}
PORT=${REDIS_PORT:-6379}
LOG=${LOG_LEVEL:-info}
ALTINBOX_MOD=${ALTINBOX_MOD:-1}

sed "/^stats_redis_host=/s/=.*/=${HOST}:${PORT}/" src/config/dnsbl.ini > tmpfile && mv tmpfile src/config/dnsbl.ini

sed "/^host=/s/=.*/=${HOST}/" src/config/greylist.ini > tmpfile && mv tmpfile src/config/greylist.ini
sed "/^port=/s/=.*/=${PORT}/" src/config/greylist.ini > tmpfile && mv tmpfile src/config/greylist.ini

sed "/^host=/s/=.*/=${HOST}/" src/config/redis.ini > tmpfile && mv tmpfile src/config/redis.ini
sed "/^port=/s/=.*/=${PORT}/" src/config/redis.ini > tmpfile && mv tmpfile src/config/redis.ini

sed "/^level=/s/=.*/=${LOG}/" src/config/log.ini > tmpfile && mv tmpfile src/config/log.ini

sed "/^altinbox=/s/=.*/=${ALTINBOX_MOD}/" src/config/altinbox.ini > tmpfile && mv tmpfile src/config/altinbox.ini

/usr/bin/supervisord
