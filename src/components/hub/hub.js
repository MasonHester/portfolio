import React, { Component } from 'react';

import threeEntryPoint from "./threeJS/threeEntry"

export default class Hub extends Component {
    
    // Thanks to Pierfrancesco Soffritti for his guide on integrating Three JS and React. Visit his portfolio here: https://pierfrancescosoffritti.com
    
    componentDidMount() {
        threeEntryPoint(this.threeRootElement);
    }

    render () {
        return (
            <div className="hub--container" ref={element => this.threeRootElement = element} />
        );
    }
}