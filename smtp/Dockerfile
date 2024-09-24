FROM node:latest

RUN apt-get update
RUN apt-get -y install bsdtar dnsutils bind9 supervisor sed

COPY --chown=root:bind named.conf.options /etc/bind/

RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN mkdir -p /maildrop/src
COPY src /maildrop/src
COPY package.json /maildrop/
COPY package-lock.json /maildrop/
RUN cd /maildrop && npm i

COPY entrypoint.sh /maildrop/
COPY stop-supervisor.sh /maildrop/
RUN chmod a+rx /maildrop/entrypoint.sh /maildrop/stop-supervisor.sh

EXPOSE 25/tcp 8081/tcp

WORKDIR /maildrop
ENTRYPOINT ["./entrypoint.sh"]
