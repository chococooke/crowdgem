import { useEffect, useState } from "react";

const CountdownTimer = ({ endTimestamp }) => {
    const calculateTimeLeft = () => {
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = endTimestamp - now;

        if (timeLeft < 0) {
            return {
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }

        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        return {
            hours,
            minutes,
            seconds,
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="countdown-timer">
            <span className="countdown-timer__hours">
                {timeLeft.hours.toString().padStart(2, "0")}
            </span> :
            <span className="countdown-timer__minutes">
                {timeLeft.minutes.toString().padStart(2, "0")}
            </span> :
            <span className="countdown-timer__seconds">
                {timeLeft.seconds.toString().padStart(2, "0")}
            </span>
        </div>
    );
};

export default CountdownTimer;
