# Orbital Mock Server testing setup for Postman and Newman

## Overview

Integration testing is a great way to ensure that your code is working as expected. Testing with external services like Postman and Newman is one of the possible approaches.

Postman collection for Orbital Mock Server CRUD methods is available in this repository.


## Features

- Postman collection allows you to test your API with Postman locally, with Newman in CLI or as part of CI/CD pipeline.

- CRUD operations are being tested with the sample mock definition available in the POST method body.

- Integration tests written in Chai


## Running the project

- To run collection in Postman, open Postman collection json file in Postman, build the server and run the project. By default URL variable is set to https://localhost:5001/api/v1/OrbitalAdmin

To run collection locally in CLI with Newman:
- Install Newman globally by running the command ````npm i newman -g;````
- Cd into directory of the Orbital Postman collection
- Run the Orbital server
- Run the following command ````newman run OrbitalAdmin.postman_collection.json -k;````

For more information on how to use Newman with Postman collections check [this link](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/#:~:text=Newman%20is%20a%20command%2Dline,integration%20servers%20and%20build%20systems.)