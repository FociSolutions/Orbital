import {IMPORT_FILE, ImportFileState, ImportFileTypes, GO_BACK} from './types';

const initialState: ImportFileState = { mockfiles: []};

export function importfileReducer(state = initialState, action: ImportFileTypes): ImportFileState{

    switch(action.type){
        case IMPORT_FILE:
            return {...state.mockfiles,
                mockfiles: [action.mockfileimported]
            };
        case GO_BACK:
        delete state.mockfiles[0];
        return state;
        default:
        return state;
    }
}
