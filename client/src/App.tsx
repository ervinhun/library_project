import Home from './pages/Home'
import './index.css'
import InitializeData from "./InitializeData.tsx";
import {createBrowserRouter, type RouteObject, RouterProvider} from "react-router-dom";

const myRoutes: RouteObject[] = [
    {
        path: "/",
        element: <Home/>
    },
    /*
    {
        path: "/book/:id",
        element: <BookDetail/>
    }*/
]

function App() {
    InitializeData();
    return <RouterProvider router={createBrowserRouter(myRoutes)}/>
}

export default App
