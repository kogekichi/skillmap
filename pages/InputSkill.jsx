import { Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { API, Auth } from "aws-amplify";
import React, { useCallback, useEffect, useState } from "react";
import { useConfirm } from "../components/commons/ConfirmDialog";
import { useMessage } from "../components/commons/Message";
import Skill from "../components/commons/Skill";
import Category from "../components/inputskill/Category";
import MySkillList from "../components/inputskill/MySkillList";
import * as mutations from "../src/graphql/mutations";
import * as queries from "../src/graphql/queries";

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

/**
 * 初期情報取得
 * @returns
 */
const getInitInfo = async () => {
    // ユーザ情報取得
    const curUser = await Auth.currentAuthenticatedUser();

    // カテゴリ取得
    const resCate = await API.graphql({
        query: queries.listSkillCategorys,
    });
    const categories = resCate.data.listSkillCategorys.items.sort((c1, c2) => c1.name.localeCompare(c2.name));

    // スキル一覧取得
    const resSkillｓ = await API.graphql({
        query: queries.listSkills,
    });
    const skills = resSkillｓ.data.listSkills.items.sort((c1, c2) => c1.name.localeCompare(c2.name));

    // 自分のスキル取得
    const resMySkill = await API.graphql({
        query: queries.listMySkills,
        variables: { filter: { email: { eq: curUser.attributes.email } } },
    });

    const margeMySkills = resMySkill.data.listMySkills.items.map((mskill) => {
        const targetSkill = skills.find((item) => item.id === mskill.skillId);
        if (targetSkill) {
            mskill.skill = targetSkill;
        } else {
            mskill.skill = { id: null, name: "", categoryId: null };
        }
        return mskill;
    });
    const mySkills = margeMySkills.sort((c1, c2) => c1.skill.name.localeCompare(c2.skill.name));

    return { categories, skills, mySkills };
};

/**
 * スキル追加
 * @param {*} skill
 * @param {*} mySkills
 * @param {*} openError
 * @returns
 */
const addSkill = (skill, mySkills, openError) => {
    // 空チェック
    if (!skill) {
        return;
    }

    // 重複チェック
    const exists = mySkills.some((mySkill) => mySkill.skill.id === skill.id);
    if (exists) {
        openError("同じスキル有るよ");
        return;
    }

    const newMySkill = { id: null, skillId: skill.id, skill: skill, level: 1 };

    return [...mySkills, newMySkill];
};

/**
 * 保存
 * @param {*} updateMySkills
 * @param {*} mySkills
 * @returns
 */
const saveMySkills = async (updateMySkills, mySkills) => {
    const curUser = await Auth.currentAuthenticatedUser();
    // 変更のあったスキルを探す
    const predicate = (listSkill) => {
        return !listSkill.id || mySkills.some((s) => listSkill.id === s.id && listSkill.level !== s.level);
    };

    // 戻り値用
    let resultMySkills = null;

    // 更新
    const targetMySkills = updateMySkills.filter(predicate);

    if (targetMySkills.length > 0) {
        // 新気分省いたリスト
        let updatedSkills = mySkills.filter((myskill) => myskill.id !== null);

        for (const updateSkill of targetMySkills) {
            // 更新
            if (updateSkill.id) {
                const result = await API.graphql({
                    query: mutations.updateMySkill,
                    variables: {
                        input: {
                            id: updateSkill.id,
                            skillId: updateSkill.skillId,
                            level: updateSkill.level,
                            email: curUser.attributes.email,
                        },
                    },
                });

                // 更新結果を画面に反映
                updatedSkills = updatedSkills.map((myskill) => (myskill.id !== updateSkill.id ? myskill : result.data.updateMySkill));
            } else {
                // 追加
                const result = await API.graphql({
                    query: mutations.createMySkill,
                    variables: {
                        input: {
                            skillId: updateSkill.skillId,
                            level: updateSkill.level,
                            email: curUser.attributes.email,
                        },
                    },
                });

                // 登録結果を画面に反映
                updatedSkills.push(result.data.createMySkill);
            }
        }

        // 再表示用にソート
        resultMySkills = updatedSkills.sort((c1, c2) => c1.skill.name.localeCompare(c2.skill.name));
    }

    return resultMySkills;
};

/**
 * 削除
 * @param {*} selectedMySkill
 * @param {*} mySkills
 * @returns
 */
const deleteMySkill = async (selectedMySkill, mySkills) => {
    // IDがある場合はDBから消す
    if (selectedMySkill.id) {
        await API.graphql({
            query: mutations.deleteMySkill,
            variables: {
                input: {
                    id: selectedMySkill.id,
                },
            },
        });
    }

    // 画面上から消す
    const resultMySkills = mySkills.filter((mySkill) => mySkill.id !== selectedMySkill.id);

    return resultMySkills;
};

/**
 * スキル入力ページ
 * @returns
 */
const InputSkill = () => {
    // スタイルシート
    const classes = useStyles();

    const [mySkills, setMySkills] = useState([]);
    const [skills, setSkills] = useState([]);
    const [selectedMySkill, setSelectedMySkill] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { openError, openInfo, Message } = useMessage();
    const { openDialog, ConfirmDialog } = useConfirm();

    // 初期検索
    useEffect(async () => {
        const { categories, skills, mySkills } = await getInitInfo();
        setSkills(skills);
        setCategories(categories);
        setMySkills(mySkills);
    }, []);

    // カテゴリ変更
    const handleChangeCategory = useCallback((e, selCategory) => {
        setSelectedCategory(selCategory);
    }, []);

    // 新スキル追加
    const handleClickAddSkill = useCallback(
        (e, skill) => {
            const newMySkills = addSkill(skill, mySkills, openError);
            if (newMySkills) {
                setMySkills(newMySkills);
            }
        },
        [mySkills]
    );

    // 保存
    const handleClickSave = useCallback(
        async (e, updateMySkill) => {
            try {
                const resultMySkills = await saveMySkills(updateMySkill, mySkills);
                if (resultMySkills) {
                    setMySkills(resultMySkills);
                }
                openInfo("更新完了");
            } catch (e) {
                console.log(e);
                openError(e.message);
            }
        },
        [mySkills]
    );

    // 削除処理確認
    const handleClickDelete = useCallback(async (e, delMySkill) => {
        setSelectedMySkill(delMySkill);
        openDialog("削除していい？");
    }, []);

    // 削除確認はいボタン
    const handleClickConfirmYes = useCallback(async () => {
        try {
            const resultMySkills = await deleteMySkill(selectedMySkill, mySkills);
            setMySkills(resultMySkills);
        } catch (e) {
            console.log(e);

            if (e.message) {
                setErrorMessage(e.message);
            } else if (e.errors) {
                setErrorMessage(e.errors.map((err) => err.message).join("\n"));
            }
        }
        setSelectedMySkill(null);
    }, [selectedMySkill, mySkills]);

    return (
        <Container maxWidth="md">
            <Message />
            <ConfirmDialog onClickYes={handleClickConfirmYes} />
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
