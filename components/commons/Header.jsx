import React, { useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import {
    AppBar,
    Avatar,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { ExitToApp } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import Amplify, { Auth } from "aws-amplify";
import { AuthState } from "@aws-amplify/ui-components";
import awsconfig from "../../src/aws-exports";
import Link from "next/link";

Amplify.configure(awsconfig);

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    appbar: {
        marginBottom: 20,
    },
    list: {
        width: 250,
    },
    fullList: {
        width: "auto",
    },
}));

const Header = () => {
    const classes = useStyles();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }
        setOpen(open);
    };

    const handleSignOut = async () => {
        await Auth.signOut();
        setAuthState(AuthState.SignOut);
        //dispatchAuthStateChangeEvent(AuthState.SignOut);
    };

    return (
        <>
            <AppBar position="static" className={classes.appbar}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        <Link href="/">Skillmap</Link>
                    </Typography>
                    <Button color="inherit" onClick={handleSignOut}>
                        <ExitToApp />
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                <div className={clsx(classes.list)} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                    <List>
                        <ListItem button onClick={() => router.push("/InputSkill")}>
                            <ListItemAvatar>
                                <Avatar>
                                    <EditIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="スキル入力" />
                        </ListItem>
                        <ListItem button onClick={() => router.push("/CompareSkill")}>
                            <ListItemAvatar>
                                <Avatar>
                                    <FormatListNumberedIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="スキル比較" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </>
    );
};

export default Header;
