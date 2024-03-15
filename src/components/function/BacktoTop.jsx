import React, { useState } from 'react';
import { RxPinTop } from "react-icons/rx";

const BacktoTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const showThreshold = 200;

        if (scrollY > showThreshold) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    React.useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <RxPinTop className="back-to-top" onClick={scrollToTop} />
            )}
        </>
    );
};

export default BacktoTop;
