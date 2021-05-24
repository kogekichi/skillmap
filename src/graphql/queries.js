/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMySkill = /* GraphQL */ `
  query GetMySkill($id: ID!) {
    getMySkill(id: $id) {
      id
      skillId
      level
      skill {
        id
        name
        categoryId
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listMySkills = /* GraphQL */ `
  query ListMySkills(
    $filter: ModelMySkillFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMySkills(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        skillId
        level
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSkill = /* GraphQL */ `
  query GetSkill($id: ID!) {
    getSkill(id: $id) {
      id
      name
      categoryId
      skillCategory {
        id
        name
        createdAt
        updatedAt
      }
      personSkill {
        id
        skillId
        level
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listSkills = /* GraphQL */ `
  query ListSkills(
    $filter: ModelSkillFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSkills(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        categoryId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSkillCategory = /* GraphQL */ `
  query GetSkillCategory($id: ID!) {
    getSkillCategory(id: $id) {
      id
      name
      skills {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listSkillCategorys = /* GraphQL */ `
  query ListSkillCategorys(
    $filter: ModelSkillCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSkillCategorys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
