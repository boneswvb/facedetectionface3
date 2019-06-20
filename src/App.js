import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
 apiKey: '0a298fbb631e454d9b3f5593734b9a04'
});

const particleOptions = {
particles: {
     number: {
      value: 50,
      density: {
        enable: true,
        value_area: 400
      }
    }
  }
 }

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)

  }
}

displayFaceBox = (box) => {
  console.log(box);
  this.setState({ box: box })
}

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input})
  app.models.predict(
Clarifai.FACE_DETECT_MODEL,
this.state.input)
.then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
.catch(err => console.log(err));
}

OnRouteCange = (route) => {
  if (route === 'signout') {
    this.setState({isSignedIn: false})
  }else if(route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

	render() {
  return (
    <div className="App">
    	 <Particles className='particles'
        params={ particleOptions } 
        />
        
      <Navigation isSignedIn={this.state.isSignedIn} OnRouteCange={ this.OnRouteCange } />
      {this.state.route === 'home'
      ?<div>
        <Logo />
        <Rank />
        <ImageLinkForm 
        onInputChange={ this.onInputChange }
        onButtonSubmit={ this.onButtonSubmit }
        />
        <FaceRecognition
        box={ this.state.box } 
        imageUrl={this.state.imageUrl}
        />
        </div>
        :(
          this.state.route === 'signin'?
          <Signin OnRouteCange={this.OnRouteCange} />
          :<Register OnRouteCange={this.OnRouteCange} />
        )
      }
    </div>
  	);
	}
}

export default App;
