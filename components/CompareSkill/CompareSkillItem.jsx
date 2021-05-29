import { IconButton, Radio, TableCell, TableRow } from "@material-ui/core";
import React, { memo } from "react";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

const CompareSkillItem = memo(({ skill, users, userSkills }) => {
    return (
        <TableRow>
            <TableCell component="th" scope="row">
                {skill.name}
            </TableCell>
            {users.map((user, index) => {
                const targetUserSkills = userSkills.filter((userSkill) => {
                    return user.email === userSkill.email;
                });
                const compSkill = targetUserSkills && targetUserSkills.find((s) => s.skillId === skill.id);
                const level = compSkill ? compSkill.level : "";
                return (
                    <TableCell key={index} align="center">
                        {level}
                    </TableCell>
                );
            })}
        </TableRow>
    );
});

export default CompareSkillItem;
