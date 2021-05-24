/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMySkill = /* GraphQL */ `
  mutation CreateMySkill(
    $input: CreateMySkillInput!
    $condition: ModelMySkillConditionInput
  ) {
    createMySkill(input: $input, condition: $condition) {
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
export const updateMySkill = /* GraphQL */ `
  mutation UpdateMySkill(
    $input: UpdateMySkillInput!
    $condition: ModelMySkillConditionInput
  ) {
    updateMySkill(input: $input, condition: $condition) {
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
export const deleteMySkill = /* GraphQL */ `
  mutation DeleteMySkill(
    $input: DeleteMySkillInput!
    $condition: ModelMySkillConditionInput
  ) {
    deleteMySkill(input: $input, condition: $condition) {
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
export const createSkill = /* GraphQL */ `
  mutation CreateSkill(
    $input: CreateSkillInput!
    $condition: ModelSkillConditionInput
  ) {
    createSkill(input: $input, condition: $condition) {
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
export const updateSkill = /* GraphQL */ `
  mutation UpdateSkill(
    $input: UpdateSkillInput!
    $condition: ModelSkillConditionInput
  ) {
    updateSkill(input: $input, condition: $condition) {
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
export const deleteSkill = /* GraphQL */ `
  mutation DeleteSkill(
    $input: DeleteSkillInput!
    $condition: ModelSkillConditionInput
  ) {
    deleteSkill(input: $input, condition: $condition) {
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
export const createSkillCategory = /* GraphQL */ `
  mutation CreateSkillCategory(
    $input: CreateSkillCategoryInput!
    $condition: ModelSkillCategoryConditionInput
  ) {
    createSkillCategory(input: $input, condition: $condition) {
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
export const updateSkillCategory = /* GraphQL */ `
  mutation UpdateSkillCategory(
    $input: UpdateSkillCategoryInput!
    $condition: ModelSkillCategoryConditionInput
  ) {
    updateSkillCategory(input: $input, condition: $condition) {
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
export const deleteSkillCategory = /* GraphQL */ `
  mutation DeleteSkillCategory(
    $input: DeleteSkillCategoryInput!
    $condition: ModelSkillCategoryConditionInput
  ) {
    deleteSkillCategory(input: $input, condition: $condition) {
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
