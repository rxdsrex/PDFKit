import {ParamListBase, RouteProp} from '@react-navigation/native';

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

export interface Results {
  path: string;
  filename: string;
  realPath: string;
  parentFolderName: string;
  localIdentifier: string;
  width: number;
  height: number;
  mine: string;
  type: string;
  thumbnail?: string;
  creationDate?: string;
}

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
