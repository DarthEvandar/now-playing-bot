import React from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import twitch from '../../../assets/twitch.svg';
import './TwitchLandingPage.css';

export default class TwitchLandingPage extends React.Component<any, any> {
      
    constructor(props: any) {
        super(props);
        this.state = { textFieldValue: '' };
    }

    handleTextFieldChange = (e: any) => this.setState({ textFieldValue: e.target.value });
    
    handleTwitchAuth = () => {
        localStorage.setItem('twitch.oauth', 'oauth:9blmzq35j4m00uj06wcvea9i86rv8c');
        localStorage.setItem('twitch.user', this.state.textFieldValue);
        location.href = 'http://localhost:5000/twitch/auth';
    }

    render() {
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
            <div className="Twitch">
                <header className="Twitch-header">
                    <img src={twitch} className="Twitch-logo" alt="logo" />
                    <br/>
                    <MuiThemeProvider theme={theme}>
                    <TextField  type="text" placeholder="Enter Username" onChange={this.handleTextFieldChange}/>
                    <br/>
                    <Button variant={'contained'} color={'primary'} onClick = {() => this.handleTwitchAuth()}>
                        Authorize
                    </Button>
                    </MuiThemeProvider>
                </header>
            </div>
        );
    }
}