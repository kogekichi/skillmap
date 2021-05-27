import { Fab, Grid, IconButton, makeStyles, Paper, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { memo, useCallback, useEffect, useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import MySkillItem from "./MySkillItem";

/**
 * スタイルシート
 */
const useStyles = makeStyles((theme) => {
    console.log(theme);
    return {
        skillListArea: {
            position: "relative",
        },
        skillListTable: {
            maxHeight: "60vh",
        },
        fullWidth: {
            width: "100%",
        },
        saveButton: {
            position: "absolute",
            top: theme.spacing(0),
            right: theme.spacing(2),
        },
        stickyHeader: {
            top: "57px", // TODO
        },
    };
});

const MySkillList = memo(({ mySkills, category, onClickSave, onClickDelete }) => {
    // スタイルシート
    const classes = useStyles();

    // state系
    console.log(mySkills);
    const [localMySkill, setLocalMySkill] = useState([]);

    useEffect(() => {
        console.log("effect");
        setLocalMySkill(mySkills.map((mySkill) => ({ ...mySkill })));
    }, [mySkills]);

    // Radio変更
    const handleChangeLevel = (e, skill) => {
        const changeSkill = { ...skill, level: parseInt(e.target.value) };
        setLocalMySkill(localMySkill.map((mySkill) => (mySkill === skill ? changeSkill : mySkill)));
    };

    // 保存ボタンクリック
    const handleClickSave = useCallback(
        (e) => {
            onClickSave(e, localMySkill);
        },
        [onClickSave, localMySkill]
    );

    // 削除処理確認
    const handleClickDelete = useCallback(
        (e, mySkill) => {
            onClickDelete(e, mySkill);
        },
        [onClickDelete]
    );

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} className={classes.skillListTable + " " + classes.skillListArea}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell rowSpan={2}>スキル</TableCell>
                                    <TableCell colSpan={5}>Level</TableCell>
                                    <TableCell rowSpan={2}></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" className={classes.stickyHeader}>
                                        1
                                    </TableCell>
                                    <TableCell align="center" className={classes.stickyHeader}>
                                        2
                                    </TableCell>
                                    <TableCell align="center" className={classes.stickyHeader}>
                                        3
                                    </TableCell>
                                    <TableCell align="center" className={classes.stickyHeader}>
                                        4
                                    </TableCell>
                                    <TableCell align="center" className={classes.stickyHeader}>
                                        5
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {localMySkill
                                    .filter((mySkill) => !category || mySkill.skill.categoryId === category.id)
                                    .map((row, index) => (
                                        <MySkillItem mySkill={row} onChangeLevel={handleChangeLevel} onClickDelete={handleClickDelete} key={index} />
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} className={classes.skillListArea}>
                    <Fab color="primary" aria-label="add" className={classes.saveButton} onClick={handleClickSave}>
                        <SaveIcon />
                    </Fab>
                </Grid>
            </Grid>
        </>
    );
});

export default MySkillList;
