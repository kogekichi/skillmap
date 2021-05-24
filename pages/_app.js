import React from "react";
import Amplify, { Auth, Hub } from "aws-amplify";
import {
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignOut,
  AmplifySignUp,
} from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import awsconfig from "../src/aws-exports";

import "../styles/globals.css";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { ExitToApp } from "@material-ui/icons";

Amplify.configure(awsconfig);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appbar: {
    marginBottom:20
  }
}));

const MyApp = ({ Component, pageProps }) => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();
  const classes = useStyles();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      console.log(nextAuthState);
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  const handleSignOut = async () => {
    await Auth.signOut();
    setAuthState(AuthState.SignOut);
    //dispatchAuthStateChangeEvent(AuthState.SignOut);
  }

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Skillmap
          </Typography>
          <Button color="inherit" onClick={handleSignOut}><ExitToApp/></Button>
        </Toolbar>
      </AppBar>
      <Component {...pageProps} />
      
    </div>
  ) : (
    <AmplifyAuthenticator usernameAlias="email">
      <AmplifySignUp
        slot="sign-up"
        usernameAlias="email"
        formFields={[
          {
            type: "email",
            label: "Username(E-mail)",
            placeholder: "E-mail Address",
            inputProps: { required: true },
          },
          {
            type: "password",
            label: "Password",
            placeholder: "Password",
            inputProps: { required: true, autocomplete: "new-password" },
          },
          {
            type: "name",
            label: "Name",
            placeholder: "Name",
            inputProps: { required: true, name: "name" },
          },
        ]}
      />
      <AmplifySignIn slot="sign-in" usernameAlias="email" />
    </AmplifyAuthenticator>
  );
};

export default MyApp;