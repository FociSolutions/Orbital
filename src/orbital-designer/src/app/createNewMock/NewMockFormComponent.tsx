import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import OpenAPISchemaValidator from 'openapi-schema-validator';
import yaml from 'js-yaml';

export interface Props {}

interface State {
  currentMockName: string;
  currentDescription?: string;
  fileName: string;
  openApiSpec: any;
}

class NewMockForm extends React.Component<Props, State> {
  fileInputRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentMockName: '',
      currentDescription: '',
      fileName: 'Choose file',
      openApiSpec: {}
    };

    this.onMockNameChange = this.onMockNameChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.fileInputRef = React.createRef();
  }

  onMockNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.info(e);
    this.setState({ currentMockName: e.target.value });
  }

  onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ currentDescription: e.target.value });
  }

  /**
   * Event handler for on OpenAPI spec file change event
   * @param e File change event
   */
  onFileChange(e: ChangeEvent<HTMLInputElement>) {
    var files = e.target.files;
    if (files && files.length > 0) {
      var file = files[0];
      this.setState({ fileName: file.name });
      var fileReader = new FileReader();
      fileReader.onload = () => {
        this.processFile(fileReader.result as string);
      };
      fileReader.readAsText(file);
    } else {
      this.setState({ fileName: 'Choose file' });
      var input = this.fileInputRef.current;
      if (input) {
        input.classList.remove('is-invalid');
      }
    }
  }

  /**
   * Check if the provided file is valid.
   * If it is valid, save to state, otherwise, display error.
   * @param content Content of OpenAPI spec file
   */
  processFile(content: string) {
    var input = this.fileInputRef.current;
    var validator = new OpenAPISchemaValidator({ version: 2 });
    if (content) {
      var spec = yaml.safeLoad(content);
      var result = validator.validate(spec);
      if (!result.errors || result.errors.length < 1) {
        this.setState({ openApiSpec: spec });
        if (input) {
          input.classList.remove('is-invalid');
        }
      } else if (input) {
        input.classList.add('is-invalid');
      }
    }
  }

  onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.info(e);
  }

  render() {
    return (
      <form className="needs-validation" onSubmit={this.onFormSubmit}>
        <div className="form-row mb-3">
          <label htmlFor="validationMockName">Mock Name</label>
          <input
            type="text"
            className="form-control"
            id="validationMockName"
            placeholder="Mock Name"
            onChange={this.onMockNameChange}
            required
          />
        </div>

        <div className="form-row mb-3">
          <label htmlFor="mockDescription">Description</label>
          <textarea
            rows={4}
            className="form-control"
            id="mockDescription"
            placeholder="Mock Description (optional)"
            onChange={this.onDescriptionChange}
          />
        </div>

        <div className="form-row mb-3">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">OpenAPI Spec</span>
            </div>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input form-control"
                accept=".yml,.yaml"
                id="openAPISpec"
                onChange={this.onFileChange}
                ref={this.fileInputRef}
                required
              />
              <label className="custom-file-label" htmlFor="openAPISpec">
                {this.state.fileName}
              </label>
              <div className="invalid-feedback mt-5 pt-2">
                Please provide a valid OpenAPI specification
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <button className="btn btn-light mr-2">
            <Link to="/">Go Back</Link>
          </button>
          <button className="btn btn-light ml-2" type="submit">
            <Link to="/endpointScenarioOverview"> Edit Mock Definition</Link>
          </button>
        </div>
      </form>
    );
  }
}

export default NewMockForm;
