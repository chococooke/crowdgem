import React, { useEffect } from "react";

const FundraiseStatusBar = ({ currentFunding, targetFunding, reload, eventEnded }) => {
    const calculateProgress = () => {
        const progress = (currentFunding / targetFunding) * 100;
        return progress > 100 ? 100 : progress;
    };

    const progressBarStyle = {
        width: `${calculateProgress()}%`,
    };

    useEffect(() => {
        console.log("Progress");
    }, [reload, eventEnded])

    return (
        <div className="fundraise-status-bar">
            {eventEnded && Math.floor(currentFunding) === 0 ? "This project didn't collect any funds" : ""}
            <div className="fundraise-status-bar__progress" style={progressBarStyle}>
                <span className="fundraise-status-bar__text">
                    {`${calculateProgress().toFixed(2)}%`}
                </span>
            </div>
        </div>
    );
};

export default FundraiseStatusBar;
