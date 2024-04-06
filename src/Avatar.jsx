import React from 'react';

const Avatar = ({ userName, userId, online }) => {
    const colors = [
        '#FF5733',
        '#FFBD33',
        '#33FF57',
        '#336EFF',
        '#FF33E2',
        '#33FFEC',
        '#FFE333',
        '#E433FF',
        '#33FFC7',
    ];
    const userIdBase10 = parseInt(userId, 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];

    return (
        <div className="relative">
            <div
                className="w-8 h-8 rounded-[50%] flex items-center justify-center max600:w-11 max600:h-11"
                style={{ backgroundColor: color }}
            >
                <div className='font-bold opacity-60 max600:text-[1.2rem]'>{userName[0]}</div>
            </div>
            {online && (
                <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
            )}
            {!online && (
                <div className="absolute w-3 h-3 bg-[#ff6f6a] bottom-0 right-0 rounded-full border border-white"></div>
            )}
        </div>
    );
};

export default Avatar;
