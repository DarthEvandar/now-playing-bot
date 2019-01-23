import * as React from 'react'
import ReactLoading from 'react-loading';
import axios from 'axios';
import './Dashboard.css';
import qs from 'qs';
import tmi from 'tmi.js';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Redirect } from 'react-router';

export default class Dashboard extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        const opts = {
            identity: {
              username: 'now_playing_bot',
              password: localStorage.getItem('twitch.oauth')
            },
            channels: [
              localStorage.getItem('twitch.user')
            ]
        };
        this.state = {
            nowPlaying: 'Nothing Playing',
            twitchLoading: false,
            client: new tmi.client(opts),
            resetAuth: false
        }
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
            .then((response) => this.setState( { nowPlaying: `${response.data.item.name} by ${response.data.item.artists[0].name}`}))
            .catch((error) => this.setState( {nowPlaying: 'Nothing Playing'} ))
            .then(() => setTimeout(() => this.getNowPlaying(), 10000));
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
        this.state.client.on('message', (target: any, context: any, msg: string, self: any) => {
        if (self) { return; }

        const commandName = msg.trim();
        
        if (commandName === '!song' || commandName === '!nowplaying') {
            this.state.client.say(target, `Now playing: ${this.state.nowPlaying}`);
            console.log(`* Executed ${commandName} command`);
        } else {
            console.log(`* Unknown command ${commandName}`);
        }
        });
        this.state.client.on('connected', (addr: any, port: any) => this.setState({ twitchLoading: false }));
        this.state.client.connect();
    }

    render() {
        if (this.state.resetAuth) {
            return <Redirect to="/" />
        }
        const theme = createMuiTheme({
            palette: {
              primary: { main: '#6441A4' },
              secondary: { main: '#6441A4' }
            },
            typography: {
                useNextVariants: true,
            }
        });
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
                    <br/>
                    <MuiThemeProvider theme={theme}>
                        <Button variant={'contained'} color={'primary'} onClick={() => {
                            localStorage.clear();
                            this.setState( {resetAuth: true } );
                        }}>
                            Reset account settings
                        </Button>
                    </MuiThemeProvider>
                    {this.state.twitchLoading && (
                        <ReactLoading type={'cylon'} color={'#6441A4'} height={'20%'} width={'20%'} />
                    )}
                </header>
            </div>
        )
    }
}