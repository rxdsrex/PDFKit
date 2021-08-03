import {NativeModules} from 'react-native';
const {FilesystemNativeModule} = NativeModules;

interface FilesystemNativeInterface {
  checkTreePermissionsGranted(treeUriStr: string): Promise<boolean>;
  openPdfFileForRead(appFolderUriStr: string): Promise<string>;
  openDocumentInChosenApp(documentUriStr: string): Promise<boolean>;
  askPermissionForStorage(docUriStr: string): Promise<string>;
  getCacheDirectoryPath(): Promise<string>;
  getDocumentsDirectoryContentUri(): Promise<string>;
  deleteFileByPath(inputPath: string, inputFileName: string): Promise<boolean>;
  copyFileFromToPath(
    sourceFolderPath: string,
    sourceFileName: string,
    destinationFolderUriStr: string,
    mime: string,
    destinationRootFolderTreeStr: string,
  ): Promise<{
    destinationFolderUriStr: string;
    outputFileUriStr: string;
  }>;
  copyNResolveFilePath(inputUriStr: string): Promise<string>;
}

export default FilesystemNativeModule as FilesystemNativeInterface;
