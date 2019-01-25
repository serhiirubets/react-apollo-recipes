import React from 'react';
import { Link } from 'react-router-dom';

const SearchItem = ({ recipe }) => (
    <li>
        <h4><Link to={`/recipes/${recipe._id}`}>{recipe.name}</Link></h4>
        <p>Likes: {recipe.likes}</p>
    </li>
)

export default SearchItem;