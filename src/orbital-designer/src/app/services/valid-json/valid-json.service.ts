import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class ValidJsonService {
  JSON_SCHEMA_DRAFT_3 = `{
	"$schema" : "http://json-schema.org/draft-03/hyper-schema#",
	"extends" : {"$ref" : "http://json-schema.org/draft-03/schema#"},
	"id" : "http://json-schema.org/draft-03/hyper-schema#",

	"properties" : {
		"links" : {
			"type" : "array",
			"items" : {
                "$schema" : "http://json-schema.org/draft-03/hyper-schema#",
                "id" : "http://json-schema.org/draft-03/links#",
                "type" : "object",
                
                "properties" : {
                    "href" : {
                        "type" : "string",
                        "required" : true
                    },
                    
                    "rel" : {
                        "type" : "string",
                        "required" : true
                    },
                    
                    "targetSchema" : {"$ref" : "http://json-schema.org/draft-03/hyper-schema#"},
                    
                    "method" : {
                        "type" : "string",
                        "default" : "GET"
                    },
                    
                    "enctype" : {
                        "type" : "string",
                        "requires" : "method"
                    },
                    
                    "properties" : {
                        "type" : "object",
                        "additionalProperties" : {"$ref" : "http://json-schema.org/draft-03/hyper-schema#"}
                    }
                }
            }
		},
		
		"fragmentResolution" : {
			"type" : "string",
			"default" : "slash-delimited"
		},
		
		"root" : {
			"type" : "boolean",
			"default" : false
		},
		
		"readonly" : {
			"type" : "boolean",
			"default" : false
		},
		
		"contentEncoding" : {
			"type" : "string"
		},
		
		"pathStart" : {
			"type" : "string",
			"format" : "uri"
		},
		
		"mediaType" : {
			"type" : "string"
		}
	},
	
	"links" : [
		{
			"href" : "{id}",
			"rel" : "self"
		},
		
		{
			"href" : "{$ref}",
			"rel" : "full"
		},
		
		{
			"href" : "{$schema}",
			"rel" : "describedby"
		}
	],
	
	"fragmentResolution" : "slash-delimited"
}
`;
  constructor(private logger: NGXLogger) {}

  /**
   * Checks if the provided JSON string is valid
   * @param json The JSON to validate
   */
  isValidJSON(json: string): boolean {
    return !!this.parseJSONOrDefault<boolean>(json, false);
  }

  /**
   * Returns a valid JSON object if the JSON can be parsed, otherwise the default value
   * @param json The JSON to parse
   * @param defaultValue The default value to return if the string cannot be parsed
   */
  parseJSONOrDefault<T>(json: string, defaultValue: T): T {
    try {
      return JSON.parse(json);
    } catch (e) {
      this.logger.error('Invalid JSON file', e);
      return defaultValue;
    }
  }

  /**
   * Checks if a schema is valid according to "Schema Draft 3"
   * @param json The JSON schema to validate
   */
  validateSchema(json: string): boolean {
    var Ajv = require('ajv');
    var ajv = new Ajv({schemaId: 'id'});

    ajv.addSchema(JSON.parse(this.JSON_SCHEMA_DRAFT_3), 'json-draft-3');
    
    return ajv.validate(JSON.parse(json));
  }
}
