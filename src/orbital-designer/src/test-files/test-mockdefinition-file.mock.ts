// tslint:disable-next-line: max-line-length
export default `{
    "metadata": {
        "title": "fdsfdsfdsfds",
        "description": ""
    },
    "openApi": {
        "swagger": "2.0",
        "info": {
            "version": "1.0.0",
            "title": "Swagger Petstore",
            "license": {
                "name": "MIT"
            }
        },
        "host": "petstore.swagger.io",
        "basePath": "/v1",
        "schemes": [
            "http"
        ],
        "consumes": [
            "application/json"
        ],
        "produces": [
            "application/json"
        ],
        "paths": {
            "/pets": {
                "get": {
                    "summary": "List all pets",
                    "operationId": "listPets",
                    "tags": [
                        "pets"
                    ],
                    "parameters": [
                        {
                            "name": "limit",
                            "in": "query",
                            "description": "How many items to return at one time (max 100)",
                            "required": false,
                            "type": "integer",
                            "format": "int32"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "A paged array of pets",
                            "headers": {
                                "x-next": {
                                    "type": "string",
                                    "description": "A link to the next page of responses"
                                }
                            },
                            "schema": {
                                "$ref": "#/definitions/Pets"
                            }
                        },
                        "default": {
                            "description": "unexpected error",
                            "schema": {
                                "$ref": "#/definitions/Error"
                            }
                        }
                    }
                },
                "post": {
                    "summary": "Create a pet",
                    "operationId": "createPets",
                    "tags": [
                        "pets"
                    ],
                    "responses": {
                        "201": {
                            "description": "Null response"
                        },
                        "default": {
                            "description": "unexpected error",
                            "schema": {
                                "$ref": "#/definitions/Error"
                            }
                        }
                    }
                }
            },
            "/pets/{petId}": {
                "get": {
                    "summary": "Info for a specific pet",
                    "operationId": "showPetById",
                    "tags": [
                        "pets"
                    ],
                    "parameters": [
                        {
                            "name": "petId",
                            "in": "path",
                            "required": true,
                            "description": "The id of the pet to retrieve",
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Expected response to a valid request",
                            "schema": {
                                "$ref": "#/definitions/Pets"
                            }
                        },
                        "default": {
                            "description": "unexpected error",
                            "schema": {
                                "$ref": "#/definitions/Error"
                            }
                        }
                    }
                }
            }
        },
        "definitions": {
            "Pet": {
                "type": "object",
                "required": [
                    "id",
                    "name"
                ],
                "properties": {
                    "id": {
                        "type": "integer",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    },
                    "tag": {
                        "type": "string"
                    }
                }
            },
            "Pets": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/Pet"
                }
            },
            "Error": {
                "type": "object",
                "required": [
                    "code",
                    "message"
                ],
                "properties": {
                    "code": {
                        "type": "integer",
                        "format": "int32"
                    },
                    "message": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "scenarios": [
        {
            "id": "b85fb424-cb32-4699-8e11-9bf1f6520bb0",
            "metadata": {
                "title": "fdsfdsfdsfds",
                "description": ""
            },
            "verb": 0,
            "path": "/pets",
            "response": {
                "headers": {},
                "body": "",
                "status": 200
            },
            "requestMatchRules": {
                "headerRules": [
                    {
                        "rule": {
                            "fdsfds": "fdsfdsfds"
                        },
                        "type": 4
                    },
                    {
                        "rule": {
                            "vcxvcx": "vxcvcxvx"
                        },
                        "type": 4
                    }
                ],
                "queryRules": [],
                "bodyRules": []
            },
            "policies": []
        }
    ]
}`;
