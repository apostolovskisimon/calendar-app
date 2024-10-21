import ValidatedInput from '@/components/Inputs/ValidatedInput';
import {Input, Overlay} from '@rneui/themed';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {Calendar as BigCalendar} from 'react-native-big-calendar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = {};

const Calendar = (props: Props) => {
  const {height, width} = useWindowDimensions();

  const [isOpenEventDetails, setIsOpenEventDetails] = useState(false);

  return (
    <View style={{flex: 1}}>
      <Overlay
        isVisible={isOpenEventDetails}
        overlayStyle={{
          width: width - 40,
          maxHeight: height - 240,
        }}
        onBackdropPress={() => setIsOpenEventDetails(false)}>
        <KeyboardAwareScrollView style={{maxHeight: height - 240}}>
          <Input />
          <Input />
          <Input />
          <Input />
          <Input />
          <Input />
          <Input />
          <Input />
          <Input />
          <Input />
          <Input />
          <Input />
          <Input />
          <Input />
        </KeyboardAwareScrollView>
      </Overlay>
      <BigCalendar
        height={height}
        onLongPressCell={date => {
          setIsOpenEventDetails(true);
          console.log({date});
        }}
        onPressEvent={event => {
          console.log('event', event);
        }}
        events={[
          {
            start: dayjs().toDate(),
            end: dayjs().add(2, 'h').toDate(),
            title: 'title',
          },
        ]}
      />
    </View>
  );
};

export default Calendar;
