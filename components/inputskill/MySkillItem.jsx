import { IconButton, Radio, TableCell, TableRow } from "@material-ui/core";
import React, { memo } from "react";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

const MySkillItem = memo(({ mySkill, onChangeLevel, onClickDelete }) => {
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {mySkill.skill.name}
            </TableCell>
            <TableCell align="center">
                <Radio checked={mySkill.level === 1} value={1} name={`skil1_${mySkill.id}`} onChange={(e) => onChangeLevel(e, mySkill)} />
            </TableCell>
            <TableCell align="center">
                <Radio checked={mySkill.level === 2} value={2} name={`skil2_${mySkill.id}`} onChange={(e) => onChangeLevel(e, mySkill)} />
            </TableCell>
            <TableCell align="center">
                <Radio checked={mySkill.level === 3} value={3} name={`skil3_${mySkill.id}`} onChange={(e) => onChangeLevel(e, mySkill)} />
            </TableCell>
            <TableCell align="center">
                <Radio checked={mySkill.level === 4} value={4} name={`skil4_${mySkill.id}`} onChange={(e) => onChangeLevel(e, mySkill)} />
            </TableCell>
            <TableCell align="center">
                <Radio checked={mySkill.level === 5} value={5} name={`skil5_${mySkill.id}`} onChange={(e) => onChangeLevel(e, mySkill)} />
            </TableCell>
            <TableCell align="center">
                <IconButton color="secondary" onClick={(e) => onClickDelete(e, mySkill)}>
                    <RemoveCircleOutlineIcon fontSize="large" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
});

export default MySkillItem;
