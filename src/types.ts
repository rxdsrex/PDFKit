import {ParamListBase, RouteProp} from '@react-navigation/native';
export interface renderItemProps {
  item: Results;
  index?: number;
}

export interface renderChapterProps {
  item: chapterProps;
  index?: number;
}
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
