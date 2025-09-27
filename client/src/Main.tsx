import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Toaster} from "react-hot-toast";
import {DevTools} from "jotai-devtools";
import "jotai-devtools/styles.css";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DevTools/>
        <Toaster/>
        <App/>
    </StrictMode>,
)
