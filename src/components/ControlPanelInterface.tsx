import React from 'react';
import { connect } from 'react-redux';

import { setStartPoint, setEndPoint, setAlgorithm } from "../store/controlPanel/actions";
import { AppState } from "../store";

interface ControlPanelInterfaceProps {
    startPoint: string;
    endPoint: string;
    algorithm: string;
    pathLength: string;
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
        return (
            <div className='control-panel'>
                <div className='control-panel-selector'>
                    <label>
                        Начало
                        <select className='custom-select' value={this.props.startPoint} onChange={this.handleStartPointChange}>
                            <option value='1788932701'>Дерево желаний</option>
                            <option value='582469522'>Музей Васнецовых</option>
                            <option value='135322595'>Филармония</option>
                            <option value='2715644743'>Вокзал</option>
                            <option value='265513434'>Факел</option>
                            <option value='277945806'>Дружба</option>
                            <option value='1832176667'>Кочуровский парк</option>
                            <option value='4076342498'>Зональный институт</option>
                            <option value='1787337924'>Диорама</option>
                            <option value='265513353'>Парк Победы</option>
                        </select>
                    </label>
                </div>
                <div className='control-panel-selector'>
                    <label>
                        Конец
                        <select className='custom-select' value={this.props.endPoint} onChange={this.handleEndPointChange}>
                            <option value='1788932701'>Дерево желаний</option>
                            <option value='582469522'>Музей Васнецовых</option>
                            <option value='135322595'>Филармония</option>
                            <option value='2715644743'>Вокзал</option>
                            <option value='265513434'>Факел</option>
                            <option value='277945806'>Дружба</option>
                            <option value='1832176667'>Кочуровский парк</option>
                            <option value='4076342498'>Зональный институт</option>
                            <option value='1787337924'>Диорама</option>
                            <option value='265513353'>Парк Победы</option>
                        </select>
                    </label>
                </div>
                <div className='control-panel-selector'>
                    <label>
                        Алгоритм
                        <select className='custom-select' value={this.props.algorithm} onChange={this.handleAlgorithmChange}>
                            <option value='aGreedy'>Greedy A</option>
                            <option value='aStar'>A Star</option>
                            <option value='dijkstra'>Dijkstra</option>
                        </select>
                    </label>
                </div>
                <div className='control-panel-input'>
                    <label>
                        Расстояние
                        <select className='custom-select' defaultValue='distance' disabled>
                            <option value='distance'>{this.props.pathLength}</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    startPoint: state.controlPanel.startPoint,
    endPoint: state.controlPanel.endPoint,
    algorithm: state.controlPanel.algorithm,
    pathLength: state.controlPanel.pathLength
});

export default connect(
    mapStateToProps,
    { setStartPoint, setEndPoint, setAlgorithm }
)(ControlPanelInterface);