import React from 'react';
import { connect } from 'react-redux';

import { alertWarning } from "../store/alerts/actions";
import { logout, addNewPointStart, addNewPointEnd, getPoints } from "../store/users/actions";

import { AppState } from "../store";
import { AlertState } from "../store/alerts/types";
import { UserPanelState } from "../store/users/types";

interface HomePanelInterfaceProps {
    alert: AlertState;
    userPanel: UserPanelState;
    alertWarning: typeof alertWarning;
    logout: typeof logout;
    addNewPointStart: typeof addNewPointStart;
    addNewPointEnd: typeof addNewPointEnd;
    getPoints: typeof getPoints;
}

class HomePanelInterface extends React.Component<HomePanelInterfaceProps> {
    constructor(props: HomePanelInterfaceProps) {
        super(props);

        this.handleAddNewPointButton = this.handleAddNewPointButton.bind(this);
    }

    handleAddNewPointButton() {
        if(this.props.userPanel.addingNewPoint) {
            this.props.addNewPointEnd();
        } else {
            this.props.alertWarning('Выберете точку на карте');
            this.props.addNewPointStart();
        }
    }

    componentDidMount() {
        if(this.props.userPanel.loggedIn) {
            this.props.getPoints(this.props.userPanel.user.username);
        }
    }

    componentDidUpdate(prevProps: Readonly<HomePanelInterfaceProps>, prevState: Readonly<{}>, snapshot?: any) {
        if(!prevProps.userPanel.loggedIn && this.props.userPanel.loggedIn) {
            this.props.getPoints(this.props.userPanel.user.username);
        }
    }

    render() {
        if(this.props.userPanel.loggedIn) {
            return (
                <div className='home-interface ml-auto'>
                    <form className='form-inline' name='home-form'>
                        <div className={`home-interface-alert alert ${this.props.alert.style}`}>
                            {this.props.alert.message}
                        </div>
                        <div className='home-interface-add-new-point-button'>
                            <input className='btn btn-dark' type='button' value='Добавить новую точку' onClick={this.handleAddNewPointButton}/>
                        </div>
                        <div className='home-interface-logout'>
                            <input className='btn btn-dark' type='button' name='logout' value='Выйти' onClick={this.props.logout}/>
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
    { alertWarning, logout, addNewPointStart, addNewPointEnd, getPoints }
)(HomePanelInterface);