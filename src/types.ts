import {Results} from '@baronha/react-native-multiple-image-picker';
import {ParamListBase, RouteProp} from '@react-navigation/native';
export interface renderItemProps {
  item: Results;
  index?: number;
}

export interface imgRouteProps extends RouteProp<ParamListBase, string> {
  params: {
    gotImages: Results[];
    backScreenName: string;
  };
}
