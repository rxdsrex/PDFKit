import {Results} from '@baronha/react-native-multiple-image-picker';
import {ParamListBase, RouteProp} from '@react-navigation/native';
export interface renderItemProps {
  item: Results;
  index?: number;
}

export interface renderBookItemProps {
  item: bookProps;
  index?: number;
}
export interface bookProps {
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
