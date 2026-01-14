import React from 'react';

/**
 * Ikon som dette finnes ikke i aksel.
 */
const WarningCircleIcon = (props: React.SVGProps<SVGSVGElement>) => {
    const height = props.height || 24;
    const width = props.width || 24;
    return (
        <svg height={height} width={width} viewBox={`0 0 24 24`} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 16.5C12.5523 16.5 13 16.9477 13 17.5C13 18.0523 12.5523 18.5 12 18.5C11.4477 18.5 11 18.0523 11 17.5C11 16.9477 11.4477 16.5 12 16.5ZM12 5.75C12.4142 5.75 12.75 6.08579 12.75 6.5V14.5C12.75 14.9142 12.4142 15.25 12 15.25C11.5858 15.25 11.25 14.9142 11.25 14.5V6.5C11.25 6.08579 11.5858 5.75 12 5.75Z"
                fill="#CA5000"
            />
            <path
                d="M12 2.25C17.3848 2.25 21.75 6.61522 21.75 12C21.75 17.3848 17.3848 21.75 12 21.75C6.61522 21.75 2.25 17.3848 2.25 12C2.25 6.61522 6.61522 2.25 12 2.25ZM12 3.75C7.44365 3.75 3.75 7.44365 3.75 12C3.75 16.5563 7.44365 20.25 12 20.25C16.5563 20.25 20.25 16.5563 20.25 12C20.25 7.44365 16.5563 3.75 12 3.75Z"
                fill="#CA5000"
            />
        </svg>
    );
};

export default WarningCircleIcon;
