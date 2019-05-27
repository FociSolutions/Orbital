import React from 'react';
import { Link, Redirect, } from "react-router-dom";
import { sendImportFile } from '../composeMock/duck/actions';
import { ImportFileState } from '../composeMock/duck/types';
import { connect } from 'react-redux';
import { AppState } from '../common/stores/store';

interface HomeProps{
  sendImportFile: typeof sendImportFile;
  importmockfile: ImportFileState;
}

class Home extends React.Component<HomeProps>{
  
    handleFile(selectorFile: FileList | null) {
      if(selectorFile != null){
        let fileReader = new FileReader();
        fileReader.onloadend = () => {
          let content = fileReader.result;
          this.props.sendImportFile({file: content, filename: selectorFile[0].name});
         
        }
        fileReader.readAsText(selectorFile[0]);
      }
    }
    render(){
       if (this.props.importmockfile.mockfiles[0] != null) return <Redirect to={{pathname: "/ComposeMock"}}/>;
        return(
         
            <div className="container">
            <div className="text-center">                                  
                <button className="btn btn-light mb-3"> 
                  <Link to="/CreateNewMock">New Mockservice</Link>
                </button>                                
            </div>
            <div className="text-center">
              <h4>Import Existing Mockservice</h4>
              <input type="file" accept=".yaml, .yml" id="file" onChange={(e) => this.handleFile(e.target.files)}></input>
            </div>
          </div>
        );
    }
}
const mapStateToProps = (state: AppState) => ({
  importmockfile: state.importmockfile
}); 

const mapDispatchToProps = {
  sendImportFile
};
 
export default connect(mapStateToProps,mapDispatchToProps)(Home);