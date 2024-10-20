import React, {FC} from 'react';
import IconIonicons from 'react-native-vector-icons/Ionicons';

type Props = {
  name: string;
  size?: number;
  color?: string;
  handlePress?: () => void;
};

const Icon: FC<Props> = ({name, size = 18, color = '#000'}) => {
  return <IconIonicons name={name} size={size} color={color} />;
};

export default Icon;
