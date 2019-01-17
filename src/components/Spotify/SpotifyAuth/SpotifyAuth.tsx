import * as React from 'react';
import ReactLoading from 'react-loading';
import './SpotifyAuth.css';
import qs from 'qs';
import axios from 'axios';
import { Redirect } from 'react-router';

export default class SpotifyAuth extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { loadingComplete: false };
        setTimeout(() => this.getToken(), 1000);
    }

    getToken = () => {
        console.log(window.location.href.split("=")[1] === '');
        const code = window.location.href.split('=')[1];
        const client_id = '2c1589f5c9a6426487bbf1f7fd3875a7';
        const client_secret = '979cc4917f72461298f9405e27280008';
        const data = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:5000/spotify/auth/'
        };  
        const options = {
            method: 'POST',
            headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
            data: qs.stringify(data),
            url: 'https://accounts.spotify.com/api/token' 
        };
        axios(options).then((response) => {
            localStorage.setItem('spotify.access_token', response.data.access_token);
            localStorage.setItem('spotify.refresh_token', response.data.refresh_token);
            localStorage.setItem('spotify.expires_in', response.data.expires_in.toString());
            this.setState({ loadingComplete: true });
        });
    }

    render() {
        if (this.state.loadingComplete) {
            return <Redirect to="/dashboard"/>
        }
        return (
            <div className="Spotify">
                <header className="Spotify-header">
                    <ReactLoading type={'cylon'} color={'#1DB954'} height={'20%'} width={'20%'} />
                    <div className="Spotify-text">Exchanging Authorization Tokens</div>
                </header>
            </div>
        );
    }
}