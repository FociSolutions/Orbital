export const IMPORT_FILE = 'IMPORT_FILE';
export const GO_BACK = 'GO_BACK';

export interface MockFile {
    file: string|null | ArrayBuffer;
    filename: string;
  }

export interface ImportFileState{
    mockfiles: MockFile[];
}

interface SendImportFile {
    type: 'IMPORT_FILE',
    mockfileimported: MockFile
  }
interface GoBackToStartType{
    type: 'GO_BACK'
}

  export type ImportFileTypes = SendImportFile | GoBackToStartType