import { Container, Grid, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import React, { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Amplify, { API, Auth } from "aws-amplify";
import * as queries from "../src/graphql/queries";
import * as mutations from "../src/graphql/mutations";
import ConfirmDialog from "../components/commons/ConfirmDialog";
import Category from "../components/inputskill/Category";
import Skill from "../components/inputskill/Skill";
import MySkillList from "../components/inputskill/MySkillList";

/**
 * スタイルシート
 */
const useStyles = makeStyles((theme) => {
    console.log(theme);
    return {
        newSkillArea: {
            padding: theme.spacing(2),
        },
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

const InputSkill = () => {
    // スタイルシート
    const classes = useStyles();

    const [mySkills, setMySkills] = useState([]);
    const [skills, setSkills] = useState([]);
    const [selectedMySkill, setSelectedMySkill] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [user, setUser] = useState({});

    const [errorMessage, setErrorMessage] = useState("");
    const [infoMessage, setInfoMessage] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");

    // 保有スキル取得
    const getMySkills = async (curUser, skillItems) => {
        const resMySkill = await API.graphql({
            query: queries.listMySkills,
            variables: { filter: { email: { eq: curUser.attributes.email } } },
        });

        const margeMySkills = resMySkill.data.listMySkills.items.map((mskill) => {
            const targetSkill = skillItems.find((item) => item.id === mskill.skillId);
            if (targetSkill) {
                mskill.skill = targetSkill;
            } else {
                mskill.skill = { id: null, name: "", categoryId: null };
            }
            return mskill;
        });

        const mySkillsSorted = margeMySkills.sort((c1, c2) => c1.skill.name.localeCompare(c2.skill.name));

        setMySkills([...mySkillsSorted]);
    };

    // 初期検索
    useEffect(async () => {
        // ユーザ情報取得
        const curUser = await Auth.currentAuthenticatedUser();
        setUser(curUser);
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
    const handleChangeCategory = useCallback((e, selCategory) => {
        setSelectedCategory(selCategory);
    }, []);

    // 新スキル追加
    const handleClickAddSkill = useCallback(
        (e, skill) => {
            // 空チェック
            if (!skill) {
                return;
            }

            // 重複チェック
            const exists = mySkills.some((mySkill) => mySkill.skill.id === skill.id);
            if (exists) {
                setErrorMessage("同じスキル有るよ");
                return;
            }

            const newMySkill = { id: null, skillId: skill.id, skill: skill, level: 1 };
            setMySkills([...mySkills, newMySkill]);
        },
        [mySkills]
    );

    // 保存
    const handleClickSave = useCallback(
        async (e, updateMySkill) => {
            console.log("save");
            console.log(mySkills);

            // 変更のあったスキルを探す
            const predicate = (listSkill) => {
                return !listSkill.id || mySkills.some((s) => listSkill.id === s.id && listSkill.level !== s.level);
            };

            // 更新
            try {
                const targetMySkills = updateMySkill.filter(predicate);

                if (targetMySkills.length > 0) {
                    // 新気分省いたリスト
                    let resultSkills = mySkills.filter((myskill) => myskill.id !== null);

                    for (const updateSkill of targetMySkills) {
                        if (updateSkill.id) {
                            const result = await API.graphql({
                                query: mutations.updateMySkill,
                                variables: {
                                    input: {
                                        id: updateSkill.id,
                                        skillId: updateSkill.skillId,
                                        level: updateSkill.level,
                                        email: user.attributes.email,
                                    },
                                },
                            });

                            // 更新結果を画面に反映
                            resultSkills = resultSkills.map((myskill) => (myskill.id !== updateSkill.id ? myskill : result.data.updateMySkill));
                        } else {
                            const result = await API.graphql({
                                query: mutations.createMySkill,
                                variables: {
                                    input: {
                                        skillId: updateSkill.skillId,
                                        level: updateSkill.level,
                                        email: user.attributes.email,
                                    },
                                },
                            });

                            // 登録結果を画面に反映
                            resultSkills.push(result.data.createMySkill);
                        }
                    }

                    const mySkillsSorted = resultSkills.sort((c1, c2) => c1.skill.name.localeCompare(c2.skill.name));
                    setMySkills(mySkillsSorted);

                    setInfoMessage("更新完了");
                }
            } catch (e) {
                console.log(e);
                setErrorMessage(e.message);
            }
        },
        [mySkills]
    );

    // 削除処理確認
    const handleClickDelete = useCallback(async (e, delMySkill) => {
        setSelectedMySkill(delMySkill);
        setConfirmMessage("削除していい？");
    }, []);
    // 削除確認いいえボタン
    const handleClickConfirmNo = useCallback(() => {
        setConfirmMessage("");
    }, []);
    // 削除確認はいボタン
    const handleClickConfirmYes = useCallback(async () => {
        try {
            console.log(selectedMySkill);
            if (selectedMySkill.id) {
                console.log("1");
                await API.graphql({
                    query: mutations.deleteMySkill,
                    variables: {
                        input: {
                            id: selectedMySkill.id,
                        },
                    },
                });
            }
            console.log("2");

            const deletedMySkills = mySkills.filter((mySkill) => mySkill.id !== selectedMySkill.id);
            setMySkills(deletedMySkills);
        } catch (e) {
            console.log(e);

            if (e.message) {
                setErrorMessage(e.message);
            } else if (e.errors) {
                setErrorMessage(e.errors.map((err) => err.message).join("\n"));
            }
        }

        setSelectedMySkill(null);
        setConfirmMessage("");
    }, [selectedMySkill, mySkills]);

    // エラーメッセージ非表示
    const handleErrorClose = useCallback(() => {
        setErrorMessage("");
    }, []);

    // 情報メッセージ非表示
    const handleInfoClose = useCallback(() => {
        setInfoMessage("");
    }, []);

    return (
        <Container maxWidth="md">
            <Snackbar
                open={errorMessage !== ""}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <MuiAlert onClose={handleErrorClose} severity="error" elevation={6} variant="filled">
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
            <Snackbar
                open={infoMessage !== ""}
                autoHideDuration={6000}
                onClose={handleInfoClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <MuiAlert onClose={handleInfoClose} severity="success" elevation={6} variant="filled">
                    {infoMessage}
                </MuiAlert>
            </Snackbar>
            <ConfirmDialog onClickYes={handleClickConfirmYes} onClickNo={handleClickConfirmNo}>
                {confirmMessage}
            </ConfirmDialog>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Category categories={categories} onChangeCategory={handleChangeCategory} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Skill skills={skills} category={selectedCategory} onClickAddSkill={handleClickAddSkill} />
                </Grid>
                <Grid item xs={12}>
                    <MySkillList mySkills={mySkills} category={selectedCategory} onClickSave={handleClickSave} onClickDelete={handleClickDelete} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default InputSkill;
