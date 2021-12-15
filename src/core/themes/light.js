import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';

const lightTheme = {
  color: '#FFFFFF',
  gold: '#F8CC82',
  gray: '#a18100',
  blueish_gray: '#FFFFFF',
};

export const light = responsiveFontSizes(
  createTheme(
    {
      primary: {
        main: lightTheme.color,
      },
      overrides: {
        MuiTab: {
          textColorPrimary: {
            color: lightTheme.blueish_gray,
            '&$selected': {
              color: lightTheme.color,
            },
          },
        },
        PrivateTabIndicator: {
          colorPrimary: {
            backgroundColor: lightTheme.color,
          },
        },
        MuiButton: {
          containedPrimary: {
            color: '#FFFFFF',
            background: 'linear-gradient(316.29deg, #9C622E 22.96%, #FACB99 75.17%)',
            border: '1px solid #000000',
            boxSizing: 'border-box',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '5px',
          },
          containedSecondary: {
            color: '#FFFFFF',
            background: 'linear-gradient(316.29deg, #9C622E 22.96%, #FACB99 75.17%)',
            border: '1px solid #000000',
            boxSizing: 'border-box',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '5px',
          },
          outlinedPrimary: {
            color: '#FFFFFF',
            background: 'transparent',
            border: '2px solid #e8b580',
            borderRadius: '8px',
            '&:disabled': {
              color: '#454545',
              background: 'transparent',
              border: '2px solid #454545',
              borderRadius: '8px',
            },
          },
          outlinedSecondary: {
            color: lightTheme.color,
            borderColor: lightTheme.color,
          },
          textPrimary: {
            color: lightTheme.gray,
          },
          textSecondary: {
            color: lightTheme.color,
          },
        },
      },
    },
  ),
);
