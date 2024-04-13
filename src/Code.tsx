// src/Code.tsx
import React from 'react';
import { Link, useParams } from "react-router-dom";
import Logo from './Logo';

const Code: React.FC = () => {
    const { code } = useParams();

    return (
        <div className='container mx-auto flex flex-col items-center p-20 space-y-6'>
            <Logo />

            <h3 className='text-lg'>Your code is</h3>
            <h1 className='text-xl text-medium'>{code}</h1>
            <p className='text-md'>Please show this screen to a event organizer</p>

            <Link to="/">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Restart
                </button>
            </Link>
        </div>
    )
};

export default Code;
  