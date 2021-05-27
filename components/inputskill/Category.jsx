import { FormControl, FormLabel, makeStyles, Paper, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { memo, useState } from "react";

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

const Category = memo(({ categories, onChangeCategory }) => {
    // スタイルシート
    const classes = useStyles();

    // State系変数
    const [selectedCategory, setSelectedCategory] = useState(null);

    // カテゴリの一致確認
    const getOptionSelected = (option, value) => {
        return option.id === value.id;
    };

    // カテゴリ変更
    const handleChange = (e, value) => {
        setSelectedCategory(value);
        onChangeCategory(e, value);
    };

    return (
        <Paper className={classes.newSkillArea}>
            <FormControl component="fieldset" className={classes.fullWidth}>
                <FormLabel component="legend">カテゴリ選択</FormLabel>
                <Autocomplete
                    id="combo-box-categories"
                    options={categories}
                    onChange={handleChange}
                    getOptionSelected={getOptionSelected}
                    value={selectedCategory}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="カテゴリ" variant="outlined" fullWidth={true} />}
                />
            </FormControl>
        </Paper>
    );
});

export default Category;
