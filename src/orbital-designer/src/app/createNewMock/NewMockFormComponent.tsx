import React, { ChangeEvent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Metadata } from '../common/models/mockDefinition/Metadata';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './duck/Container';
import read from '../common/services/FileProcessService';
import { toOpenApiSpec } from '../common/models/mockDefinition/MockDefinition';

export interface Props {
  onMetadata?: (m: Metadata) => void;
  onOpenApi?: (s: string) => void;
  onHost?: (s: string) => void;
  onBasePath?: (s: string) => void;
}

interface State {
  currentMockName: string;
  currentDescription: string;
  fileName: string;
  openApiSpec: string;
  host: string;
  basePath: string;
  redirect: boolean;
}

class NewMockForm extends React.Component<Props, State> {
  fileInputRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentMockName: '',
      currentDescription: '',
      fileName: 'Choose file',
      openApiSpec: '',
      host: '',
      basePath: '',
      redirect: false
    };

    this.onMockNameChange = this.onMockNameChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.fileInputRef = React.createRef();
  }

  /**
   * Event handler for mock title onChange event
   * @param e Input change event
   */
  onMockNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ currentMockName: e.target.value });
  }

  /**
   * Event handler for mock description onChange event
   * @param e Input change event
   */
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
      read(file).then(contentString => {
        toOpenApiSpec(contentString).then(
          result =>
            this.setOpenApiInfo(contentString, result.host, result.basePath),
          _err => this.showFileError()
        );
      });
    } else {
      this.setState({ fileName: 'Choose file' });
      this.hideFileError();
    }
  }

  /**
   * Event handler for form onSubmit event
   * @param _e Submit event
   */
  onFormSubmit(_e: React.FormEvent<HTMLFormElement>) {
    if (this.props.onMetadata) {
      this.props.onMetadata({
        title: this.state.currentMockName,
        description: this.state.currentDescription
      });
    }

    if (this.props.onHost) {
      this.props.onHost(this.state.host);
    }

    if (this.props.onBasePath) {
      this.props.onBasePath(this.state.basePath);
    }

    if (this.props.onOpenApi) {
      this.props.onOpenApi(this.state.openApiSpec);
    }

    this.setState({ redirect: true });
  }

  /**
   * Set the open api information in the component stat and hide file error
   * @param openApiSpec String representation of OpenAPI spec
   * @param hostInfo Host information from openAPI spec
   * @param basePathInfo Base path information from openAPI spec
   */
  setOpenApiInfo(
    openApiSpec: string,
    hostInfo?: string,
    basePathInfo?: string
  ) {
    this.setState({
      openApiSpec: openApiSpec,
      host: hostInfo ? hostInfo : '',
      basePath: basePathInfo ? basePathInfo : ''
    });
    this.hideFileError();
  }

  /**
   * Show error message for read file
   */
  showFileError() {
    var input = this.fileInputRef.current;
    if (input) {
      input.classList.add('is-invalid');
    }
  }

  /**
   * Hide error message for read file
   */
  hideFileError() {
    var input = this.fileInputRef.current;
    if (input) {
      input.classList.remove('is-invalid');
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={{ pathname: '/endpointScenarioOverview' }} />;
    }
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
          <Link className="btn btn-light mr-2" to="/">
            Go Back
          </Link>
          <button className="btn btn-light ml-2" type="submit">
            Edit Mock Definition
          </button>
        </div>
      </form>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewMockForm);
