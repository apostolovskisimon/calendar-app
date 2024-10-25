import ValidatedInput from '@/components/Inputs/ValidatedInput';
import {useAuth} from '@/contexts/AuthContext';
import {PASSWORD_REGEX} from '@/services/constants';
import {Button, Overlay} from '@rneui/themed';
import {Formik} from 'formik';
import React, {FC, useCallback, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import * as Yup from 'yup';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const schema = Yup.object().shape({
  password: Yup.string()
    .matches(
      PASSWORD_REGEX,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    )
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password Confirmation is required.'),
});

const ChangePassword: FC<Props> = ({isOpen, onClose}) => {
  const {changePassword} = useAuth();
  const {width} = useWindowDimensions();

  const [isLoading, setisLoading] = useState(false);

  const onSubmit = useCallback(
    async ({password}: {password: string}) => {
      try {
        setisLoading(true);
        await changePassword(password);
        onClose();
      } catch (error) {
      } finally {
        setisLoading(false);
      }
    },
    [changePassword, onClose],
  );

  return (
    <Overlay
      isVisible={isOpen}
      overlayStyle={{width: width - 40}}
      onBackdropPress={() => onClose()}>
      <View style={{padding: 10}}>
        <Formik
          initialValues={{password: ''}}
          validationSchema={schema}
          onSubmit={onSubmit}>
          {({handleSubmit}) => (
            <>
              <ValidatedInput<{password: string}>
                name="password"
                secureTextEntry
                label="New Password"
              />
              <ValidatedInput<{confirmPassword: string}>
                name="confirmPassword"
                secureTextEntry
                label="Confirm New Password"
              />
              <View
                style={{flexDirection: 'row', gap: 10, alignSelf: 'flex-end'}}>
                <Button
                  loading={isLoading}
                  disabled={isLoading}
                  color={'warning'}
                  onPress={() => onClose()}>
                  Cancel
                </Button>

                <Button
                  loading={isLoading}
                  disabled={isLoading}
                  color={'success'}
                  onPress={() => handleSubmit()}>
                  Submit
                </Button>
              </View>
            </>
          )}
        </Formik>
      </View>
    </Overlay>
  );
};

export default ChangePassword;
