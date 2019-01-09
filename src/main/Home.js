import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Dimensions, TouchableOpacity, Image, Geolocation, Alert, Animated, Modal, TextInput } from 'react-native';
import * as firebase from 'firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import MapView from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
const { width, height } = Dimensions.get('window');


// class
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      // side nav, map
      sideviewX: new Animated.Value(-width + 100),
      latitude: 0,
      longitude: 0,


      // info
      uid: '',
      email: '',
      myAge: 0,
      myName: '',
      gas87: 0,
      gas89: 0,
      gas93: 0,
      gasD: 0,


      // request
      gallons: 1,
      gasType: '87',
      gasPrice: 0,
      comments: '',
      requestModal: false,
      confirmText: 'GetGas'
    };


    this._renderItem = this._renderItem.bind(this);
    this._showHideNav = this._showHideNav.bind(this);
    this._makePrice = this._makePrice.bind(this);
    this._makeRequest = this._makeRequest.bind(this);
    this._cancel = this._cancel.bind(this);
  }

  
  // render
  render() {
    let mapView = this.state.latitude ?
    <MapView style={styles.map} initialRegion={{latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}>
      <MapView.Marker
        title={'me'}
        coordinate={{
          latitude: this.state.latitude,
          longitude: this.state.longitude
        }}
        image={require('./../components/images/mapMarker.png')}
      />
    </MapView>:
    <Spinner
      animation="fade"
      textContent={"Gathering Data..."}
      visible={!this.state.latitude}
      textStyle={{color: '#253145'}}
    />;


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


        {/* map view */}
        {mapView}


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
            <Text style={styles.navBtns} onPress={() => this._navTo('MyRequests')}>My Requests</Text>
            

            {/* nav buttons */}
            <Text style={styles.navBtns} onPress={() => this._navTo('Profiles')}>Profiles</Text>
            

            {/* nav buttons */}
            <Text style={styles.navBtns} onPress={() => this._navTo('Settings')}>Settings</Text>
          </View>
        </Animated.View>


        {/* request modal */}
        <Modal visible={this.state.requestModal} transparent={true}>
        <View style={styles.requestMdl}>
          
          {/* nav bar */}
          <View style={{backgroundColor: 'rgb(212, 212, 212)', height: 65}}>
           
            {/* exit button */}
            <TouchableOpacity onPress={this._cancel}>
              <Image style={styles.exitNav} source={require('./../components/images/cancel.png')}/>
            </TouchableOpacity>

            
            {/* title */}
            <Text style={styles.requestTitle}>Make Request</Text>
          </View>


          {/* picker */}
          <Carousel
            data={[0, 1]}
            ref={'carousel'}
            itemWidth={width * 0.85}
            sliderWidth={width * 0.85}
            renderItem={this._renderItem}
          />
        </View>
        </Modal>


        {/* request tab bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={() => this.setState({requestModal: true})}>
            <Image style={styles.requestBtn} source={require('./../components/images/request.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  // view will load
  componentWillMount() {
    const {navigate} = this.props.navigation;
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        navigate('Login');
      }
      else {
        // load drivers
        navigator.geolocation.requestAuthorization();
        navigator.geolocation.getCurrentPosition((position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            uid: user.uid,
            email: user.email
          });
        },
        (error) => Alert.alert('Uh Oh!', `${error.message}`),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
      }
    });
  }


  // view loaded
  componentDidMount() {
    // get my data
    firebase.database().ref().child(`users/${this.state.uid}/`).once('value', (snapshot) => {
      snapshot.forEach((child) => {
        this.setState({
          myAge: child.val().age,
          myName: child.val().name
        });
      });
    });


    // get gas data
    firebase.database().ref().child('drivers/').on('value', (snapshot) => {
      this.setState({
        gas87: snapshot.child('87').val(),
        gas89: snapshot.child('89').val(),
        gas93: snapshot.child('93').val(),
        gasD: snapshot.child('D').val()
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
    navigate(screen, {
      myAge: this.state.myAge,
      myName: this.state.myName,
      myEmail: this.state.email,
      myUID: this.state.uid
    });
  }


  // type carousel
  _renderItem({item, index}) {
    var pickScreen;
    if (index == 0) {  // profiles
      pickScreen =
      <View style={styles.slide}>
        <Text style={styles.slideTitle}>From Profiles</Text>
      </View>;
    }    
    else {  // manual
      pickScreen =
      <View style={styles.slide}>
        <Text style={styles.slideTitle}>Custom</Text>


        {/* gas types */}
        <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center', marginLeft: 8}}>
          <Text style={styles.optionTitles}>Type:</Text>


          {/* 87 */}
          <TouchableOpacity style={styles.gasBtns} onPress={() => this.setState({gasType: '87', gasPrice: (((this.state.gas87 * this.state.gallons) * 0.08) + (this.state.gas87 * this.state.gallons)).toFixed(2)})}>
            <Text style={styles.gasText}>87</Text>
            <Image source={require('./../components/images/check.png')} style={this.state.gasType == '87' ? styles.checkT: styles.checkF}/>
          </TouchableOpacity>


          {/* 89 */}
          <TouchableOpacity style={styles.gasBtns} onPress={() => this.setState({gasType: '89', gasPrice: (((this.state.gas89 * this.state.gallons) * 0.08) + (this.state.gas89 * this.state.gallons)).toFixed(2)})}>
            <Text style={styles.gasText}>89</Text>
            <Image source={require('./../components/images/check.png')} style={this.state.gasType == '89' ? styles.checkT: styles.checkF}/>
          </TouchableOpacity>


          {/* 93 */}
          <TouchableOpacity style={styles.gasBtns} onPress={() => this.setState({gasType: '93', gasPrice: (((this.state.gas93 * this.state.gallons) * 0.08) + (this.state.gas93 * this.state.gallons)).toFixed(2)})}>
            <Text style={styles.gasText}>93</Text>
            <Image source={require('./../components/images/check.png')} style={this.state.gasType == '93' ? styles.checkT: styles.checkF}/>
          </TouchableOpacity>


          {/* Diesel */}
          <TouchableOpacity style={styles.gasBtns} onPress={() => this.setState({gasType: 'D', gasPrice: (((this.state.gasD * this.state.gallons) * 0.08) + (this.state.gasD * this.state.gallons)).toFixed(2)})}>
            <Text style={styles.gasText}>D</Text>
            <Image source={require('./../components/images/check.png')} style={this.state.gasType == 'D' ? styles.checkT: styles.checkF}/>
          </TouchableOpacity>
        </View>


        {/* gallons needed */}
        <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center', marginLeft: 8}}>
          <Text style={styles.optionTitles}>Gallons:</Text>
            
          {/* 1 */}
          <TouchableOpacity style={styles.gasBtns} onPress={() => this._makePrice(1)}>
            <Text style={styles.gasText}>1</Text>
            <Image source={require('./../components/images/check.png')} style={this.state.gallons == 1 ? styles.checkT : styles.checkF}/>
          </TouchableOpacity>


          {/* 5 */}
          <TouchableOpacity style={styles.gasBtns} onPress={() => this._makePrice( 5)}>
            <Text style={styles.gasText}>5</Text>
            <Image source={require('./../components/images/check.png')} style={this.state.gallons == 5 ? styles.checkT : styles.checkF}/>
          </TouchableOpacity>


          {/* 10 */}
          <TouchableOpacity style={styles.gasBtns} onPress={() => this._makePrice(10)}>
            <Text style={styles.gasText}>10</Text>
            <Image source={require('./../components/images/check.png')} style={this.state.gallons == 10 ? styles.checkT : styles.checkF}/>
          </TouchableOpacity>


          {/* custom */}
          <TextInput
            maxLength={3}
            placeholder={'8.5'}
            style={styles.gllnsInput}
            keyboardType={'number-pad'}
            onChangeText={(gallons) => this._makePrice(gallons)}
          />
        </View>


        {/* price */}
        <View style={{marginTop: 10}}>
          <Image style={styles.priceTag} source={require('./../components/images/priceTag.png')}/>
          <Text style={styles.priceText}>${this.state.gasPrice}</Text>
        </View>


        {/* comments */}
        <Text style={styles.commentsTitle}>Comments</Text>
        <TextInput
          maxLength={100}
          multiline={true}
          numberOfLines={4}
          style={styles.commentsBox}
          onChangeText={(comments) => this.setState({comments: comments})}
          placeholder={'I am wearing a yellow coat... Im under the red billboard...'}
        />


        {/* order button */}
        <TouchableOpacity style={styles.confirmBtn} onPress={this._makeRequest}>
          <Text style={styles.confirmText}>{this.state.confirmText}</Text>
        </TouchableOpacity>
      </View>;
    }

    return pickScreen;
  }


  // make price
  _makePrice(gallons) {
    let total;
    switch(this.state.gasType) {
      case '87':
        total = (((this.state.gas87 * gallons) * 0.08) + (this.state.gas87 * gallons)).toFixed(2);
        this.setState({gallons: gallons, gasPrice: total});
        break;
      case '89':
        total = (((this.state.gas89 * gallons) * 0.08) + (this.state.gas89 * gallons)).toFixed(2);
        this.setState({gallons: gallons, gasPrice: total});
        break;
      case '93':
        total = (((this.state.gas93 * gallons) * 0.08) + (this.state.gas93 * gallons)).toFixed(2);
        this.setState({gallons: gallons, gasPrice: total});
        break;
      case 'D':
        total = (((this.state.gasD * gallons) * 0.08) + (this.state.gasD * gallons)).toFixed(2);
        this.setState({gallons: gallons, gasPrice: total});
        break;
    }
  }


  // make request
  _makeRequest() {
    if (this.state.confirmText == 'Confirm?') {
      // send to firebase
      const myRequest = {
        time: new Date(),
        price: this.state.gasPrice,
        gasType: this.state.gasType,
        gallonsNeeded: this.state.gallons,
        comments: this.state.comments
      };
      firebase.database().ref().child(`users/${this.state.uid}/requests`).set(myRequest).then(() => {
        alert('Your gas in on the way!!');
        this.setState({confirmText: 'GetGas'});
      })
    }


    // change value
    this.setState({confirmText: 'Confirm?'});
  }


  // cancel
  _cancel() {
    this.setState({
      gasType: '87',
      gallons: 1,
      gasPrice: 0,
      comments: '',
      confirmText: 'GetGas',
      requestModal: false      
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
  
  
  // map view
  map: {
    top: 70,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
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


  // request
  requestMdl: {
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
  carouselCont: {
    padding: 0
  },
  slide: {
    width: width * 0.85,
    height: height * 0.72,
  },
  requestExit: {
    width: 50,
    height: 50
  },
  requestTitle: {
    fontSize: 26,
    marginTop: -40,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'rgb(149, 149, 149)'
  },
  slideTitle: {
    fontSize: 24,
    marginTop: 10,
    alignSelf: 'center',
    color: 'rgb(149, 149, 149)'
  },
  optionTitles: {
    fontSize: 22,
    marginRight: 5,
    color: 'rgb(182, 182, 182)'
  },
  checkT: {
    width: 30,
    height: 30,
    marginTop: -25,
  },
  checkF: {
    display: 'none'
  },
  nextBtn: {
    right: 10,
    width: 30,
    height: 30,
    bottom: 10,
    borderRadius: 15,
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'red',
    justifyContent: 'center'
  },
  nextText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  prevBtn: {
    left: 10,
    width: 30,
    height: 30,
    bottom: 10,
    borderRadius: 15,
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'red',
    justifyContent: 'center'
  },
  prevText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },


  // custom 
  gasBtns: {
    width: 45,
    height: 45,
    marginLeft: 3,
    marginRight: 3,
    borderWidth: 2,
    borderRadius: 18,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gasText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(182, 182, 182)'
  },
  gllnsInput: {
    width: 35,
    height: 40,
    marginLeft: 5,
    paddingLeft: 2,
    textAlign: 'center',
    borderColor: 'grey',
    borderBottomWidth: 2,
    color: 'rgb(182, 182, 182)'
  },
  commentsTitle: {
    fontSize: 22,
    marginTop: 10,
    marginLeft: 8,
    color: 'rgb(182, 182, 182)',
    backgroundColor: 'transparent'
  },
  commentsBox: {
    marginTop: 5,
    marginLeft: 8,
    borderWidth: 2,
    paddingLeft: 6,
    borderRadius: 18,
    borderColor: 'grey',
    width: width * 0.52,
    height: height * 0.15
  },
  priceTag: {
    top: 20,
    right: 10,
    width: 84,
    height: 84,
    position: 'absolute',
    transform: [{rotate: '-75deg'}]
  },
  priceText: {
    top: 48,
    right: 28,
    fontSize: 16,
    color: 'black',
    position: 'absolute',
    backgroundColor: 'transparent',
    transform: [{rotate: '-30deg'}],
    fontFamily: 'Futura-CondensedExtraBold'
  },
  confirmBtn: {
    height: 50,
    width: width * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#66bb6a',
    marginTop: (height * 0.72) - 425
  },
  confirmText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  }
});


// export - find gas stations
export default Home;