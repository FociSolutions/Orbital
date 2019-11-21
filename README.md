# What is Orbital?

Orbital is an HTTP mocking framework that enables teams to achieve rapid software development and testing. Orbital supports mocking services by only providing their  OpenAPI Specifications files in either YAML or JSON format. The framework is  composed of two entities: the Orbital Designer and the Orbital Server. The Designer is a web-based workspace that allows for quick creation and modification of mock scenarios using the desired OpenAPI Specification file. The Designer can be used to export the mock service scenarios to the Server. Besides accepting and storing service mock definitions the Server is capable of of intercepting HTTP requests and response with the best response possible based on the saved mocked service scenarios. The Server also has reserved Admin endpoints to provide the ability to add, edit, delete mock definition files.

# Why should you use Orbital?

Orbital allows for parallel development between front-end and back-end teams by reducing the dependency of the front-end on the back-end.

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

`docker run -p 4200:80 focisolutions/orbitaldesigner`

`docker run -p 5001:80 focisolutions/orbitalmock`

The mock definition designer will be running on `http://localhost:4200`, and the server on `http://localhost:5001`.

## Using Docker Compose

Install [Docker Compose](https://docs.docker.com/compose/install/)

`git clone https://github.com/FociSolutions/Orbital.git`

`cd Orbital`

`docker-compose build`

`docker-compose up -d`

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

`npm run build`

`npm run start` (defaults to http://localhost:4200)

# How to use the Orbital Designer
## Create a new mock

1. Go to the [Orbital Designer homepage](http://localhost:4200) and click **"Create New Mock"**.

2. Enter in a title and description for the new mock.

3. Click **"Select File"** and provide a valid OpenAPI YAML file. For this guide, [OpenAPI petstore](https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v2.0/yaml/petstore.yaml) is used. Download this file and provide it to the file selector.

4. Click **"Next"**.

5. The following endpoint view page will be displayed:

![endpointoverview](/readme_images/endpointoverview.png)

This page will display all endpoints defined in the uploaded YAML file. On the right of each row, the number of existing scenarios are indicated.

The next step in this guide will be to create a new scenario.

### What is a Scenario?
The purpose of a scenario is to describe what the endpoint will expect from the user's HTTP request and the response the user should expect from the endpoint. A scenario consists of:
* **Metadata**: A title and description to explain the purpose of the scenario.
* **Request Match Rules**: These rules will indicate what the user's HTTP request has to match to get a response from the server.
* **Response**: The server's response to the user's HTTP request.

### Create a Scenario

1. Select the endpoint GET/pets. The scenario overview page will be shown.

2. Click **"+"** on the bottom right to add a new scenario.

3. Start by filling the **"Metadata"** section. Give the new scenario a name and description. The name is required.
![newScenarioMetadata](/readme_images/newScenarioMetadata.png)

4. Click **"Request Match Rules"** and click **"Header Match Rules"**. Enter in *"Content-Type"* as the key and value *"application/json"*.

5. Click **"+"** to the right of the newly entered entry. The entry will appear below.
![headerMatchRule](/readme_images/headerMatchRule.png)

6. A response has to be defined for this header rule. Click **Response** and enter in the text as shown in this image. In this example, the server will return a 200 with a simple json body like the following:
![response](/readme_images/newScenarioResponse.png)
```
{
	"pet1": "max"
}
```

7. Click **"Save"**.

8. Click **"Back to Endpoints"** to continue to the next step and click **"Confirm"** to discard any unsaved changes since saving. The new scenario will be listed in the scenario view page.

### Export Mock to Orbital Server

To prove that the new scenario works, the mock should be exported to the Orbital Server. At the bottom of the endpoints overview, there is a field to fill in to upload the current mock being modified. Fill in the field with the following URL **"https://localhost:5001/api/v1/OrbitalAdmin"** and click **"Upload"**.

If the upload is successful, the message *"Mockdefinition successfully uploaded to server"* will appear.

### Test the Scenario

For this example, the following postman request is used:

![postman](/readme_images/postmanRequest.png)

This request complies with the header rule created previously. After sending it to the server, the following is the response we get back:

![postmanResponse](/readme_images/postmanResponse.png)