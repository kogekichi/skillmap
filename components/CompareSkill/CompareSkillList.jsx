import { Fab, Grid, IconButton, makeStyles, Paper, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { memo, useCallback, useEffect, useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import CompareSkillItem from "./CompareSkillItem";

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

const CompareSkillList = memo(({ skills, users, userSkills, category, onClickDelete }) => {
    // スタイルシート
    const classes = useStyles();

    // state系

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
                                    <TableCell>スキル</TableCell>
                                    {users.map((users, index) => (
                                        <TableCell key={index} align="center">
                                            {users.name}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {skills
                                    .filter((skill) => !category || skill.categoryId === category.id)
                                    .map((skill, index) => (
                                        <CompareSkillItem key={index} skill={skill} users={users} userSkills={userSkills} />
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    );
});

export default CompareSkillList;
