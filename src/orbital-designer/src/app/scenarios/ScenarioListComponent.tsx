import React from 'react';

class ScenarioList extends React.Component {
  render() {
    return (
      <div className="list-group" id="list-tab" role="tablist">
        <h2>Endpoint Selected</h2>
        <h2>Scenarios</h2>
        <a
          className="list-group-item list-group-item-action active"
          id="list-home-list"
          data-toggle="list"
          href="#list-home"
          role="tab"
          aria-controls="home"
        >
          Home
        </a>
        <a
          className="list-group-item list-group-item-action"
          id="list-profile-list"
          data-toggle="list"
          href="#list-profile"
          role="tab"
          aria-controls="profile"
        >
          Profile
        </a>
        <a
          className="list-group-item list-group-item-action"
          id="list-messages-list"
          data-toggle="list"
          href="#list-messages"
          role="tab"
          aria-controls="messages"
        >
          Messages
        </a>
        <a
          className="list-group-item list-group-item-action"
          id="list-settings-list"
          data-toggle="list"
          href="#list-settings"
          role="tab"
          aria-controls="settings"
        >
          Settings
        </a>
      </div>
    );
  }
}

export default ScenarioList;
