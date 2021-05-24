import {
    Button,
    Container,
    FormControl,
    FormGroup,
    FormLabel,
    Grid,
    IconButton,
    InputLabel,
    Paper,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Amplify, { API } from "aws-amplify";
import * as queries from "../src/graphql/queries";
import * as mutations from "../src/graphql/mutations";

const testdata = [
    { id: 0, name: "Java", level: 3 },
    { id: 1, name: "Python", level: 2 },
    { id: 2, name: "Oracle", level: 2 },
    { id: 3, name: "Tomcat", level: 3 },
];
const testskills = [
    { id: 0, name: "Java" },
    { id: 1, name: "Python" },
    { id: 2, name: "Oracle" },
    { id: 3, name: "Tomcat" },
];

/**
 * スタイルシート
 */
const useStyles = makeStyles((theme) => ({
    newSkillArea: {
        padding: theme.spacing(2),
    },
    fullWidth: {
        width: "100%",
    },
}));

const InputSkill = () => {
    // スタイルシート
    const classes = useStyles();

    const [mySkills, setMySkills] = useState([testdata]);
    const [skills, setSkills] = useState([testskills]);
    const [categories, setCategories] = useState([]);
    const [newSkill, setNewSkill] = useState("");

    // 初期検索
    useEffect(async () => {
        // カテゴリ取得
        const resCate = await API.graphql({
            query: queries.listSkillCategorys,
        });
        setCategories(resCate.data.listSkillCategorys.items);

        // スキル一覧取得
        // const resSkillｓ = await API.graphql({
        //     query: queries.listSkills,
        // });
        // setSkills(resSkillｓ.data.listSkills.items);

        // 自分のスキル取得
        const resMySkill = await API.graphql({
            query: queries.listMySkills,
        });
        setMySkills(resMySkill.data.listMySkills.items);
    }, []);

    // 新スキル入力
    const handleChangeNewSkill = (e) => setNewSkill(e.target.value);

    // 新スキル追加
    const handleClickAddSkill = () => {
        if (newSkill === "") {
            return;
        }
        const skill = { id: mySkills.length, name: newSkill, level: 1 };
        setMySkills([...mySkills, skill]);
        setNewSkill("");
    };

    // Radio変更
    const handleChangeLevel = (e, id) => {
        const inputSkill = mySkills.find((skill) => skill.id === id);
        inputSkill.level = parseInt(e.target.value);
        setMySkills([...mySkills]);
    };

    return (
        <Container maxWidth="md">
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.newSkillArea}>
                        <FormControl component="fieldset" className={classes.fullWidth}>
                            <FormLabel component="legend">カテゴリ選択</FormLabel>
                            <Autocomplete
                                id="combo-box-categories"
                                options={categories}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} label="カテゴリ" variant="outlined" fullWidth={true} />}
                            />
                        </FormControl>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.newSkillArea}>
                        <FormLabel component="legend">スキル追加</FormLabel>
                        <FormControl component="fieldset" className={classes.fullWidth}>
                            <FormGroup row={true}>
                                <Grid container>
                                    <Grid item xs={10}>
                                        <Autocomplete
                                            id="combo-box-skills"
                                            options={skills}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => <TextField {...params} label="スキル" variant="outlined" fullWidth={true} />}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton color="primary" onClick={handleClickAddSkill}>
                                            <AddCircleIcon fontSize="large" />
                                        </IconButton>
                                    </Grid>
                                </Grid>
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
                                        <TableCell rowSpan={2}>スキル</TableCell>
                                        <TableCell colSpan={5} align="right">
                                            Level
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">1</TableCell>
                                        <TableCell align="right">2</TableCell>
                                        <TableCell align="right">3</TableCell>
                                        <TableCell align="right">4</TableCell>
                                        <TableCell align="right">5</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mySkills.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Radio
                                                    checked={row.level === 1}
                                                    value={1}
                                                    name={`skil_${row.id}`}
                                                    onChange={(e) => handleChangeLevel(e, row.id)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Radio
                                                    checked={row.level === 2}
                                                    value={2}
                                                    name={`skil_${row.id}`}
                                                    onChange={(e) => handleChangeLevel(e, row.id)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Radio
                                                    checked={row.level === 3}
                                                    value={3}
                                                    name={`skil_${row.id}`}
                                                    onChange={(e) => handleChangeLevel(e, row.id)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Radio
                                                    checked={row.level === 4}
                                                    value={4}
                                                    name={`skil_${row.id}`}
                                                    onChange={(e) => handleChangeLevel(e, row.id)}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Radio
                                                    checked={row.level === 5}
                                                    value={5}
                                                    name={`skil_${row.id}`}
                                                    onChange={(e) => handleChangeLevel(e, row.id)}
                                                />
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
    );
};

export default InputSkill;
