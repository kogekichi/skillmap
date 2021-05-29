import { withAuthenticator } from "@aws-amplify/ui-react";
import { Container, Grid } from "@material-ui/core";
import Amplify, { API, Auth } from "aws-amplify";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import React, { useCallback, useEffect, useState } from "react";
import { useMessage } from "../components/commons/Message";
import Skill from "../components/commons/Skill";
import CompareSkillList from "../components/CompareSkill/CompareSkillList";
import Users from "../components/CompareSkill/Users";
import awsconfig from "../src/aws-exports";
import * as queries from "../src/graphql/queries";

/**
 * 初期情報取得
 * @returns users ユーザ一覧, skills スキル一覧
 */
const getInitInfo = async () => {
    // スキル一覧取得
    const resSkillｓ = await API.graphql({
        query: queries.listSkills,
    });
    const skills = resSkillｓ.data.listSkills.items.sort((c1, c2) => c1.name.localeCompare(c2.name));

    // ユーザ一覧
    // let apiName = "AdminQueries";
    // let path = "/listUsersInGroup";
    // let myInit = {
    //     queryStringParameters: {},
    //     headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
    //     },
    // };
    // const { NextToken, ...rest } = await API.get(apiName, path, myInit);
    // Cognitoからユーザ一覧取得
    const credentials = await Auth.currentCredentials();
    const cognitoServiceProvider = new CognitoIdentityServiceProvider({
        credentials: Amplify.Auth.essentialCredentials(credentials),
        region: awsconfig.aws_cognito_region,
    });
    const result = await cognitoServiceProvider.listUsers({ UserPoolId: awsconfig.aws_user_pools_id }).promise();

    // ユーザを使いやすいように変換
    const users = result.Users.map((user) => ({
        username: user.username,
        email: user.Attributes.find((attr) => attr.Name === "email").Value,
        name: user.Attributes.find((attr) => attr.Name === "name").Value,
    }));

    return { users, skills };
};

/**
 * 選択されたスキルを、比較用スキルへ追加する
 * @param {*} compSkills
 * @param {*} skill
 * @returns
 */
const addSkill = (skill, compSkills, openError) => {
    // 空チェック
    if (!skill) {
        return;
    }

    // 重複チェック
    const exists = compSkills.some((compSkill) => compSkill.id === skill.id);
    if (exists) {
        openError("同じスキル有るよ");
        return;
    }

    return [...compSkills, skill];
};

/**
 * ユーザ追加
 * @param {*} selUser
 * @param {*} compUsers
 * @param {*} userSkills
 * @param {*} openError
 * @returns
 */
const addCompUser = async (selUser, compUsers, userSkills, openError) => {
    // 空チェック
    if (!selUser) {
        return {};
    }

    // 重複チェック
    const exists = compUsers.some((compUser) => compUser.email === selUser.email);
    if (exists) {
        openError("同じ人いるよ");
        return {};
    }

    // 対象ユーザのスキル取得
    const resUserSkill = await API.graphql({
        query: queries.listMySkills,
        variables: { filter: { email: { eq: selUser.email } } },
    });

    const newUserSkills = [...userSkills, ...resUserSkill.data.listMySkills.items];
    const newCompUsers = [...compUsers, selUser];
    return { newUserSkills, newCompUsers };
};

/**
 * スキル比較ページ
 * @returns コンポーネント
 */
const CompareSkill = () => {
    const [compUsers, setCompUsers] = useState([]); // 比較用に追加されたユーザ
    const [compSkills, setCompSkills] = useState([]); // 比較用に追加されたスキル
    const [userSkills, setUserSkills] = useState([]); // 追加されたユーザのスキル
    const [users, setUsers] = useState([]); // 全ユーザ
    const [skills, setSkills] = useState([]); // 全スキル
    const { openError, Message } = useMessage();

    // 初期検索
    useEffect(async () => {
        const { users, skills } = await getInitInfo();
        setSkills(skills);
        setUsers(users);
    }, []);

    // 新スキル追加
    const handleClickAddSkill = useCallback(
        (e, skill) => {
            const newCompSkill = addSkill(skill, compSkills, openError);
            if (newCompSkill) {
                setCompSkills(newCompSkill);
            }
        },
        [compSkills]
    );

    // メンバー追加
    const handleClickAddUser = useCallback(
        async (e, selUser) => {
            const { newUserSkills, newCompUsers } = await addCompUser(selUser, compUsers, userSkills, openError);

            newUserSkills && setUserSkills(newUserSkills);
            newCompUsers && setCompUsers(newCompUsers);
        },
        [compUsers, userSkills]
    );

    return (
        <>
            <Message />
            <Container maxWidth="md">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Skill skills={skills} onClickAddSkill={handleClickAddSkill} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Users users={users} onClickAddUser={handleClickAddUser} />
                    </Grid>
                </Grid>
            </Container>
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <CompareSkillList skills={compSkills} users={compUsers} userSkills={userSkills} />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default withAuthenticator(CompareSkill, true);
