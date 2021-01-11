import React from 'react';

import ControlPanel from "../ControlPanel";
import LeafletMap from "../LeafletMap";

import './style.scss';

const App = () => {
    return (
        <div className='application'>
            <ControlPanel />
            <LeafletMap />
        </div>
    );
}

export default App;
