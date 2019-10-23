import React from 'react';
import { connect } from 'react-redux';

import { ControlPanelState } from "../store/controlPanel/types";
import { setStartPoint, setEndPoint, setAlgorithm } from "../store/controlPanel/actions";

interface ControlPanelInterfaceProps {
    startPoint: string;
    endPoint: string;
    algorithm: string;
    setStartPoint: typeof setStartPoint;
    setEndPoint: typeof setEndPoint;
    setAlgorithm: typeof setAlgorithm;
}

class ControlPanelInterface extends React.Component<ControlPanelInterfaceProps> {
    constructor(props: ControlPanelInterfaceProps) {
        super(props);

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
        return (
            <div className='control-panel'>
                <div className='control-panel-selector'>
                    <label>
                        Start Point
                    </label>
                    <select value={this.props.startPoint} onChange={this.handleStartPointChange}>
                        <option value='1788932701'>Дерево желаний</option>
                        <option value='582469522'>Музей Васнецовых</option>
                        <option value='135322595'>Филармония</option>
                    </select>
                </div>
                <div className='control-panel-selector'>
                    <label>
                        End Point
                        <select value={this.props.endPoint} onChange={this.handleEndPointChange}>
                            <option value='1788932701'>Дерево желаний</option>
                            <option value='582469522'>Музей Васнецовых</option>
                            <option value='135322595'>Филармония</option>
                        </select>
                    </label>
                </div>
                <div className='control-panel-selector'>
                    <label>
                        Algorithm
                        <select value={this.props.algorithm} onChange={this.handleAlgorithmChange}>
                            <option value='aGreedy'>Greedy A</option>
                            <option value='aStar'>A Star</option>
                            <option value='nba'>NBA</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: ControlPanelState) => ({
    startPoint: state.startPoint,
    endPoint: state.endPoint,
    algorithm: state.algorithm
});

export default connect(
    mapStateToProps,
    { setStartPoint, setEndPoint, setAlgorithm }
)(ControlPanelInterface);