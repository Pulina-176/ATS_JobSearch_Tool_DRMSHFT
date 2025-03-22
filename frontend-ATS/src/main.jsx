import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import {store, persistor} from './store'
import {PersistGate} from 'redux-persist/integration/react'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <App />
      </PersistGate>
    </Provider>
  
)
