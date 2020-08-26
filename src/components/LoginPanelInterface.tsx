import React from 'react';
import { connect } from 'react-redux';

import { login, logout, registration } from "../store/users/actions";

import { AppState } from "../store";
import { AlertState } from "../store/alerts/types";
import { UserPanelState } from "../store/users/types";

interface LoginPanelInterfaceProps {
    userPanel: UserPanelState;
    alert: AlertState;
    login: typeof login;
    logout: typeof logout;
    registration: typeof registration;
}

interface LoginPanelInterfaceState {
    username: string;
    password: string;
    submitted: boolean;
    submitButton: string;
}

class LoginPanelInterface extends React.Component<LoginPanelInterfaceProps, LoginPanelInterfaceState> {
    constructor(props: LoginPanelInterfaceProps) {
        super(props);

        this.state = {
            username: '',
            password: '',
            submitted: false,
            submitButton: ''
        }

        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleRegistrationClick = this.handleRegistrationClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ password: e.target.value });
    }

    handleLoginClick() {
        this.setState({ submitButton: 'login'});
    }

    handleRegistrationClick() {
        this.setState({ submitButton: 'registration'});
    }

    handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;

        if(username && password) {
            if(this.state.submitButton === 'login') {
                this.props.login(username, password);
            }

            if(this.state.submitButton === 'registration') {
                this.props.registration(username, password);
            }
        }
    }

    render() {
        if(!this.props.userPanel.loggedIn) {
            return (
                <div className='login-interface ml-auto'>
                    <form className='form-inline' name='login-form' onSubmit={this.handleSubmit}>
                        <div className={`login-interface-alert alert ${this.props.alert.style}`}>
                            {this.props.alert.message}
                        </div>
                        <div className='login-interface-username d-flex flex-column'>
                            <label>Имя пользователя</label>
                            <input className='form-control' type='text' name='username' autoComplete='on' value={this.state.username} onChange={this.handleUsernameChange}/>
                        </div>
                        <div className='login-interface-password d-flex flex-column'>
                            <label>Пароль</label>
                            <input className='form-control' type='password' name='password' autoComplete='on' value={this.state.password} onChange={this.handlePasswordChange}/>
                        </div>
                        <div className='login-interface-submit'>
                            <input className='btn btn-dark login' type='submit' value='Войти' onClick={this.handleLoginClick}/>
                        </div>
                        <div className='login-interface-submit'>
                            <input className='btn btn-dark registration' type='submit' value='Регистрация' onClick={this.handleRegistrationClick}/>
                        </div>
                    </form>
                </div>
            );
        }
        return null;
    }
}

const mapStateToProps = (state: AppState) => ({
    alert: state.alert,
    userPanel: state.userPanel,
});

export default connect(
    mapStateToProps,
    { login, logout, registration }
)(LoginPanelInterface);