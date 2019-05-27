import {IMPORT_FILE, MockFile, GO_BACK} from './types';

export function sendImportFile(file: MockFile){
    return {
        type : IMPORT_FILE,
        mockfileimported: file
    };
}

export function GoBackToStart(){
    return{
        type: GO_BACK
    };
}