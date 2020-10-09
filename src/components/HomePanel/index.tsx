import React from 'react';
import {connect} from 'react-redux';

import {alertWarning} from "../../store/alerts/actions";
import {logout, addNewPointStart, addNewPointEnd, getPoints} from "../../store/users/actions";

import {AppState} from "../../store";
import {AlertState} from "../../store/alerts/types";
import {UserPanelState} from "../../store/users/types";

interface HomePanelProps {
    alert: AlertState;
    userPanel: UserPanelState;
    alertWarning: typeof alertWarning;
    logout: typeof logout;
    addNewPointStart: typeof addNewPointStart;
    addNewPointEnd: typeof addNewPointEnd;
    getPoints: typeof getPoints;
}

class HomePanel extends React.Component<HomePanelProps> {
    constructor(props: HomePanelProps) {
        super(props);

        this.handleAddNewPointButton = this.handleAddNewPointButton.bind(this);
    }

    handleAddNewPointButton() {
        if (this.props.userPanel.addingNewPoint) {
            this.props.addNewPointEnd();
        } else {
            this.props.alertWarning('Выберете точку на карте');
            this.props.addNewPointStart();
        }
    }

    componentDidMount() {
        if (this.props.userPanel.loggedIn) {
            this.props.getPoints(this.props.userPanel.user.username);
        }
    }

    componentDidUpdate(prevProps: Readonly<HomePanelProps>, prevState: Readonly<{}>, snapshot?: any) {
        if (!prevProps.userPanel.loggedIn && this.props.userPanel.loggedIn) {
            this.props.getPoints(this.props.userPanel.user.username);
        }
    }

    render() {
        return (
           <div className='new-point-form'>
                <input className='new-point-form__input'
                       type='button'
                       value='Добавить новую точку'
                       onClick={this.handleAddNewPointButton}
                />
                <input className='new-point-form__input'
                       type='button'
                       value='Выйти'
                       onClick={this.props.logout}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    alert: state.alert,
    userPanel: state.userPanel,
});

export default connect(
    mapStateToProps,
    {alertWarning, logout, addNewPointStart, addNewPointEnd, getPoints}
)(HomePanel);