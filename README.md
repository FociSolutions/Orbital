# What is Orbital?

Orbital is an HTTP mocking solution composed of two entities: the mock designer and the mock server. The mocking designer is a web-based worksapce that allows for quick creation and modification of mocks. The mock server consumes these mocks to provide developers with a mocked back-end service.

# Why should you use Orbital?

Orbital allows for parallel developement between front-end and back-end teams by reducing the dependency of the front-end on the back-end.

Normally, creating a back-end API takes many days, if not weeks. During this time, front-end developers have changing API contracts, and have to develop against a moving target. 

## Features

- GUI Editor: an easy-to-use web-editor that allows developers to create mocks in minutes
- Export to Server: directly export your mocks to Orbital Server
- OpenAPI compliant: mocks are created using the OpenAPI v2.0 specification
- Pipeline: each API filter is isolated, allowing for greater security, and better error and load handling
- Easy to deploy: just two docker containers, and only two commands to run

# Getting Started 

**Note: Orbital uses an in-memory datastore. Please save or export all data (via Export to JSON or Export to Server) before exiting, otherwise it will be lost.**

It's very easy to get started; just [download the Docker Engine for Linux, Mac, and Windows](https://hub.docker.com/?overlay=onboarding):

## Using Docker

`docker run -p 4200:80 fociopensource/orbitaldesigner`

`docker run -p 4201:3971 fociopensource/orbitalmock`

The mock definition designer will be running on `http://localhost:4200`, and the server on `http://localhost:4201`.

## Using Docker Compose

Install [Docker Compose](https://docs.docker.com/compose/install/)

`git clone https://github.com/FociSolutions/Orbital.git`

`cd Orbital`

`docker-compose build`

`docker-compose up`

# Build From the source

## Requirements

If you're running Linux, you'll need:

- the [Linux .NET runtime](https://dotnet.microsoft.com/download/linux-package-manager/rhel/runtime-current)
- the [Linux npm and the NodeJS package manager](https://nodejs.org/en/download/package-manager/)
- git via `apt-get install git`

If you're running Windows, you'll need:

- the [Windows .NET runtime](https://dotnet.microsoft.com/download/thank-you/dotnet-runtime-2.2.7-windows-hosting-bundle-installer)
- the [Windows npm and the NodeJS package manager](https://nodejs.org/en/download/)
- the Git [.exe installer for Windows](https://git-scm.com/download/win)

## Clone

`git clone https://github.com/FociSolutions/Orbital.git`

## Server

`cd Orbital/src/Orbital.Mock.Server`

`dotnet run` (defaults to http://localhost:5000)

## Designer

`cd Orbital/src/orbital-designer/src`

`npm install`

`npm install -g @angular/cli@8`

`ng serve` (defaults to http://localhost:4200)
