import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import { firebaseApp } from './../components/codes';
const { width } = Dimensions.get('window');


// class
class Login extends Component {
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
        <Text style={styles.subTitle}>Login</Text>


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


        {/* login button */}
        <TouchableOpacity style={styles.loginBtn} onPress={this._login}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>


        {/* sign up button */}
        <TouchableOpacity style={styles.signupBtn} onPress={this._signup}>
          <Text style={styles.signupText}>sign up instead?</Text>
        </TouchableOpacity>
      </View>
    );
  }


  // login
  _login() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      // success! navigate to Home
      const {navigate} = this.props.navigation;
      navigate('Home');
    })


    // error
    .catch((error) => {
      alert(error.message);
    })
  }


  // sign up
  _signup() {
    const {navigate} = this.props.navigation;
    navigate('SignUp');
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


  // login
  emailField: {
    height: 50,
    marginTop: 200,
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
  loginBtn: {
    height: 50,
    marginTop: 20,
    borderRadius: 20,
    alignSelf: 'center',
    width: width * 0.80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#66bb6a'
  },
  loginText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'
  },


  // other sign up
  signupBtn: {
    bottom: 20,
    alignSelf: 'center',
    position: 'absolute'
  },
  signupText: {
    fontSize: 18,
    color: '#424242',
    fontWeight: 'bold'
  }
});


// export
export default Login;