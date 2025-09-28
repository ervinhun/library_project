import Home from './pages/Home'
import './index.css'
import InitializeData from "./InitializeData.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./pages/structure/Layout.tsx";
import {Authors} from "./pages/Authors.tsx";
import {Genres} from "./pages/Genres.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,   // 👈 Wrap all routes with Layout
        children: [
            { path: "/", element: <Home /> },
            { path: "/authors", element: <Authors /> },
            { path: "/genres", element: <Genres />},
            { path: "/book/:id", element: <p>Book detail</p>},
            { path: "/authors/:id", element: <p>Author detail</p>},
            { path: "/genres/:id", element: <p>Genre detail</p> },
        ],
    },
]);

function App() {
    InitializeData();
    return <RouterProvider router={router}/>
}

export default App
