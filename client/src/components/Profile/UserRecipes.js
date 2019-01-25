import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CURRENT_USER, UPDATE_USER_RECIPE } from '../../queries';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';


class UserRecipes extends Component {
    state = {
        _id: '',
        name: '',
        imageUrl: '',
        category: '',
        description: '',
    }
    handleDelete = deleteUserRecipe => {
        const confirmDelete = window.confirm('Are you sure ?');
    
        if (confirmDelete) {
            deleteUserRecipe()
                .then(({data}) => {
                })
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = (e, updateUserRecipe) => {
        e.preventDefault();
        updateUserRecipe().then(() => this.closeModal());
    }

    closeModal = () => {
        this.setState({ modal: false })
    }

    showModal = () => {
        this.setState({ modal: true })
    }

    loadRecipe = (recipe) => {
        this.setState({ ...recipe, modal: true});
    }

    render() {
        const { username } = this.props;

        return (
            <Query query={GET_USER_RECIPES} variables={{ username }}>
                {({ data, loading, error }) => {
                    if (loading) {
                        return <Spinner />
                    }
                    if (error) {
                        return <div>Error: ${error}</div>
                    }
        
                    return (
                        <>
                            {
                                this.state.modal && (
                                    <EditRecipeModal
                                        closeModal={this.closeModal}
                                        handleChange={this.handleChange}
                                        recipe={this.state}
                                        handleSubmit={this.handleSubmit}
                                    />
                                )
                            }
                            <h3>Your Recipes:</h3>
                            <ul>
                                {
                                data.getUserRecipes.map(recipe => (
                                    <li key={recipe._id}>
                                        <p><Link to={`/recipes/${recipe._id}`}>{recipe.name}</Link></p>
                                        <p>Likes: {recipe.likes}</p>
                                        <Mutation mutation={DELETE_USER_RECIPE} variables={{ _id: recipe._id }} update={
                                            (cache, {data: { deleteUserRecipe }}) => {
                                                const { getUserRecipes } = cache.readQuery({
                                                    query: GET_USER_RECIPES,
                                                    variables: { username }
                                                });
        
                                                cache.writeQuery({
                                                    query: GET_USER_RECIPES,
                                                    variables: { username },
                                                    data: {
                                                        getUserRecipes: getUserRecipes.filter(recipe => recipe._id !== deleteUserRecipe._id)
                                                    }
                                                })
                                            }
                                        }
                                        refetchQueries={() => [
                                            { query: GET_ALL_RECIPES},
                                            { query: GET_CURRENT_USER }
                                        ]}
                                        >
                                            {
                                                (deleteUserRecipe, attrs = {}) => (
                                                   <div>
                                                        <button className="button-primary" onClick={() => this.loadRecipe(recipe)}>Update</button>
                                                        <p className="delete-button" onClick={() => this.handleDelete(deleteUserRecipe)}>
                                                            { attrs.loading ? <p>deleting</p> : 'X'}
                                                        </p>
                                                   </div>
                                                )
                                            }
                                        </Mutation>
                                    </li>
                                ))
                            }
                            </ul>
                        </>
                    )
                }}
            </Query>
        )
        
    }
}

const EditRecipeModal = ({ handleChange, closeModal, recipe, handleSubmit }) => (
   <Mutation mutation={UPDATE_USER_RECIPE} variables={{
       _id: recipe._id,
       name: recipe.name,
       imageUrl: recipe.imageUrl,
       category: recipe.category,
       description: recipe.description,
   }}>
       {updateUserRecipe => {
           return (
                <div className="modal modal-open">
                    <div className="modal-inner">
                        <div className="modal-content">
                            <form className="modal-content-inner" onSubmit={(e) => handleSubmit(e, updateUserRecipe)}>
                                <h4>Edit Recipe</h4>
                                <label htmlFor="name">Recipe name</label>
                                <input type="text" name="name" onChange={handleChange} value={recipe.name} />

                                <label htmlFor="imageUrl">Recipe image</label>
                                <input type="text" name="imageUrl" onChange={handleChange} value={recipe.imageUrl} />

                                <label htmlFor="category">Recipe category</label>
                                <select name="category" onChange={handleChange} value={recipe.category}>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Snack">Snack</option>
                                </select>

                                <label htmlFor="description">Recipe description</label>
                                <input type="text" name="description" onChange={handleChange} value={recipe.description} />

                                <hr />

                                <div className="modal-buttons">
                                    <button type="submit" className="button-primary">Update</button>
                                    <button onClick={closeModal}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
           )
       }}
   </Mutation>
)
export default UserRecipes;