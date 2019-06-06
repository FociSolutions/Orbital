import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { MockDefinition } from '../common/models/mockDefinition/MockDefinition';
import { mapStateToProps, mapDispatchToProps } from './duck/Container';
import { Redirect } from 'react-router-dom';
import { readMockDefinition } from '../common/services/FileProcessService';

export interface Props {
  mockDefinition?: MockDefinition;
  onImport?: (mockDefinition: MockDefinition) => void;
}

interface State {
  fileName: string;
  redirect: boolean;
}

class ImportExistingMock extends React.Component<Props, State> {
  fileInputRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      fileName: 'Choose file',
      redirect: false
    };

    this.fileInputRef = React.createRef();
    this.onFileChange = this.onFileChange.bind(this);
  }

  /**
   * Event handler for on mock definition file change event
   * @param e File change event
   */
  onFileChange(e: ChangeEvent<HTMLInputElement>) {
    var files = e.target.files;
    if (files && files.length > 0) {
      var file = files[0];
      this.setState({ fileName: file.name });
      readMockDefinition(file).then(
        content => this.onFileRead(content),
        _err => this.showImportError()
      );
    } else {
      this.setState({ fileName: 'Choose file' });
      this.hideImportError();
    }
  }

  /**
   * Update redux store, set redirect to true, and hide import error
   * @param mockDefinition MockDefinition
   */
  onFileRead(mockDefinition: MockDefinition) {
    if (this.props.onImport) {
      this.props.onImport(mockDefinition);
      this.hideImportError();
      this.setState({ redirect: true });
    }
  }

  /**
   * Show error message for import file
   */
  showImportError() {
    var input = this.fileInputRef.current;
    if (input) {
      input.classList.add('is-invalid');
    }
  }

  /**
   * Hide error message for import file
   */
  hideImportError() {
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
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">Import Existing Mock</span>
        </div>
        <div className="custom-file">
          <input
            type="file"
            className="custom-file-input form-control"
            accept=".yml,.yaml"
            id="mockDefinitionFile"
            onChange={this.onFileChange}
            ref={this.fileInputRef}
            required
          />
          <label className="custom-file-label" htmlFor="mockDefinitionFile">
            {this.state.fileName}
          </label>
          <div className="invalid-feedback mt-5 pt-2">
            Please provide a valid Mock Definition
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportExistingMock);
