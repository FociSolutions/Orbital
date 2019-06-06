import React from 'react';
import { Link } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from './duck/Container';
import { connect } from 'react-redux';

export interface Props {
  goBackToHome?: () => void;
}

class BottomNavigation extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  goBack(){
    if(this.props.goBackToHome){
    this.props.goBackToHome();
    }
  }
  
  render() {
    return (
      <div className="form-row">
        <button className="btn btn-light mr-2" onClick={this.goBack}>
          <Link to="/">Go Back</Link>
        </button>
        <button className="btn btn-light ml-2`" type="submit" >
          <Link to="/Scenarios"> Edit Scenario</Link>
        </button>
        <div className="col-md-8" />
        <button className="btn btn-light ml-2" type="submit">
          Export Mock File
        </button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomNavigation);
