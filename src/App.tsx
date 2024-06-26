// src/App.tsx
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import React from 'react';
import Home from './Home';
import Form from './PCEC';
import Code from './Code';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Form />,
  },
  {
    path: "/english",
    element: <Form />,
  },
  {
    path: "/spanish",
    element: <Form english={false} />,
  },
  {
    path: "/code/:code",
    element: <Code />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />
};

export default App;
