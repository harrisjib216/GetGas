import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import { firebaseApp } from './../components/codes';
const { width } = Dimensions.get('window');


// class
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state ={
      email: '',
      password: ''
    };


    this._login = this._login.bind(this);
    this._signup = this._signup.bind(this);
  }


  // render
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true}/>

        {/* titles */}
        <Text style={styles.title}>GetGas</Text>
        <Text style={styles.subTitle}>Sign Up</Text>


        {/* name and age */}
        <View style={{flexDirection: 'row', marginTop: 175, alignSelf: 'center'}}>
          {/* name field */}
          <TextInput
            placeholder={'Name'}
            autoCapitalize={'none'}
            style={styles.nameField}
            onChangeText={(name) => this.setState({name: name})}
          />


          {/* age field */}
          <TextInput
            maxLength={3}
            placeholder={'Age'}
            autoCapitalize={'none'}
            style={styles.ageField}
            keyboardType={'number-pad'}
            onChangeText={(age) => this.setState({age: age})}
          />
        </View>
        

        {/* email field */}
        <TextInput
          placeholder={'Email'}
          autoCapitalize={'none'}
          style={styles.emailField}
          onChangeText={(email) => this.setState({email: email})}
        />


        {/* pass field */}
        <TextInput
          secureTextEntry={true}
          autoCapitalize={'none'}
          style={styles.passField}
          placeholder={'**********'}
          onChangeText={(password) => this.setState({password: password})}
        />


        {/* sign up button */}
        <TouchableOpacity style={styles.signupBtn} onPress={this._signup}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>


        {/* login button */}
        <TouchableOpacity style={styles.loginBtn} onPress={this._login}>
          <Text style={styles.loginText}>login instead?</Text>
        </TouchableOpacity>
      </View>
    );
  }


  // login
  _signup() {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((userData) => {
      var myData = {
        age: this.state.age,
        name: this.state.name,
        email: this.state.email,
        uid: userData.uid
      };
      firebase.database().ref().child(`users/${userData.uid}/`).set(myData)
      .then(() => {
        const {navigate} = this.props.navigation;
        navigate('Home');
      });
    })


    // error
    .catch((error) => {
      alert(error.message);
    })
  }


  // sign up
  _login() {
    const {navigate} = this.props.navigation;
    navigate('Login');
  }
}


// styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8e6c9'
  },
  title: {
    fontSize: 48,
    marginTop: 25,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  subTitle: {
    fontSize: 32,
    marginTop: 10,
    alignSelf: 'center'
  },


  // sign up
  ageField: {
    height: 50,
    marginLeft: 5,
    paddingLeft: 8,
    borderRadius: 20,
    width: width * 0.12,
    backgroundColor: '#a5d6a7'
  },
  nameField: {
    height: 50,
    marginRight: 5,
    paddingLeft: 20,
    borderRadius: 20,
    width: width * 0.65,
    backgroundColor: '#a5d6a7'
  },
  emailField: {
    height: 50,
    marginTop: 20,
    paddingLeft: 20,
    borderRadius: 20,
    alignSelf: 'center',
    width: width * 0.80,
    backgroundColor: '#a5d6a7'
  },
  passField: {
    height: 50,
    marginTop: 20,
    paddingLeft: 20,
    borderRadius: 20,
    alignSelf: 'center',
    width: width * 0.80,
    backgroundColor: '#a5d6a7'
  },
  signupBtn: {
    height: 50,
    marginTop: 20,
    borderRadius: 20,
    alignSelf: 'center',
    width: width * 0.80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#66bb6a'
  },
  signupText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'
  },


  // login instead
  loginBtn: {
    bottom: 20,
    alignSelf: 'center',
    position: 'absolute'
  },
  loginText: {
    fontSize: 18,
    color: '#424242',
    fontWeight: 'bold'
  },
});


// export
export default SignUp;