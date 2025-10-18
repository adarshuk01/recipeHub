import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { RecipeProvider } from './context/RecipeContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { CookSnapProvider } from './context/CooksnapContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RecipeProvider>
          <UserProvider>
            <CookSnapProvider>
              <NotificationProvider>

                <App />
              </NotificationProvider>
            </CookSnapProvider>
          </UserProvider>
        </RecipeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
