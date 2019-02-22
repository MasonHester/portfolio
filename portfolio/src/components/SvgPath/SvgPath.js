import React from "react";

const SvgPath = props => (
    <>
        <path key={props.i} /* ref={svgpath => {this[`path${props.i}`] = svgpath}} */ stroke="#111111" strokeWidth="2" fill={props.sky} d={props.path}></path>
    </>
);

export default SvgPath;