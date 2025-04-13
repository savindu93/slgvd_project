import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider, createTheme, colors } from '@mui/material';

const theme = createTheme({

  typography: {
    fontFamily: "'Poppins', 'Roboto Condensed'",
    color: 'primary.main',

    subtitle1: {
      fontWeight: 700,
      fontFamily: 'Roboto Condensed',
      fontSize: '2rem',
      lineHeight: '30px'
    },

    subtitle2: {
      fontWeight: 700,
      fontFamily: 'Roboto Condensed',
      fontSize: '1.5rem',
      lineHeight: '30px'
    }
  },
  
  palette: {

    primary: {
      main: '#1E3248',
      light: '#D3EEFF',
      dark: '#121E31'
    },

    text: {
      primary: '#121E31'
    }
  }

})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme = {theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
