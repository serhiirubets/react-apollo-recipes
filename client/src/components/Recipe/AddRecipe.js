import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries';
import CKEditor from 'react-ckeditor-component';
import withAuth from '../withAuth';
import { Error } from '../Error';

const initialState = {
    name: "",
    username: "",
    imageUrl: "",
    category: "Breakfast",
    description: "",
    instructions: "",
}

class AddRecipe extends Component {
    state = {
       ...initialState
    }
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    handleEditorChange = (event) => {
        const instructions = event.editor.getData();
        this.setState({
            instructions
        })
    }

    componentDidMount() {
        this.setState({
            username: this.props.session.getCurrentUser.username
        })
    }
    validateForm = () => {
        const { name, imageUrl, category, description, instructions } = this.state;
        return !name || !imageUrl || !description || !instructions || !category;
    }
    handleSubmit = (e, addRecipe) => {
        e.preventDefault()
        addRecipe()
            .then(({ data }) => {
                this.clearState()
                this.props.history.push('/');
            })
    }
    clearState = () => {
        this.setState({ ...initialState })
    }
    updateCache = (cache, {data: { addRecipe }}) => {
        const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });

        cache.writeQuery({
            query: GET_ALL_RECIPES,
            data: { getAllRecipes: [...getAllRecipes, addRecipe] }
        })
    }
    render() {
        const { name, imageUrl, category, description, instructions, username } = this.state;
        return <Mutation mutation={ADD_RECIPE} update={this.updateCache} variables={{
            name, imageUrl, category, description, instructions, username
        }}
        refetchQueries={() => [
            { query: GET_USER_RECIPES, variables: { username } }
        ]}
        >
            {(addRecipe, {data, loading, error}) => {
                return (
                    <div className="App">
                        <h2 className="App">Add recipe</h2>
                        <form className="form" onSubmit={(e) => this.handleSubmit(e, addRecipe)}>
                            <input type="text" name="name" onChange={this.handleChange} placeholder="Recipe name" value={name} />
                            <input type="text" name="imageUrl" onChange={this.handleChange} placeholder="Recipe image" value={imageUrl} />
                            <select name="category" onChange={this.handleChange} value={category}>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Snack">Snack</option>
                            </select>
                            <input type="text" name="description" onChange={this.handleChange} placeholder="Add description" value={description} />
                
                            {/* <textarea name="instructions" onChange={this.handleChange} placeholder="Instructions" value={instructions} /> */}
                            <label htmlFor="instructions">Add instructions</label>
                            <CKEditor name="instructions" content={instructions} events={{ change: this.handleEditorChange }} />
                            <button disabled={loading || this.validateForm()} type="submit">Add Recipe</button>

                            {error && <Error error={error} />}
                        </form>
                        
                    </div>
                )
            }}
        </Mutation>
    }
}

export default withAuth(session => session && session.getCurrentUser)(AddRecipe);
