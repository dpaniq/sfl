import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css'

// 👇️ passed wrong ID to getElementById() method
const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
root.render(
    <App />
);