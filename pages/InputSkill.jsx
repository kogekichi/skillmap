import { Button, Container, FormControl, FormGroup, FormLabel, Grid, Paper, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';

const testdata = [
    {id:0, name:"Java", level:3},
    {id:1, name:"Python", level:2},
    {id:2, name:"Oracle", level:2},
    {id:3, name:"Tomcat", level:3},
]


const useStyles = makeStyles((theme) => ({
    newSkillArea: {
      padding: theme.spacing(2),
    },
  }));

const InputSkill = () => {

    const classes = useStyles();

    const [skills, setSkills] = useState(testdata);
    const [newSkill, setNewSkill] = useState("");

    // 新スキル入力
    const handleChangeNewSkill = (e) => setNewSkill(e.target.value);

    // 新スキル追加
    const handleClickAddSkill = () => {
        const skill = {id : skills.length, name:newSkill, level:1};
        setSkills([...skills, skill]);
    }



    // Radio変更
    const handleChangeLevel = (e, id) => {
        const inputSkill = skills.find((skill) => skill.id === id);
        inputSkill.level = parseInt(e.target.value);
        setSkills([...skills]);
    }

    return (
        <Container maxWidth="md">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.newSkillArea}>
                        <FormControl color="primary" variant="filled" margin="normal">
                            <FormGroup row={true}>
                                <TextField label="スキル" variant="outlined" value={newSkill} onChange={handleChangeNewSkill}/>
                                <Button color="primary" variant="contained" onClick={handleClickAddSkill}>追加</Button>
                            </FormGroup>
                        </FormControl>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>スキル</TableCell>
                                        <TableCell align="right">Lv1</TableCell>
                                        <TableCell align="right">Lv2</TableCell>
                                        <TableCell align="right">Lv3</TableCell>
                                        <TableCell align="right">Lv4</TableCell>
                                        <TableCell align="right">Lv5</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {skills.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Radio checked={row.level === 1} value={1} name={`skil_${row.id}`} onChange={(e) => handleChangeLevel(e, row.id)}/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Radio checked={row.level === 2} value={2} name={`skil_${row.id}`} onChange={(e) => handleChangeLevel(e, row.id)}/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Radio checked={row.level === 3} value={3} name={`skil_${row.id}`} onChange={(e) => handleChangeLevel(e, row.id)}/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Radio checked={row.level === 4} value={4} name={`skil_${row.id}`} onChange={(e) => handleChangeLevel(e, row.id)}/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Radio checked={row.level === 5} value={5} name={`skil_${row.id}`} onChange={(e) => handleChangeLevel(e, row.id)}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default InputSkill
