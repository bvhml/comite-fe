import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import PirateTheme from './PirateTheme';

function withRoot(Component) {
  function WithRoot(props) {
    return (
      <ThemeProvider theme={PirateTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;