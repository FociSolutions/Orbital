import React from 'react';
import NewMockTitle from './NewMockTitleComponent';
import NewMockForm from './NewMockFormComponent';

class CreateNewMock extends React.Component {
  render() {
    return (
      <div className="CreateNewMock">
        <div className="container">
          <NewMockTitle />
          <NewMockForm />
        </div>
      </div>
    );
  }
}

export default CreateNewMock;
