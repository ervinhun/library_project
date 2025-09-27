import {Outlet} from "react-router-dom";
import Dock from "./Dock.tsx";
import useInitializeData from "../../InitializeData.tsx";
import Header from "./Header.tsx";

export default function Layout() {
    const loading = useInitializeData();
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    return (
        <div className="app-layout flex flex-col min-h-screen ">

            <div className="app-header">
                <Header />
            </div>
            <div className="app-content">
               <Outlet />
            </div>
            <Dock />
        </div>
    )
}