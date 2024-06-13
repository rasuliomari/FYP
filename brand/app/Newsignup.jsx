import { StatusBar } from 'expo-status-bar';
import { View, Text, Touchable } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { EyeOutline } from 'react-ionicons'



import { Formik } from 'formik';

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
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



    //import icons

    import { Octicons, Fontisto, Ionicons } from '@expo/vector-icons';


    //import colors
   // import { Colors } from './../components/styles';
const { brand, darkLight, primary } = Colors;


// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const Signup = () => {
    const [hidePassword, setHidePassword] = useState(true);
    const [isSelected, setSelection] = useState(false);

  return (
    <KeyboardAvoidingWrapper>
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                {/* <PageLogo resizeMode="cover" source={require("./../assets/image/img1.png")} /> */}
                <PageTitle>aGIZA</PageTitle>
                <SubTitle>Account Signup</SubTitle>
                <Formik 
                    initialValues={{ fullName: '', email: '', PhoneNumber: '', password: '', confirmPassword: ''}}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values}) => (<StyledFormArea>
                        <MyTextInput 
                            label="Full Name"
                            icon="person"
                            placeholder="Omari Rasuli"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('fullName')}
                            onBlur={handleBlur('fullName')}
                            value={values.fullName}
                        />
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
                        <MyTextInput 
                            label="Phone Number"
                            icon="plus"
                            placeholder="+255 657707046"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('PhoneNumber')}
                            onBlur={handleBlur('PhoneNumber')}
                            value={values.PhoneNumber}
                        />
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
                        <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20, justifyContent: 'center', flex:1, }}>
                            {}
                            <Text>Are you a Driver?</Text>
                            <Checkbox 
                                value={isSelected}
                                onValueChange={setSelection}
                                style={{ alignSelf:'center',}}
                            />
                            <Text>{isSelected ? '👍' : '👎' }</Text>
                        </View>
                        <MsgBox>...</MsgBox>
                        <StyledButton onPress={handleSubmit}>
                            <ButtonText>Submit</ButtonText>
                        </StyledButton>
                        <Line />
                        {/* <StyledButton onPress={handleSubmit}>
                            <Fontisto name='google' color={primary} size={25} />
                            <ButtonText google={true} >Sign in with Google</ButtonText>
                        </StyledButton> */}
                        <ExtraView>
                            <ExtraText>Already have an account? </ExtraText>
                            <TextLink>
                                <TextLinkContent><Link href="/Login">Login</Link></TextLinkContent>
                            </TextLink>
                        </ExtraView>
                    </StyledFormArea>)}

                </Formik>
            </InnerContainer>
        </StyledContainer>
    </KeyboardAvoidingWrapper>
  )
}

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <ionicons name={hidePassword ? 'md-eye-off' : 'EyeOutline'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    )
}

export default Signup