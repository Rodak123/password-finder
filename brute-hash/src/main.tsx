import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { CssBaseline, CssVarsProvider } from '@mui/joy';

import './styles/main.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CssVarsProvider
            defaultMode='dark'
        >
            <CssBaseline />
            <App />
        </CssVarsProvider>
    </StrictMode>,
)
