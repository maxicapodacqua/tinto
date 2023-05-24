import { Roboto, Bree_Serif } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const breeSerif = Bree_Serif({
  weight: '400',
  subsets: ['latin'],
});
// Create a theme instance.
const theme = createTheme({
  typography: {
        fontFamily: roboto.style.fontFamily,
        h1: {
          fontFamily: breeSerif.style.fontFamily,
        },
        h2: {
          fontFamily: breeSerif.style.fontFamily,
        },
        h3: {
          fontFamily: breeSerif.style.fontFamily,
        },
        h4: {
          fontFamily: breeSerif.style.fontFamily,
        },
        h5: {
          fontFamily: breeSerif.style.fontFamily,
        },
        h6: {
          fontFamily: breeSerif.style.fontFamily,
        },
        subtitle1: {
          fontFamily: 'Droid Serif',
        },
        subtitle2: {
          fontFamily: 'Droid Serif',
        },
      },
      palette: {
        primary: {
          main: '#080911',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#f4212e',
        },
        background: {
          default: '#dde2ef',
          paper: '#ffffff',
        },
      },

});

export default theme;



import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

// export const themeOptions: ThemeOptions = {
//   typography: {
//     fontFamily: 'Roboto',
//     h1: {
//       fontFamily: 'Bree Serif',
//     },
//     h2: {
//       fontFamily: 'Bree Serif',
//     },
//     h3: {
//       fontFamily: 'Bree Serif',
//     },
//     h4: {
//       fontFamily: 'Bree Serif',
//     },
//     h5: {
//       fontFamily: 'Bree Serif',
//     },
//     h6: {
//       fontFamily: 'Bree Serif',
//     },
//     subtitle1: {
//       fontFamily: 'Droid Serif',
//     },
//     subtitle2: {
//       fontFamily: 'Droid Serif',
//     },
//   },
//   palette: {
//     primary: {
//       main: '#080911',
//       contrastText: '#ffffff',
//     },
//     secondary: {
//       main: '#f4212e',
//     },
//     background: {
//       default: '#dde2ef',
//       paper: '#ffffff',
//     },
//   },
// };

