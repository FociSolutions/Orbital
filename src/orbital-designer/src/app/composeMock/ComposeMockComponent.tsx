import React from 'react';
import { ImportFileState } from './duck/types';
import { connect } from 'react-redux';
import { AppState } from '../common/stores/store';
import { GoBackToStart } from '../composeMock/duck/actions';
import { Link } from 'react-router-dom';

interface ImportedMockFilesProps {
  GoBackToStart: typeof GoBackToStart;
  mockfileState: ImportFileState;
}
class ImportMock extends React.Component<ImportedMockFilesProps> {
  render() {
    return (
      <div className="Import Project">
        <div className="container">
          <div>
            <h3>Import Project</h3>
          </div>
          <p>{this.props.mockfileState.mockfiles[0].file}</p>
        </div>
        <div className="form-row">
          <button className="btn btn-light mr-2">
            <Link
              to="/"
              onClick={() => {
                this.props.GoBackToStart();
              }}
            >
              Go Back
            </Link>
          </button>
          <button className="btn btn-light ml-2" type="submit">
            <Link to="/endpointScenarioOverview"> Edit Mock Definition</Link>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  mockfileState: state.importmockfile
});

const mapDispatchToProps = {
  GoBackToStart
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportMock);
