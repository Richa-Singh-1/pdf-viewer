import React from "react";
import { useEffect, useRef } from "react";
import './CircularSpinner.css';

const CircularSpinner = ({ percentCompleted, radius }): JSX.Element => {
    const percentElmRef = useRef(null);
    useEffect(() => {
        const percentElm = percentElmRef.current;
        const circumference = 2 * Math.PI * radius;
        if(percentElm) {
            percentElm.style.strokeDasharray = circumference;
            percentElm.style.strokeDashoffset = circumference * .9;
            percentElm.style.transition = "stroke-dashoffset .3s ease-in-out";
            const range_value = Number(percentCompleted);
            const value = circumference - (range_value / 100) * circumference;
            console.log('value ---', value);
                percentElm.style.strokeDashoffset = value;
        }
    }, [percentCompleted]);


    return (
        <svg x="0px" y="0px" width={`${radius}px`} height={`${radius}px`} viewBox="0 0 200 200">
            <circle className=""
                stroke="#d1d1d1"
                fill="none"
                stroke-width="15"
                cx="100" cy="100" r={radius}
            />
            <circle
                ref={percentElmRef}
                className="path"
                stroke="black"
                fill="none"
                stroke-width="15"
                cx="100" cy="100" r={radius}
            />
        </svg>
    );
};

export default CircularSpinner;