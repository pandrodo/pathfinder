import React from 'react';
import { connect } from 'react-redux';

import { setStartPoint, setEndPoint, setAlgorithm } from "../store/controlPanel/actions";
import { ControlPanelState } from "../store/controlPanel/types";
import { UserPanelState } from "../store/users/types";
import { AppState } from "../store";

import LoginPanelInterface from "./LoginPanelInterface";
import HomePanelInterface from "./HomePanelInterface";

interface ControlPanelInterfaceProps {
    controlPanel: ControlPanelState;
    userPanel: UserPanelState;
    setStartPoint: typeof setStartPoint;
    setEndPoint: typeof setEndPoint;
    setAlgorithm: typeof setAlgorithm;
}

class ControlPanelInterface extends React.Component<ControlPanelInterfaceProps> {
    constructor(props: ControlPanelInterfaceProps) {
        super(props);

        //привязка изменений селекторов выбора начала/конца пути и алгоритма к actions redux store
        this.handleStartPointChange = this.handleStartPointChange.bind(this);
        this.handleEndPointChange = this.handleEndPointChange.bind(this);
        this.handleAlgorithmChange = this.handleAlgorithmChange.bind(this);
    }

    handleStartPointChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.setStartPoint(event.target.value);
    }

    handleEndPointChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.setEndPoint(event.target.value);
    }

    handleAlgorithmChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.setAlgorithm(event.target.value);
    }

    render() {
        let options: JSX.Element[] = this.props.userPanel.user.points.map((point) =>
                <option key={point.nodeId} value={point.nodeId}>{point.name}</option>
            );

        return (
            <div className='control-panel d-flex'>
            <div className='pathfinder-interface'>
                <div className='control-panel-selector'>
                    <label>
                        Начало
                        <select className='custom-select' value={this.props.controlPanel.startPoint} onChange={this.handleStartPointChange}>
                            {options}
                        </select>
                    </label>
                </div>
                <div className='control-panel-selector'>
                    <label>
                        Конец
                        <select className='custom-select' value={this.props.controlPanel.endPoint} onChange={this.handleEndPointChange}>
                            {options}
                        </select>
                    </label>
                </div>
                <div className='control-panel-selector'>
                    <label>
                        Алгоритм
                        <select className='custom-select' value={this.props.controlPanel.algorithm} onChange={this.handleAlgorithmChange}>
                            <option value='aGreedy'>Greedy A</option>
                            <option value='aStar'>A Star</option>
                            <option value='dijkstra'>Dijkstra</option>
                        </select>
                    </label>
                </div>
                {/*<div className='control-panel-input'>*/}
                {/*    <label>*/}
                {/*        Расстояние*/}
                {/*        <select className='custom-select' defaultValue='distance' disabled>*/}
                {/*            <option value='distance'>{this.props.controlPanel.pathLength}</option>*/}
                {/*        </select>*/}
                {/*    </label>*/}
                {/*</div>*/}
        </div>
                <LoginPanelInterface/>
                <HomePanelInterface/>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    controlPanel: state.controlPanel,
    userPanel: state.userPanel,
});

export default connect(
    mapStateToProps,
    { setStartPoint, setEndPoint, setAlgorithm }
)(ControlPanelInterface);