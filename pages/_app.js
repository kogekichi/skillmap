import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Amplify from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignIn, AmplifySignUp } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import awsconfig from "../src/aws-exports";

import "../styles/globals.css";
import Header from "../components/commons/Header";

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
        marginBottom: 20,
    },
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

    return authState === AuthState.SignedIn && user ? (
        <div className="App">
            <Header />
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
