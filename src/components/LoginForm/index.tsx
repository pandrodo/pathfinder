import React from 'react';
import {connect} from 'react-redux';

import './style.css'

import {login, logout, registration} from "../../store/users/actions";

import {AppState} from "../../store";
import {AlertState} from "../../store/alerts/types";
import {UserPanelState} from "../../store/users/types";

interface LoginFormProps {
    userPanel: UserPanelState;
    alert: AlertState;
    login: typeof login;
    logout: typeof logout;
    registration: typeof registration;
}

interface LoginFormState {
    username: string;
    password: string;
    submitted: boolean;
    submitButton: string;
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
    constructor(props: LoginFormProps) {
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
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({password: e.target.value});
    }

    handleLoginClick() {
        this.setState({submitButton: 'login'});
    }

    handleRegistrationClick() {
        this.setState({submitButton: 'registration'});
    }

    handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        this.setState({submitted: true});
        const {username, password} = this.state;

        if (username && password) {
            if (this.state.submitButton === 'login') {
                this.props.login(username, password);
            }

            if (this.state.submitButton === 'registration') {
                this.props.registration(username, password);
            }
        }
    }

    render() {
        return (
            <form className='login-form' name='login-form' onSubmit={this.handleSubmit}>
                <div className='login-form__item'>
                    <label className='login-form__label'>
                        Логин
                    </label>
                    <input className='login-form__input'
                           type='text'
                           name='username'
                           autoComplete='on'
                           value={this.state.username}
                           onChange={this.handleUsernameChange}
                    />
                </div>
                <div className='login-form__item'>
                    <label className='login-form__label'>
                        Пароль
                    </label>
                    <input className='login-form__input'
                           type='password'
                           name='password'
                           autoComplete='on'
                           value={this.state.password}
                           onChange={this.handlePasswordChange}
                    />
                </div>
                <div className='login-form__item'>
                    <input className='login-form__button'
                           type='submit'
                           value='Войти'
                           onClick={this.handleLoginClick}
                    />
                </div>
                <div className='login-form__item'>
                    <input className='login-form__button'
                           type='submit'
                           value='Регистрация'
                           onClick={this.handleRegistrationClick}
                    />
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    alert: state.alert,
    userPanel: state.userPanel,
});

export default connect(
    mapStateToProps,
    {login, logout, registration}
)(LoginForm);