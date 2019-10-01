import { Store } from 'rxjs-observable-store';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import { Metadata } from '../models/mock-definition/metadata.model';
import { Scenario } from '../models/mock-definition/scenario/scenario.model';
import { Injectable } from '@angular/core';
import { OpenAPIV2 } from 'openapi-types';

@Injectable()
export class MockDefinitionStore extends Store<MockDefinition> {
  constructor() {
    super(new MockDefinition());
  }

  /**
   * This method updates Metadata for the MockDefinition state
   * @param m The metadata representing the metadata of the MockDefinition state
   *
   */
  updateMetadata(m: Metadata): void {
    this.setState({
      ...this.state,
      metadata: m
    });
  }
  /**
   * This method updates the host,basepath and openAPI spec of the MockDefinition state
   * @param host The string representing the host
   * @param basePath The string representing endpoint path
   * @param openApi The string representing openSpecAPI file contents
   */

  updateApiInformation(
    host: string,
    basePath: string,
    openApi: OpenAPIV2.Document
  ): void {
    this.setState({
      ...this.state,
      host,
      basePath,
      openApi
    });
  }

  /**
   * This method updates scenario array for the MockDefinition state
   * @param s The scenario array representing the MockDefinition scenarios
   */

  updateScenarios(s: Scenario[]) {
    this.setState({
      ...this.state,
      scenarios: s
    });
  }
}
