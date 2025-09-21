import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Toaster} from "react-hot-toast";
import {DevTools} from "jotai-devtools";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DevTools/>
        <Toaster/>
        <App/>
    </StrictMode>,
)
