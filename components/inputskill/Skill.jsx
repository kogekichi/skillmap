import { FormControl, FormGroup, FormLabel, Grid, IconButton, makeStyles, Paper, TextField } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { memo, useEffect, useState } from "react";

/**
 * スタイルシート
 */
const useStyles = makeStyles((theme) => {
    return {
        newSkillArea: {
            padding: theme.spacing(2),
        },
        fullWidth: {
            width: "100%",
        },
    };
});

const Skill = memo(({ skills, category, onClickAddSkill }) => {
    // スタイルシート
    const classes = useStyles();

    // State系変数
    const [selectedSkill, setSelectedSkill] = useState(null);

    useEffect(() => {
        if (category && selectedSkill && selectedSkill.categoryId !== category.id) {
            setSelectedSkill(null);
        }
    }, [category]);

    // スキルの一致確認
    const getOptionSelected = (option, value) => {
        return option.id === value.id;
    };

    // カテゴリ変更
    const handleChange = (e, value) => {
        setSelectedSkill(value);
    };

    // 追加ボタンクリック
    const handleClickAdd = (e) => {
        onClickAddSkill(e, selectedSkill);
    };

    return (
        <Paper className={classes.newSkillArea}>
            <FormLabel component="legend">スキル追加</FormLabel>
            <FormControl component="fieldset" className={classes.fullWidth}>
                <FormGroup row={true}>
                    <Grid container>
                        <Grid item xs={10}>
                            <Autocomplete
                                id="combo-box-skills"
                                getOptionSelected={getOptionSelected}
                                onChange={handleChange}
                                value={selectedSkill}
                                options={skills.filter((skill) => !category || skill.categoryId === category.id)}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} label="スキル" variant="outlined" fullWidth={true} />}
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

export default Skill;
