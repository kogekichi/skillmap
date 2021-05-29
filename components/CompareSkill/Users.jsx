import { makeStyles } from "@material-ui/core/styles";
import { FormControl, FormGroup, FormLabel, Grid, IconButton, Paper, TextField } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { memo, useState } from "react";

/**
 * スタイルシート
 */
const useStyles = makeStyles((theme) => {
    return {
        newUserArea: {
            padding: theme.spacing(2),
        },
        fullWidth: {
            width: "100%",
        },
    };
});

const Users = memo(({ users = [], onClickAddUser = (e, selectedUser) => {} }) => {
    // スタイルシート
    const classes = useStyles();

    // State系変数
    const [selectedUser, setSelectedUser] = useState(null);

    // スキルの一致確認
    const getOptionSelected = (option, value) => {
        return option.username === value.username;
    };

    // ユーザ変更
    const handleChange = (e, value) => {
        setSelectedUser(value);
    };

    // 追加ボタンクリック
    const handleClickAdd = (e) => {
        onClickAddUser(e, selectedUser);
    };

    return (
        <Paper className={classes.newUserArea}>
            <FormLabel component="legend">ユーザ追加</FormLabel>
            <FormControl component="fieldset" className={classes.fullWidth}>
                <FormGroup row={true}>
                    <Grid container>
                        <Grid item xs={10}>
                            <Autocomplete
                                id="combo-box-users"
                                getOptionSelected={getOptionSelected}
                                onChange={handleChange}
                                value={selectedUser}
                                options={users}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} label="メンバー" variant="outlined" fullWidth={true} />}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton color="primary" onClick={handleClickAdd}>
                                <AddCircleIcon fontSize="large" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </FormGroup>
            </FormControl>
        </Paper>
    );
});

export default Users;
