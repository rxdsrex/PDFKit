import {ParamListBase, RouteProp} from '@react-navigation/native';
import {Results as PickerResults} from '@baronha/react-native-multiple-image-picker';

export interface chapterProps {
  id: string;
  chapterTitle: string;
  pages: Results[];
}

export interface imgRouteProps extends RouteProp<ParamListBase, string> {
  params: {
    gotImages: Results[];
    backScreenName: string;
  };
}

export interface Results extends PickerResults {}

export interface addChapterModalProps {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  setChapterTitle: (chapterTitle: string) => void;
  setDonePicking: (donePicking: boolean) => void;
  chapterTitle: string;
  images: Results[];
  dnBtnDisabled: boolean;
  chapterId: string;
  chapters: chapterProps[];
  setChapters: (chapters: chapterProps[]) => void;
  setChapterId: (chapterId: string) => void;
  setDnBtnDisabled: (dnBtnDisabled: boolean) => void;
  setImages: (images: Results[]) => void;
  backScreenName: string;
}

export interface createPdfModalProps {
  createModalVisible: boolean;
  setCreateModalVisible: (createModalVisible: boolean) => void;
  setPdfFileName: (pdfFileName: string) => void;
  pdfFileName: string;
  chapters: chapterProps[];
  setChapters: (chapters: chapterProps[]) => void;
  setCSpinnerVisible: (visibility: boolean) => void;
}

export interface modifyPdfModalProps {
  createModalVisible: boolean;
  setCreateModalVisible: (createModalVisible: boolean) => void;
  setInputPdfFilePath: (inputPdfFilePath: string) => void;
  inputPdfFilePath: string;
  chapters: chapterProps[];
  setChapters: (chapters: chapterProps[]) => void;
  setMSpinnerVisible: (visibility: boolean) => void;
}

export interface chapterListProps {
  chapters: chapterProps[];
  setChapters: (chapters: chapterProps[]) => void;
  setDonePicking: (donePicking: boolean) => void;
  setImages: (images: Results[]) => void;
  setChapterTitle: (chapterTitle: string) => void;
  setChapterId: (chapterId: string) => void;
  backScreenName: string;
}

export type RootStackParamList = {
  PickImage: {
    gotImages: Results[];
    backScreenName: string;
  };
  Create: {
    gotImages: Results[];
  };
  Modify: {
    gotImages: Results[];
  };
};

export type nodeCreateUpdateResponse = {
  fileUri: string;
  nonStdImagesFound: boolean;
};
