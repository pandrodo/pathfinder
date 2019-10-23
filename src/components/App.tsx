import React from 'react';
import './App.css';

import ControlPanelInterface from "./ControlPanelInterface";
import MapPanelInterface from "./MapPanelInterface";

const App: React.FunctionComponent = () => {
    return (
        <div className='App'>
            <ControlPanelInterface />
            <MapPanelInterface />
        </div>
    );
};

export default App;
