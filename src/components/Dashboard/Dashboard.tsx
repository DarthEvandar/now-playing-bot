import * as React from 'react'
import axios from 'axios';
import './Dashboard.css';
import qs from 'qs';

export default class Dashboard extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { nowPlaying: 'Nothing Playing' }
        this.updateSpotifyTokens();
        this.getNowPlaying();
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
        axios(options).then((response) => {
            this.setState({nowPlaying: response.data.item.name});
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
        })
        setTimeout(() => this.updateSpotifyTokens(), 1000 * parseInt(localStorage.getItem('spotify.expires_in') || '3600'));
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="App-text">
                    Now Playing: {this.state.nowPlaying}
                    </div>
                </header>
            </div>
        )
    }
}