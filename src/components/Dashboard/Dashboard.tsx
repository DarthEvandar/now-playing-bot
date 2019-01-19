import * as React from 'react'
import axios from 'axios';
import './Dashboard.css';
import qs from 'qs';
import tmi from 'tmi.js';

export default class Dashboard extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { nowPlaying: 'Nothing Playing' }
        this.updateSpotifyTokens();
        this.establishTwitch();
    }

    getNowPlaying = () => {
        this.setState({ nowPlaying: 'Loading' })
        const accessToken = localStorage.getItem('spotify.access_token');
        const options = {
            method: 'GET',
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };
        axios(options)
            .then((response) => {
                this.setState( {nowPlaying: response.data.item.name} );
            })
            .catch((error) => {
                this.setState( {nowPlaying: 'Nothing Playing'} );
            })
            .then(() => {
                setTimeout(() => this.getNowPlaying(), 10000);
            });
    }

    updateSpotifyTokens = () => {
        console.log('refreshing spotify tokens');
        const client_id = '2c1589f5c9a6426487bbf1f7fd3875a7';
        const client_secret = '979cc4917f72461298f9405e27280008';
        const refreshToken = localStorage.getItem('spotify.refresh_token');
        const data = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }
        const options = {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
            data: qs.stringify(data)
        }
        axios(options).then((response) => {
            if (response.data.refresh_token) {
                localStorage.setItem('spotify.refresh_token', response.data.refresh_token);
            }
            localStorage.setItem('spotify.access_token', response.data.access_token);
            localStorage.setItem('spotify.expires_in', response.data.expires_in.toString());
            this.getNowPlaying();
        })
        setTimeout(() => this.updateSpotifyTokens(), 1000 * parseInt(localStorage.getItem('spotify.expires_in') || '3600'));
    }

    establishTwitch = () => {
        const opts = {
            identity: {
              username: 'now_playing_bot',
              password: localStorage.getItem('twitch.oauth')
            },
            channels: [
              localStorage.getItem('twitch.user')
            ]
          };
          
          const client = new tmi.client(opts);
          
          client.on('message', (target: any, context: any, msg: string, self: any) => {
            if (self) { return; }
      
            const commandName = msg.trim();
          
            if (commandName === '!song' || commandName === '!nowplaying') {
              client.say(target, `Now playing: ${this.state.nowPlaying}`);
              console.log(`* Executed ${commandName} command`);
            } else {
              console.log(`* Unknown command ${commandName}`);
            }
          });
          client.on('connected', (addr: any, port: any) => console.log(`* Connected to ${addr}:${port}`));
          client.connect();
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="App-text">
                        Now Playing: {this.state.nowPlaying}
                    </div>
                    <div className="App-text">
                        Spotify: {localStorage.getItem('spotify.access_token')?'Active':'Inactive'}
                    </div>
                    <div className="App-text">
                        Twitch: {localStorage.getItem('twitch.user')}
                    </div>
                </header>
            </div>
        )
    }
}