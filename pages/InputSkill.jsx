import {
    Box,
    Button,
    Container,
    Fab,
    FormControl,
    FormGroup,
    FormLabel,
    Grid,
    IconButton,
    InputLabel,
    Paper,
    Radio,
    Snackbar,
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
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import SaveIcon from '@material-ui/icons/Save';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Amplify, { API, Auth } from "aws-amplify";
import * as queries from "../src/graphql/queries";
import * as mutations from "../src/graphql/mutations";
import ConfirmDialog from "../components/commons/ConfirmDialog";

/**
 * スタイルシート
 */
const useStyles = makeStyles((theme) => {
    
    console.log(theme);
    return {
    newSkillArea: {
        padding: theme.spacing(2),
    },
    skillListArea:{
        position:"relative"
    },
    skillListTable: {
        maxHeight: "60vh",
    },
    fullWidth: {
        width: "100%",
    },
    saveButton: {
        position: 'absolute',
        top: theme.spacing(0),
        right: theme.spacing(2),
      },
    stickyHeader: {
        top:"57px"      // TODO
    }
}});

const InputSkill = () => {
    // スタイルシート
    const classes = useStyles();

    const [mySkills, setMySkills] = useState([]);
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [selectedMySkill, setSelectedMySkill] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [initMySkill, setInitMySkill] = useState([]);
    const [user, setUser] = useState({});

    const [errorMessage, setErrorMessage] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");

    // 保有スキル取得
    const getMySkills = async (curUser, skillItems) => {
        const resMySkill = await API.graphql({
            query: queries.listMySkills,
            variables:{filter : {email : {eq: curUser.attributes.email}}}
        });

        const margeMySkills = resMySkill.data.listMySkills.items.map((mskill) => {
            const targetSkill = skillItems.find((item) => item.id === mskill.skillId);
            if (targetSkill) {
                mskill.skill = targetSkill;
            } else {
                mskill.skill = {id:null, name:"", categoryId:null};
            }
            return mskill;
        });

        const mySkillsSorted = margeMySkills.sort((c1, c2) => c1.skill.name.localeCompare(c2.skill.name));

        setMySkills([...mySkillsSorted]);
        setInitMySkill(mySkillsSorted.map((skill) => ({...skill})));
    }

    // 初期検索
    useEffect(async () => {

        // ユーザ情報取得
        const curUser = await Auth.currentAuthenticatedUser();
        setUser(curUser)
        console.log(curUser.attributes.email);

        // カテゴリ取得
        const resCate = await API.graphql({
            query: queries.listSkillCategorys,
        });
        const cate = resCate.data.listSkillCategorys.items.sort((c1, c2) => c1.name.localeCompare(c2.name));
        setCategories(cate);

        // スキル一覧取得
        const resSkillｓ = await API.graphql({
            query: queries.listSkills,
        });
        const skillItems = resSkillｓ.data.listSkills.items.sort((c1, c2) => c1.name.localeCompare(c2.name));
        setSkills(skillItems);

        // 自分のスキル取得
        getMySkills(curUser, skillItems);

    }, []);

    // カテゴリ変更
    const handleChangeCategories = (e, selCategory) => {
        setSelectedCategory(selCategory);
        setSelectedSkill(null);
    }

    // カテゴリの一致確認
    const getCategoryOptionSelected = (option, value) => {
        return option.id === value.id;
    }

    // スキル変更
    const handleChangeSkills = (e, selSkill) => {
        setSelectedSkill(selSkill);
    }

    // スキルの一致確認
    const getSkillOptionSelected = (option, value) => {
        return option.id === value.id;
    }

    // 新スキル追加
    const handleClickAddSkill = () => {
        // 空チェック
        if (!selectedSkill) {
            return;
        }

        // 重複チェック
        const exists = mySkills.some((mySkill) => mySkill.skill.id === selectedSkill.id);
        if (exists) {
            setErrorMessage("同じスキル有るよ");
            return;
        }

        const skill = { id: null, skillId: selectedSkill.id, skill: selectedSkill, level: 1 };
        setMySkills([...mySkills, skill]);
        setSelectedSkill(null);
    };

    // Radio変更
    const handleChangeLevel = (e, skill) => {
        skill.level = parseInt(e.target.value);
        setMySkills([...mySkills]);
    };

    // 保存
    const handleClickSave = async () => {
        console.log("save");
        console.log(initMySkill);
        console.log(mySkills);

        // 変更のあったスキルを探す
        const predicate = (listSkill)=> {
            console.log(listSkill)
            return !listSkill.id || initMySkill.some((s) => listSkill.id === s.id && listSkill.level !== s.level )
        };

        // 更新
        try {
            const targetMySkills = mySkills.filter(predicate);
            if (targetMySkills.length > 0) {
                mySkills.filter(predicate).forEach(async (skill) =>{
                    if (skill.id) {
                        await API.graphql({
                            query: mutations.updateMySkill,
                            variables:{
                                input : {
                                    id: skill.id,
                                    skillId: skill.skillId,
                                    level: skill.level,
                                    email: user.attributes.email,
                                    }
                                }
                        });
                    } else {
                        await API.graphql({
                            query: mutations.createMySkill,
                            variables:{
                                input : {
                                    skillId: skill.skillId,
                                    level: skill.level,
                                    email: user.attributes.email,
                                    }
                                }
                        });
                    }
                });
                setInfoMessage("更新完了");

                // 一覧更新
                getMySkills(user, skills);
            }
        } catch (e) {
            console.log(e);
            setErrorMessage(e.message);
        }

    }

    // 削除処理確認
    const handleClickDelete = async (delMySkill) => {
        setSelectedMySkill(delMySkill);
        setConfirmMessage("削除していい？");
    }
    // 削除確認いいえボタン
    const handleClickConfirmNo = () => {
        setConfirmMessage("");
    }
    // 削除確認はいボタン
    const handleClickConfirmYes = async () => {
        try{
            if (selectedMySkill.id) {
                await API.graphql({
                    query: mutations.deleteMySkill,
                    variables:{
                        input : {
                            id: selectedMySkill.id,
                            }
                        }
                });
            }

            const deletedMySkills = mySkills.filter((mySkill) => mySkill.id !== selectedMySkill.id);
            setMySkills(deletedMySkills);
        } catch (e) {
            console.log(e);
            
            if (e.message) {
                setErrorMessage(e.message);
            } else if (e.errors) {
                setErrorMessage(e.errors.map(err => err.message).join("\n"));
            }
        }

        setSelectedMySkill(null);
        setConfirmMessage("");
    }

    // エラーメッセージ非表示
    const handleErrorClose = () => {
        setErrorMessage("");
    }

    // 情報メッセージ非表示
    const handleInfoClose = () => {
        setInfoMessage("");
    }

    return (
        <Container maxWidth="md">
            <Snackbar open={errorMessage !== ""} autoHideDuration={6000} onClose={handleErrorClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <MuiAlert onClose={handleErrorClose} severity="error" elevation={6} variant="filled">
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
            <Snackbar open={infoMessage !== ""} autoHideDuration={6000} onClose={handleInfoClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <MuiAlert onClose={handleInfoClose} severity="success" elevation={6} variant="filled">
                    {infoMessage}
                </MuiAlert>
            </Snackbar>
            <ConfirmDialog onClickYes={handleClickConfirmYes} onClickNo={handleClickConfirmNo}>
                {confirmMessage}
            </ConfirmDialog>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper className={classes.newSkillArea}>
                        <FormControl component="fieldset" className={classes.fullWidth}>
                            <FormLabel component="legend">カテゴリ選択</FormLabel>
                            <Autocomplete
                                id="combo-box-categories"
                                options={categories}
                                onChange={handleChangeCategories}
                                getOptionSelected={getCategoryOptionSelected}
                                value={selectedCategory}
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
                                            getOptionSelected={getSkillOptionSelected}
                                            onChange={handleChangeSkills}
                                            value={selectedSkill}
                                            options={skills.filter((skill) => !selectedCategory || skill.categoryId === selectedCategory.id)}
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
                    <TableContainer component={Paper} className={classes.skillListTable + " " + classes.skillListArea}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell rowSpan={2}>スキル</TableCell>
                                    <TableCell colSpan={5}>
                                        Level
                                    </TableCell>
                                    <TableCell rowSpan={2}></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" className={classes.stickyHeader}>1</TableCell>
                                    <TableCell align="center" className={classes.stickyHeader}>2</TableCell>
                                    <TableCell align="center" className={classes.stickyHeader}>3</TableCell>
                                    <TableCell align="center" className={classes.stickyHeader}>4</TableCell>
                                    <TableCell align="center" className={classes.stickyHeader}>5</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mySkills.filter((mySkill) => !selectedCategory || mySkill.skill.categoryId === selectedCategory.id).map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {row.skill.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Radio
                                                checked={row.level === 1}
                                                value={1}
                                                name={`skil_${row.id}`}
                                                onChange={(e) => handleChangeLevel(e, row)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Radio
                                                checked={row.level === 2}
                                                value={2}
                                                name={`skil_${row.id}`}
                                                onChange={(e) => handleChangeLevel(e, row)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Radio
                                                checked={row.level === 3}
                                                value={3}
                                                name={`skil_${row.id}`}
                                                onChange={(e) => handleChangeLevel(e, row)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Radio
                                                checked={row.level === 4}
                                                value={4}
                                                name={`skil_${row.id}`}
                                                onChange={(e) => handleChangeLevel(e, row)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Radio
                                                checked={row.level === 5}
                                                value={5}
                                                name={`skil_${row.id}`}
                                                onChange={(e) => handleChangeLevel(e, row)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton color="secondary" onClick={()=>handleClickDelete(row)}>
                                                <RemoveCircleOutlineIcon fontSize="large" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
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
        </Container>
    );
};

export default InputSkill;
