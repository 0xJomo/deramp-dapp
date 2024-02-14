import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

// SETUP COLORS

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const PRIMARY = {
  lighter: "#EAE0FA",
  light: '#B49DE3',
  main: '#6750A4',
  dark: '#392876',
  darker: '#190F4E',
  contrastText: '#FFFFFF',
};

const SECONDARY = {
  lighter: '#F7F1FF',
  light: '#E5D6FF',
  main: '#D0BCFF',
  dark: '#735EB7',
  darker: '#33247A',
  contrastText: '#381E72',
};

const INFO = {
  lighter: '#CAFBEE',
  light: '#60E7DA',
  main: '#05A6B2',
  dark: '#026280',
  darker: '#003355',
  contrastText: '#FFFFFF',
};

const SUCCESS = {
  lighter: '#E6FBD6',
  light: '#9EE783',
  main: '#40B231',
  dark: '#18801D',
  darker: '#095518',
  contrastText: '#FFFFFF',
};

const WARNING = {
  lighter: '#FCF6C9',
  light: '#EFD85F',
  main: '#CCA300',
  dark: '#926F00',
  darker: '#614600',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FCE6CD',
  light: '#EF9F69',
  main: '#CC400E',
  dark: '#921807',
  darker: '#610204',
  contrastText: '#FFFFFF',
};

const COMMON = {
  common: { black: '#000000', white: '#FFFFFF' },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.24),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default function palette(themeMode: 'light' | 'dark') {
  const light = {
    ...COMMON,
    mode: 'light',
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      stockup: SUCCESS.dark,
      stockdown: ERROR.main,
      disabled: GREY[500],
    },
    background: { paper: '#FFFFFF', default: '#FFFFFF', neutral: GREY[200] },
    // background: { default: 'rgb(251, 249, 249)', paper: 'rgb(255, 253, 253)', neutral: GREY[200] },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  } as const;

  const dark = {
    ...COMMON,
    mode: 'dark',
    text: {
      primary: '#FFFFFF',
      secondary: GREY[500],
      stockup: SUCCESS.main,
      stockdown: ERROR.main,
      disabled: GREY[600],
    },
    background: {
      paper: GREY[800],
      default: GREY[900],
      neutral: alpha(GREY[500], 0.16),
    },
    action: {
      ...COMMON.action,
      active: GREY[500],
    },
  } as const;

  return themeMode === 'light' ? light : dark;
}
