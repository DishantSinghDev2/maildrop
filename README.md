Maildrop
========

See [Maildrop in action](https://maildrop.cc).

Maildrop is an open-source, scalable, high-performance version of Mailinator,
a "temporary inbox" that you can give out when you don't want to give out
your real e-mail address. Maildrop inboxes are designed to be quick and
disposable.

The design goals are to be roughly 90% of the speed of Mailinator, while
adding additional functionality and the ability to horizontally scale
quickly and easily.

Maildrop uses Haraka for its SMTP server, running inside a 
[Docker container](https://hub.docker.com/r/mark242/maildrop-smtp).
Currently this container is deployed to Amazon ECS and has an
auto-scaling policy to allow it to scale elastically.

The website is written as a React application, allowing for deployment
to an S3 bucket or other static host. The backend API uses the
[Serverless framework](https://serverless.com) to create Lambda functions
that automatically scale based on usage.

Maildrop is written mainly in Typescript. Functionality includes:

* Antispam modules contributed from [Heluna](https://heluna.com/) for
senders and data
* 90% of all spam attempts rejected
* Network blacklists
* IP connection and message subject limiting
* Reputation-based blocking
* SPF checking
* Greylisting
* Alternate inbox aliases
* Strip message attachments
* Message size limits
* SMTP configuration done in one file
* Easy-to-modify website, written in React


Requirements
------------

* [Docker](https://docker.com) hosting, eg [AWS ECS](https://aws.amazon.com)
* [Redis 4.0+](https://redis.io/) or [AWS Elasticache](https://aws.amazon.com)
* [AWS Lambda](https://aws.amazon.com/)
* [NPM](https://nodejs.org)



Installation
------------

### Install prerequisites

Install Docker, Node/NPM, Redis, and decide on how you will serve your containers.
Maildrop uses Amazon ECS.

### Clone the repository into a local directory

This will give you four subdirectories, "api" is the serverless API backend,
"infrastructure" is a set of terraform scripts to set up your own infrastructure,
"smtp" is the mail transfer agent, and "web" is the website.

### (Optionally) Create the AWS infrastructure

First, install [Terraform](https://terraform.io). Then go into "infrastructure" and
run "terraform apply". This will guide you through creating your infrastructure.
 
### Create the SMTP server

Go into "smtp" and run "docker build -t your-image:latest". This will create a Docker
image of the Maildrop SMTP server.

### Create the API backend

Go into "api" and run "npm i" then "npm run compile && npm run deploy". This
will generate the Lambda functions needed for the website.

### Create the web server

Go into "web" and run "npm start". This will create a directory of the Maildrop
website.

To build a production website, run "npm run build".


Changelog
---------

Version 3.0 is a complete rewrite.

* The API is now Lambda functions running through API Gateway, written in Typescript.
* The infrastructure directory defines all the pieces to run Maildrop, written in Terraform.
* The SMTP directory has a customized version of Haraka to run inside a Docker container, written in Javascript.
* The web directory is a React app that can be deployed anywhere.
