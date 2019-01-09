import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import Home from './src/main/Home';
import Login from './src/auth/Login';
import SignUp from './src/auth/SignUp';
import Profiles from './src/profile/Profiles';


// class
export default class SneakPeek extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <Home navigation={ navigation }/>
    );
  }
}
  
  
// routing
const Routes = DrawerNavigator({
  Home: {screen: Home},
  Profiles: {screen: Profiles},
  Login: {screen: Login},
  SignUp: {screen: SignUp},
});


// export
AppRegistry.registerComponent('GetGas', () => Routes);