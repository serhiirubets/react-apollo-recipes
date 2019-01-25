import { gql } from 'apollo-boost';

export const recipeFragments = {
    recipe: gql`
        fragment CompleteRecipe on Recipe {
            _id
            username
            name
            category
            description
            instructions
            createdDate
            likes
            imageUrl
        }
    `,
    like: gql`
        fragment LikeRecipe on Recipe {
            _id
            likes
        }
    `
}