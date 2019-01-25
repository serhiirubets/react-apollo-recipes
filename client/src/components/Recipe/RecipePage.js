import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import { GET_RECIPE } from '../../queries';
import LikeRecipe from './LikeRecipe';
import Spinner from '../Spinner';

const RecipePage = ({ match }) => {
    const { _id } = match.params;

    return (
        <Query query={GET_RECIPE} variables={{ _id }}>
            {
                ({ data, loading, error}) => {
                    if (loading) return <Spinner />
                    if (error) return <div>{error}</div>
                    const { getRecipe: recipe } = data;
        
                    return (
                        <div className="App">
                            <div
                                style={{ background: `url(${data.getRecipe.imageUrl}) center center / cover no-repeat`}}
                            >

                            </div>
                            <div className="recipe">
                                <div className="recipe-header">
                                    <h2 className="recipe-name">
                                        <strong>{data.getRecipe.name}</strong>
                                    </h2>
                                    <h5><strong>{data.getRecipe.category}</strong></h5>
                                    <p>created by <strong>{data.getRecipe.username}</strong></p>
                                    <p>{data.getRecipe.likes} <span role="img" aria-label="heart">❤️</span></p>
                                    <blockquote className="recipe-description">
                                        {data.getRecipe.description}
                                    </blockquote>
                                    <h3 className="recipe-instructions__title">Instructions</h3>
                                    <div className="recipe-instructions" dangerouslySetInnerHTML={{ __html: data.getRecipe.instructions}}></div>
                                </div>
                                <LikeRecipe _id={_id} />
                            </div>
                        </div>
                    )
                }
            }
        </Query>
    )
}

export default withRouter(RecipePage);