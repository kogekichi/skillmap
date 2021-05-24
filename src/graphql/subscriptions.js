/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMySkill = /* GraphQL */ `
  subscription OnCreateMySkill {
    onCreateMySkill {
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
export const onUpdateMySkill = /* GraphQL */ `
  subscription OnUpdateMySkill {
    onUpdateMySkill {
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
export const onDeleteMySkill = /* GraphQL */ `
  subscription OnDeleteMySkill {
    onDeleteMySkill {
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
export const onCreateSkill = /* GraphQL */ `
  subscription OnCreateSkill {
    onCreateSkill {
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
export const onUpdateSkill = /* GraphQL */ `
  subscription OnUpdateSkill {
    onUpdateSkill {
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
export const onDeleteSkill = /* GraphQL */ `
  subscription OnDeleteSkill {
    onDeleteSkill {
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
export const onCreateSkillCategory = /* GraphQL */ `
  subscription OnCreateSkillCategory {
    onCreateSkillCategory {
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
export const onUpdateSkillCategory = /* GraphQL */ `
  subscription OnUpdateSkillCategory {
    onUpdateSkillCategory {
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
export const onDeleteSkillCategory = /* GraphQL */ `
  subscription OnDeleteSkillCategory {
    onDeleteSkillCategory {
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
