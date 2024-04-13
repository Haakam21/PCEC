// src/Code.tsx
import React from 'react';
import { Link, useParams } from "react-router-dom";
import Logo from './Logo';

const Code: React.FC = () => {
    const { code } = useParams();

    return (
        <div className='container mx-auto flex flex-col items-center p-20 space-y-6'>
            <Logo />

            <h3 className='text-2xl'>Your code is</h3>
            <h1 className='text-3xl font-medium'>{code}</h1>
            <h2 className='text-xl text-red-500'>Please return to the table and show this screen to the screening organizers</h2>

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
  