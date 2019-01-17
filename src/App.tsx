import * as React from 'react';
import * as qs from 'qs';
import axios from 'axios';
import './App.css';
import spotify from './spotify.svg';


// TODO:
// "running" page / routing
// Refresh spotify tokens
// Twitch bot

class App extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    
    this.state = {
      nowPlaying: 'Nothing Playing',
      access_token: '',
      refresh_token: '',
      expires_in: -1,
      time_set: new Date()
    }
  }
  
  

  nowPlaying = 'Nothing Playing';

  handleSpotifyAuth = () => {
    location.href = 
      'https://accounts.spotify.com/authorize' +
      '?client_id=2c1589f5c9a6426487bbf1f7fd3875a7' +
      '&response_type=code' +
      '&redirect_uri=' + 'http://localhost:5000/' +
      '&scope=user-read-currently-playing';
  }

  getToken = () => {
    console.log(window.location.href.split("=")[1] === '');
    if (window.location.href.split("=")[1] !== null) {
      const code = window.location.href.split('=')[1];
      const client_id = '2c1589f5c9a6426487bbf1f7fd3875a7';
      const client_secret = '979cc4917f72461298f9405e27280008';
      const data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:5000/'
      };  
      const options = {
        method: 'POST',
        headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
        data: qs.stringify(data),
        url: 'https://accounts.spotify.com/api/token' 
      };
      axios(options).then((response) => {
        this.getNowPlaying();
        this.setState(
          {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: response.data.expires_in,
            time_set: new Date()
          }
        );
        return true;
      });
    } else {
      return false;
    }
  }

  getNowPlaying = () => {
    const authCode: string = this.state.access_token;
    console.log(App);
    const options = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authCode}`
        }
    };
    axios(options).then((response) => {
        this.setState({nowPlaying: response.data.item.name});
    });
  }

  render() {
    if (this.getToken()) {
      return (
        <div className="Dashboard">
          <header className="Dashboard-header">
            Now Playing
            <br></br>
            {this.nowPlaying}
          </header>
      </div>
      )
    } else
    return (
      <div className="App">
        <header className="App-header">
          <img src={spotify} className="App-logo" alt="logo" />
          <br></br>
          <a
            className="App-link"
            href="#"
            onClick={this.handleSpotifyAuth}
          >
            Authorize Spotify
          </a>
        </header>
      </div>
    );
  }
}

export default App
