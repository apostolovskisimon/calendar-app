import ChangePassword from '@/components/ChangePassword';
import Icon from '@/components/Icon';
import ValidatedInput from '@/components/Inputs/ValidatedInput';
import {useAuth} from '@/contexts/AuthContext';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useIsFocused} from '@react-navigation/native';
import {Button, Text} from '@rneui/themed';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email address.')
    .required('Email is required.'),
  displayName: Yup.string().required('Display Name is required.'),
});

const Profile = () => {
  const isFocused = useIsFocused();

  const {user, updateProfile, isLoading, handleLogout} = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [canChangePassword, setCanChangePassword] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setIsEditing(false);
      setCanChangePassword(false);
    }
  }, [isFocused]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{flex: 1}}
      keyboardShouldPersistTaps="always">
      {user && (
        <Formik
          initialValues={user}
          onSubmit={data => updateProfile(data.email!, data.displayName!)}
          validationSchema={schema}>
          {({resetForm, handleSubmit}) => (
            <View style={styles.wrapper}>
              <View style={styles.profileInfo}>
                <Text style={{fontSize: 18}}>Your profile information </Text>
                <Button
                  color={isEditing ? 'error' : 'warning'}
                  onPress={() => {
                    if (isEditing) {
                      // on cancel editing reset form
                      resetForm();
                    }
                    setIsEditing(prevEdit => !prevEdit);
                  }}>
                  <Text style={styles.label}>
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Text>
                  <Icon name={isEditing ? 'close-outline' : 'pencil-outline'} />
                </Button>
              </View>
              <ValidatedInput<FirebaseAuthTypes.User>
                name="email"
                required
                label="Email"
                placeholder=""
                disabled={!isEditing}
              />
              <ValidatedInput<FirebaseAuthTypes.User>
                name="displayName"
                required
                label="Display Name"
                placeholder=""
                disabled={!isEditing}
              />
              {isEditing && (
                <>
                  <Button
                    loading={isLoading}
                    disabled={isLoading}
                    color={'primary'}
                    containerStyle={styles.pwChange}
                    onPress={() => setCanChangePassword(true)}>
                    Change Password
                  </Button>
                  <Button
                    disabled={isLoading}
                    color={'success'}
                    loading={isLoading}
                    onPress={() => handleSubmit()}>
                    Submit
                  </Button>
                </>
              )}
            </View>
          )}
        </Formik>
      )}
      <ChangePassword
        isOpen={canChangePassword}
        onClose={() => setCanChangePassword(false)}
      />
      <Button
        containerStyle={styles.logout}
        color="error"
        onPress={() => handleLogout()}>
        Log out
      </Button>
    </KeyboardAwareScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15,
    alignSelf: 'center',
  },
  wrapper: {width: '90%', alignSelf: 'center'},
  pwChange: {alignSelf: 'flex-start', marginBottom: 20},
  label: {fontSize: 18, marginRight: 10},
  logout: {
    width: 150,
    alignSelf: 'center',
    margin: 20,
  },
});
