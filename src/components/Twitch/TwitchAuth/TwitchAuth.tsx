import React from "react";
import ReactLoading from 'react-loading';
import './TwitchAuth.css';
import { Redirect } from "react-router";

export default class TwitchAuth extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = { doneLoading: false };
        setTimeout(() => {
            this.redirect();
        }, 1000);
    }

    redirect = () => {
        this.setState( { doneLoading: true });
    }

    render() {
        if (this.state.doneLoading) {
            return <Redirect to="/" />
        }
        return (
            <div className="Twitch">
                <header className="Twitch-header">
                    <ReactLoading type={'cylon'} color={'#6441A4'} height={'20%'} width={'20%'} />
                    <div className="Twitch-text">Authorizing</div>
                </header>
            </div>
        )
    }
}