// src/Code.tsx
import React from 'react';
import { Link } from "react-router-dom";
import Logo from './Logo';

const Home: React.FC = () => {
    return (
        <div className='container mx-auto flex flex-col items-center p-20 space-y-6'>
            <Logo />
            <Link to="/english">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    English
                </button>
            </Link>
            {/* <Link to="/spanish">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Spanish
                </button>
            </Link> */}
        </div>
    )
};

export default Home;
  