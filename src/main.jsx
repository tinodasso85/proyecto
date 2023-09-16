import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  //saco el modo estricto para no generar 2 llamado en la web (poco eficiente)
  <> 
    <App />
  </>,
)
