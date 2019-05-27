import React from 'react';

class EditScenario extends React.Component {
  render() {
    return (
      <div className="col-8">
        <div className="row m-2">
          <label>
            <h2>Scenario Name</h2>
          </label>
        </div>
        <div className="row m-2">
          <label>
            <h2>Request</h2>
          </label>
        </div>
        <form>
          <div className="scenarioBorder">
            <div className="form-row m-3">
              <div className="form-group col-sm-4">
                <label htmlFor="headerkey">Header Key</label>
                <input
                  className="form-control "
                  defaultValue="Content-type"
                  id="headerkey"
                />
              </div>
              <div className="form-group col-sm-4">
                <label htmlFor="headervalue">Header Value</label>
                <input
                  className="form-control "
                  defaultValue="application/json"
                  id="headervalue"
                />
              </div>
            </div>
            <div className="form-group row m-3">
              <label className="col-form-label" htmlFor="bodyrequest">
                Body
              </label>
              <textarea className="form-control" id="bodyrequest" rows={4} />
            </div>
          </div>
          <div className="row m-2">
            <label>
              <h2>Response</h2>
            </label>
          </div>
          <div className="scenarioBorder">
            <div className="row col-sm-4 m-2">
              <label>Response Type</label>
              <select className="custom-select" id="inputGroupSelect01">
                <option selected>Choose...</option>
                <option value="1">Mock</option>
                <option value="2">Falt</option>
                <option value="3">Proxy</option>
              </select>
            </div>
            <div className="form-row m-3">
              <div className="form-group col-sm-4">
                <label htmlFor="headerkey">Header Key</label>
                <input
                  className="form-control "
                  defaultValue="Content-type"
                  id="headerkey"
                />
              </div>
              <div className="form-group col-sm-4">
                <label htmlFor="headervalue">Header Value</label>
                <input
                  className="form-control "
                  defaultValue="application/json"
                  id="headervalue"
                />
              </div>
              <div className="form-group  col-sm-4">
                <label>Status </label>
                <input className="form-control" type="number" />
              </div>
            </div>
            <div className="form-group row m-3">
              <label className="col-form-label" htmlFor="bodyrequest">
                Body
              </label>
              <textarea className="form-control" id="bodyrequest" rows={4} />
            </div>
          </div>
          <div className="row">
            <div className="m-2">
              <button className="btn btn-primary btn-md" type="submit">
                Save Scenario
              </button>
            </div>
            <div className="m-2">
              <button className="btn btn-danger btn-md" type="submit">
                Delete Scenario
              </button>
            </div>
            <div className="col-md-4" />
            <div className="m-2">
              <button className="btn btn-light btn-md">Export Mock File</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default EditScenario;
