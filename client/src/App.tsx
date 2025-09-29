import Home from './pages/Home'
import './index.css'
import InitializeData from "./InitializeData.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./pages/structure/Layout.tsx";
import {Authors} from "./pages/Authors.tsx";
import {Genres} from "./pages/Genres.tsx";
import BookDetail from "./pages/BookDetail.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,   // 👈 Wrap all routes with Layout
        children: [
            { path: "/", element: <Home /> },
            { path: "/authors", element: <Authors /> },
            { path: "/genres", element: <Genres />},
            { path: "/book/:id", element: <BookDetail />},
        ],
    },
]);

function App() {
    InitializeData();
    return <RouterProvider router={router}/>
}

export default App
