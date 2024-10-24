import Icon from '@/components/Icon';
import {useEvents} from '@/contexts/EventsContext';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {Header as ElementsHeader, Text} from '@rneui/themed';
import dayjs, {ManipulateType} from 'dayjs';
import React, {FC, memo, useCallback} from 'react';
import {Pressable, StyleProp, StyleSheet, TextStyle, View} from 'react-native';

type Props = {
  leftText?: string;
  centerText?: string;
  rightText?: boolean;
  customStyle?: StyleProp<TextStyle>;
  isisLandingScreen?: boolean;
};

const Header: FC<BottomTabHeaderProps & Props> = ({
  customStyle = {
    fontSize: 24,
    color: 'white',
    textAlign: 'left',
  },
  route,
  centerText = route.name,
  rightText,
}) => {
  const {onOpenDrawer, calendarMode, calendarDate, setCalendarDate} =
    useEvents();

  const onClickChangeDate = useCallback(
    (isForward: boolean = false) => {
      let selectedDate = dayjs(calendarDate);

      const amount = calendarMode === '3days' ? 3 : 1;
      const type = calendarMode === '3days' ? 'day' : calendarMode;
      isForward
        ? (selectedDate = selectedDate
            .clone()
            .add(amount, type as ManipulateType)
            .endOf(type as ManipulateType))
        : (selectedDate = selectedDate
            .clone()
            .subtract(amount, type as ManipulateType)
            .endOf(type as ManipulateType));

      setCalendarDate(selectedDate.toDate());
    },
    [calendarDate, calendarMode, setCalendarDate],
  );

  const onClickToday = useCallback(() => {
    setCalendarDate(new Date());
  }, [setCalendarDate]);
  return (
    <ElementsHeader
      containerStyle={styles.headerContainer}
      leftComponent={
        <Pressable style={styles.menuBtn} onPress={() => onOpenDrawer()}>
          <Icon name="grid-outline" size={24} color="white" />
        </Pressable>
      }
      centerComponent={<Text style={customStyle}>{centerText}</Text>}
      rightComponent={
        <View style={styles.controls}>
          <Pressable onPress={() => onClickChangeDate(false)}>
            <Icon name="chevron-back-outline" color="white" size={24} />
          </Pressable>
          <Pressable onPress={() => onClickToday()}>
            <Text style={styles.today}>Today</Text>
          </Pressable>
          <Pressable onPress={() => onClickChangeDate(true)}>
            <Icon name="chevron-forward-outline" color="white" size={24} />
          </Pressable>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {height: 110, alignItems: 'center', paddingTop: 5},
  menuBtn: {
    marginTop: 5,
    marginLeft: 10,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 10,
    marginRight: 10,
  },
  today: {
    fontSize: 16,
    color: 'white',
  },
});

export default memo(Header);
