import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledTextInput,
  StyledInputLabel,
  LeftIcon,
  RightIcon,
  ButtonText,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  StyledButton,
  Colors,
} from '../components/styles';

import { Octicons, Ionicons } from '@expo/vector-icons';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import axios from 'axios';

const { brand, darkLight, primary } = Colors;

// Validation schema
const validationSchema = Yup.object().shape({
  username: Yup.string().min(4, 'Username must be at least 4 characters long').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  PhoneNumber: Yup.string().min(5, 'Phone Number must be at least 5 digits').required('Phone Number is required'),
  password: Yup.string().min(3, 'Password must be at least 3 characters long').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Signup = () => {
  const [hidePassword, setHidePassword] = useState(true);

  const handleSubmit = async (values) => {
    const userData = {
      username: values.username,
      email: values.email,
      PhoneNumber: values.PhoneNumber,
      password: values.password,
      confirmPassword: values.confirmPassword,
      isSelected: values.isSelected,
    };

    try {
      const response = await axios.post('http://192.168.1.165:5000/api/users/register', userData);
      if (response.data.status === 'Ok') {
        Alert.alert('User registered successfully');
      } else {
        Alert.alert('User registration failed');
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        // Server responded with a status other than 2xx
        Alert.alert(`Error: ${error.response.data.message || 'Bad Request'}`);
      } else if (error.request) {
        // Request was made but no response was received
        Alert.alert('Network error. Please try again.');
      } else {
        // Something happened in setting up the request
        Alert.alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageTitle>aGIZA</PageTitle>
          <SubTitle>Account Signup</SubTitle>
          <Formik
            initialValues={{ username: '', email: '', PhoneNumber: '', password: '', confirmPassword: '', isSelected: false }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Full Name"
                  icon="person"
                  placeholder="Omari Rasuli"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                />
                {touched.username && errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
                
                <MyTextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="rasuliomari4@gmail.com"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                
                <MyTextInput
                  label="Phone Number"
                  icon="plus"
                  placeholder="+255 657707046"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('PhoneNumber')}
                  onBlur={handleBlur('PhoneNumber')}
                  value={values.PhoneNumber}
                />
                {touched.PhoneNumber && errors.PhoneNumber && <Text style={styles.errorText}>{errors.PhoneNumber}</Text>}
                
                <MyTextInput
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                
                <MyTextInput
                  label="Confirm Password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={values.isSelected}
                    onValueChange={(value) => setFieldValue('isSelected', value)}
                    style={styles.checkbox}
                  />
                  <Text style={styles.label}>Are you a Driver?</Text>
                </View>
                
                <Text>If yes select the checkbox above: {values.isSelected ? '👍' : '👎'}</Text>
                <MsgBox>...</MsgBox>
                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Submit</ButtonText>
                </StyledButton>
                <Line />
                <ExtraView>
                  <ExtraText>Already have an account? </ExtraText>
                  <TextLink>
                    <TextLinkContent><Link href="/Login">Login</Link></TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={darkLight} />
        </RightIcon>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default Signup;
