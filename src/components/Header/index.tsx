import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {Header as ElementsHeader} from '@rneui/themed';
import React, {FC, memo} from 'react';
import {StyleProp, TextStyle} from 'react-native';
type Props = {
  leftText?: string;
  centerText?: string;
  rightText?: string;
  customStyle?: StyleProp<TextStyle>;
};

const Header: FC<NativeStackHeaderProps & Props> = ({
  customStyle = {
    fontSize: 30,
    color: 'white',
    textAlign: 'left',
  },
  route,
  centerText = route.name,
}) => {
  return (
    <ElementsHeader
      placement="left"
      centerComponent={{
        text: centerText,
        style: customStyle,
      }}
    />
  );
};

export default memo(Header);
