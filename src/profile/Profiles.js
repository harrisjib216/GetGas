import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Dimensions, TouchableOpacity, Image, Animated, Modal, TextInput, Platform} from 'react-native';
import * as firebase from 'firebase';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import Spinner from 'react-native-loading-spinner-overlay';
const { width, height } = Dimensions.get('window');


// class
class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      // side nav
      sideviewX: new Animated.Value(-width + 100),
      createModal: false,
      createAnimation: false,


      // data
      myAge: '',
      myName: '',
      email: '',
      myUID: '',
      
      
      // create profile
      createGT: '87',
      createMake: '',
      createModel: '',
      createLicense: '',
      carImgURL: '',
      confirmText: 'Create Profile',
      avatarSource: null,
      profileImg: 'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Old-Car-2-128.png'
    };

    
    this._selectImage = this._selectImage.bind(this);
    this._uploadImage = this._uploadImage.bind(this);
    this._createProfile = this._createProfile.bind(this);
    this._cancel = this._cancel.bind(this);
  }

  
  // render
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true}/>

        {/* navbar */}
        <View style={styles.navbar}>
        
          {/* more button */}
          <TouchableOpacity style={styles.moreBtn} onPress={() => this._showHideNav(-5)}>
            <Image style={styles.moreImg} source={require('./../components/images/navbtn.png')}/>
          </TouchableOpacity>


          {/* title */}
          <Text style={styles.title}>GetGas</Text>
        </View>


        {/* my profile */}{/* other profiles */}
        <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 20}}>
          {/* my image */}
          <Image style={styles.profImg} source={{uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}}/>


          {/* my name, age, Color, Year, Make, Modal, License, gas type */}
          <View style={{marginTop: 10, marginLeft: 15}}>
          <Text style={styles.profName}>name: Jibril Harris</Text>
            <Text style={styles.profAge}>age: 17</Text>
            <Text style={styles.profCar}>car: Chevy Cruze</Text>
            <Text style={styles.profCar}>car: Ex1234, gas type: 87</Text>
          </View>
        </View>


        {/* side nav */}
        <Animated.View style={[styles.sideNav, {transform: [{translateX: this.state.sideviewX}]}]}>
          {/* exit button */}
          <TouchableOpacity onPress={() => this._showHideNav(-width + 100)}>
            <Image style={styles.exitNav} source={require('./../components/images/cancel.png')}/>
          </TouchableOpacity>

          {/* my profile pic */}
          <Image style={styles.myImg} source={{uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}}/>


          {/* name, age */}
          <View style={{marginTop: 20, marginLeft: 20, flexDirection: 'row'}}>
            <Text style={styles.myName}>{this.state.myName}</Text>
            <Text style={styles.myAge}>{this.state.myAge}</Text>
          </View>
          <Text style={styles.myEmail}>{this.state.email}</Text>

          
          {/* nav buttons */}
          <View style={{marginTop: 30, marginLeft: 20}}>

            {/* nav buttons */}
            <Text style={styles.navBtns} onPress={() => this._navTo('Home')}>Home</Text>
            

            {/* nav buttons */}
            <Text style={styles.navBtns} onPress={() => this._navTo('Requests')}>My Requests</Text>
            

            {/* nav buttons */}
            <Text style={styles.navBtns} onPress={() => this._navTo('Settings')}>Settings</Text>
          </View>
        </Animated.View>


        {/* request modal */}
        <Modal visible={this.state.createModal} transparent={true}>
          <View style={styles.createMdl}>
          
            {/* nav bar */}
            <View style={{backgroundColor: 'rgb(212, 212, 212)', height: 65}}>
           
              {/* exit button */}
              <TouchableOpacity onPress={this._cancel}>
                <Image style={styles.exitNav} source={require('./../components/images/cancel.png')}/>
              </TouchableOpacity>

            
              {/* title */}
              <Text style={styles.profTitle}>Create A Profile</Text>
            </View>


            {/* car make */}
            <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 10}}>
              <Text style={styles.profOptions}>Make: </Text>
              <TextInput
                placeholder={'Honda'}
                style={styles.inputField}
                placeholderTextColor={'rgb(182, 182, 182)'}
                onChangeText={(make) => this.setState({createMake: make})}
              />
            </View>


            {/* car model */}
            <View style={{flexDirection: 'row', marginTop: 15, marginLeft: 10}}>
              <Text style={styles.profOptions}>Model: </Text>
              <TextInput
                placeholder={'Accord'}
                style={styles.inputField}
                placeholderTextColor={'rgb(182, 182, 182)'}
                onChangeText={(model) => this.setState({createModel: model})}
              />
            </View>
            

            {/* car license */}
            <View style={{flexDirection: 'row', marginTop: 15, marginLeft: 10}}>
              <Text style={styles.profOptions}>License: </Text>
              <TextInput
                placeholder={'GAS USR'}
                style={styles.inputField}
                placeholderTextColor={'rgb(182, 182, 182)'}
                onChangeText={(license) => this.setState({createLicense: license})}
              />
            </View>


            {/* gas type */}
            <View style={{flexDirection: 'row', marginTop: 15, alignItems: 'center', marginLeft: 10}}>
              <Text style={styles.profOptions}>Gas Type:</Text>


              {/* 87 */}
              <TouchableOpacity style={styles.gasBtns} onPress={() => this.setState({createGT: '87'})}>
                <Text style={styles.gasText}>87</Text>
                <Image source={require('./../components/images/check.png')} style={this.state.createGT == '87' ? styles.checkT: styles.checkF}/>
              </TouchableOpacity>


              {/* 89 */}
              <TouchableOpacity style={styles.gasBtns} onPress={() => this.setState({createGT: '89'})}>
                <Text style={styles.gasText}>89</Text>
                <Image source={require('./../components/images/check.png')} style={this.state.createGT == '89' ? styles.checkT: styles.checkF}/>
              </TouchableOpacity>


              {/* 93 */}
              <TouchableOpacity style={styles.gasBtns} onPress={() => this.setState({createGT: '93'})}>
                <Text style={styles.gasText}>93</Text>
                <Image source={require('./../components/images/check.png')} style={this.state.createGT == '93' ? styles.checkT: styles.checkF}/>
              </TouchableOpacity>


              {/* Diesel */}
              <TouchableOpacity style={styles.gasBtns} onPress={() => this.setState({createGT: 'D'})}>
                <Text style={styles.gasText}>D</Text>
                <Image source={require('./../components/images/check.png')} style={this.state.createGT == 'D' ? styles.checkT: styles.checkF}/>
              </TouchableOpacity>
            </View>
            

            {/* picture */}
            <TouchableOpacity onPress={this._selectImage}>
              <Image style={styles.selectCarImg} source={{uri: this.state.profileImg}}/>
            </TouchableOpacity>


            {/* create profile btn */}
            <TouchableOpacity style={styles.confirmBtn} onPress={this._createProfile}>
              <Text style={styles.confirmText}>{this.state.confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Modal>


        {/* request tab bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={() => this.setState({createModal: true})}>
            <Image style={styles.requestBtn} source={require('./../components/images/request.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  // view loaded
  componentDidMount() {
    const {state} = this.props.navigation;
    this.setState({
      myAge: state.params.myAge,
      myName: state.params.myName,
      email: state.params.myEmail,
      myUID: state.params.myUID
    });


    firebase.database().ref().child(`users/${state.params.myUID}/profiles`).on('value', (snapshot) => {
      snapshot.forEach((child) => {
        console.log(child);
      });
    });
  }


  // show side bar
  _showHideNav(givenVal) {
    Animated.spring(this.state.sideviewX, {
      toValue: givenVal,
      duration: 500
    }).start();
  }


  // nav to
  _navTo(screen) {
    const {navigate} = this.props.navigation;
    navigate(screen);
  }


  // select image
  _selectImage() {
    const options = {
      title: "Open Camera or Photo Library",
      storageOptions : {
        skipBackup: true,
        path: 'images'
      }
    }


    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        alert('Cancelled Selection');
      }
      else if (response.error) {
        alert('Error ' + response.error);
      }
      else if (response.customButton) {
        alert(response.customButton);
      }
      else {
        var source;
        if (Platform.OS === 'android') {
          source = {uri: response.uri};
        } else {
          source = {uri: response.uri.replace('file://', '')};
        }
        
        this.setState({
          avatarSource: source,
          profileImg: source.uri
        });        
      }
    });
  }


// upload image
  async _uploadImage(uri, userID, mime = 'image/jpg') {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;


    return new Promise((resolve, reject) => {
      let uploadBlob = null;

      const imageRef = firebase.storage().ref().child(`${userID}/`)
      fs.readFile(uri.uri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
        })
        .then((url) => {
          this._uploadProfile(url);
          resolve(url);
        })
        .catch((error) => {
          this.setState({createAnimation: false});
          console.log(error);
        });
    });
  }


// create profile
  _createProfile() {
    // upload image
    if (this.state.confirmText == 'Confirm?') {
      this._uploadImage(this.state.avatarSource, this.state.myUID);
      this.setState({createAnimation: true});
    }

    // confirm
    else {
      this.setState({confirmText: 'Confirm?'});
    }
  }


// upload profile
  _uploadProfile() {
    var newCar = {
      make: this.state.createMake,
      gasType: this.state.createGT,
      model: this.state.createModel,
      license: this.state.createLicense,
      carImgURL: arguments[0]
    };
    firebase.database().ref().child(`users/${this.state.myUID}/profiles/`).push(newCar).then(() => {
      this.setState({
        createGT: '87',
        createMake: '',
        createModel: '',
        createLicense: '',
        carImgURL: '',
        confirmText: 'Create Profile',
        avatarSource: null,
        profileImg: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-128.png',
        createAnimation: false
      });
      console.log('Success!! Profile created!');
    });
  }


  // cancel
  _cancel() {
    this.setState({
      createGT: '87',
      createMake: '',
      createModel: '',
      createLicense: '',
      carImgURL: '',
      confirmText: 'Create Profile',
      avatarSource: null,
      profileImg: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-128.png',
      createAnimation: false,
      createModal: false
    });
  }
}


// styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c8e6c9'
  },


  // nav bar
  navbar: {
    height: 70,
    backgroundColor: '#66bb6a'
  },
  title: {
    fontSize: 42,
    marginTop: -40,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  moreBtn: {
    marginTop: 20,
    marginLeft: 10
  },
  moreImg: {
    width: 30,
    height: 30
  },


  // side bar
  sideNav: {
    top: 0,
    left: 0,
    opacity: 0.95,
    height: height,
    width: width * 0.7,
    position: 'absolute',
    backgroundColor: 'grey'
  },
  exitNav: {
    width: 50,
    height: 50,
    marginTop: 5,
    marginLeft: 5
  },
  myImg: {
    width: 140,
    height: 140,
    marginTop: 15,
    borderRadius: 70,
    alignSelf: 'center'
  },
  myName: {
    fontSize: 22,
    color: 'white',
  },
  myAge: {
    fontSize: 22,
    color: 'white',
    marginLeft: 10
  },
  myEmail: {
    fontSize: 22,
    color: 'white',
    marginLeft: 20
  },
  navBtns: {
    fontSize: 20,
    marginTop: 5,
    color: 'white'
  },


  // my profile
  profImg: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  profName: {
    fontSize: 18,
  },
  profAge: {
    fontSize: 18,
  },
  profCar: {
    fontSize: 16,
  },


  // make profile
  createMdl: {
    marginTop: 10,
    shadowRadius: 5,
    shadowOpacity: 1.0,
    shadowColor: 'black',
    alignSelf: 'center',
    width: width * 0.85,
    height: height * 0.72,
    backgroundColor: '#FFFFFF',
    shadowOffset: {width: 2, height: 5}
  },
  profExit: {
    width: 50,
    height: 50
  },
  profTitle: {
    fontSize: 26,
    marginTop: -40,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'rgb(149, 149, 149)'
  },
  profOptions: {
    fontSize: 22,
    marginRight: 5,
    color: 'rgb(182, 182, 182)'
  },
  inputField: {
    height: 35,
    fontSize: 18,
    color: 'grey',
    paddingLeft: 5,
    borderColor: 'grey',
    width: width * 0.50,
    borderBottomWidth: 2
  },
  gasBtns: {
    width: 42,
    height: 42,
    marginLeft: 3,
    marginRight: 3,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gasText: {
    fontSize: 16.5,
    fontWeight: 'bold',
    color: 'rgb(182, 182, 182)'
  },
  checkT: {
    width: 30,
    height: 30,
    marginTop: -22.5,
  },
  checkF: {
    display: 'none'
  },
  selectCarImg: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginLeft: 10
  },
  confirmBtn: {
    bottom: 0,
    height: 50,
    width: width * 0.85,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#66bb6a'
  },
  confirmText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },


  // tab bar
  tabBar: {
    bottom: 0,
    height: 60,
    width: width,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#424242'
  },
  requestBtn: {
    width: 48,
    height: 48,
    alignSelf: 'center'
  },
});


// export
export default Profiles;




/* loading
    <Spinner
      animation="fade"
      textContent={"Creating Profile..."}
      visible={this.state.creatingProfile}
      textStyle={{color: '#253145'}}
    />



            <Text style={styles.profName}>name: this.state.myName</Text>
            <Text style={styles.profAge}>age: this.state.myAge</Text>
            <Text style={styles.profCar}>car: Make, Model</Text>
            <Text style={styles.profCar}>car: License, GasType</Text>
*/