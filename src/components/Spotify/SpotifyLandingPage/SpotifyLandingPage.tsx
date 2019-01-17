import * as React from 'react';
import './SpotifyLandingPage.css';
import spotify from '../../../assets/spotify.svg';

// TODO:
// Refresh spotify tokens
// Twitch bot

class SpotifyLandingPage extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
  }

  handleSpotifyAuth = () => {
    location.href = 
      'https://accounts.spotify.com/authorize' +
      '?client_id=2c1589f5c9a6426487bbf1f7fd3875a7' +
      '&response_type=code' +
      '&redirect_uri=' + 'http://localhost:5000/spotify/auth/' +
      '&scope=user-read-currently-playing';
  }

  render() {
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

export default SpotifyLandingPage
