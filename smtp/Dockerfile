FROM ubuntu:latest

# Update the package list
RUN apt-get update

# Install necessary packages including Node.js and npm
RUN apt-get -y install libarchive-tools dnsutils bind9 supervisor sed nodejs npm

# Copy BIND configuration
COPY --chown=root:bind named.conf.options /etc/bind/

# Set up Supervisor
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy application source code and package files
RUN mkdir -p /maildrop/src
COPY src /maildrop/src
COPY package.json /maildrop/
COPY package-lock.json /maildrop/

# Install Node.js dependencies
RUN cd /maildrop && npm i

# Copy entrypoint scripts and give them execute permissions
COPY entrypoint.sh /maildrop/
COPY stop-supervisor.sh /maildrop/
RUN chmod a+rx /maildrop/entrypoint.sh /maildrop/stop-supervisor.sh

# Expose necessary ports
EXPOSE 465/tcp 8081/tcp

# Set working directory
WORKDIR /maildrop

# Set the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
