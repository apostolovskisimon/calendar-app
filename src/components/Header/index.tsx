import Icon from '@/components/Icon';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {Header as ElementsHeader} from '@rneui/themed';
import React, {FC, memo} from 'react';
import {Pressable, StyleProp, StyleSheet, TextStyle} from 'react-native';
type Props = {
  leftText?: string;
  centerText?: string;
  rightText?: string;
  customStyle?: StyleProp<TextStyle>;
};

const Header: FC<NativeStackHeaderProps & Props> = ({
  customStyle = {
    fontSize: 24,
    color: 'white',
    textAlign: 'left',
  },
  route,
  centerText = route.name,
  navigation,
}) => {
  return (
    <ElementsHeader
      containerStyle={styles.headerContainer}
      leftComponent={
        navigation.canGoBack() ? (
          <>
            <Pressable
              hitSlop={12}
              pressRetentionOffset={12}
              onPress={() => navigation.goBack()}>
              <Icon
                name="chevron-back-circle-outline"
                size={30}
                color="white"
              />
            </Pressable>
          </>
        ) : undefined
      }
      centerComponent={{
        text: centerText,
        style: customStyle,
      }}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {height: 110, alignItems: 'center'},
});

export default memo(Header);
