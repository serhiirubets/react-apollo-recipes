import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = date => {
    const newDate = new Date(date).toLocaleDateString('en-Us');
    const newTime = new Date(date).toLocaleTimeString('en-Us');

    return `${newDate} at ${newTime}`;
}

const UserInfo = ({ session }) => {
    return session && (
        <div>
            <h3>User Info</h3>
            <p>Username: {session.getCurrentUser.username} </p>
            <p>Email: {session.getCurrentUser.email}</p>
            <p>Join Date: {formatDate(session.getCurrentUser.joinDate)}</p>
            
            <h3>{session.getCurrentUser.username}'s Favorites</h3>
            {session.getCurrentUser.favorites ? (
                <ul>
                    {session.getCurrentUser.favorites.map(favorite => (
                        <li key={favorite._id}>
                            <Link to={`/recipes/${favorite._id}`}>{favorite.name}</Link>
                        </li>
                    ))}
                </ul>
                ) : (
                    <p>You don't have favorites recipes</p>
                )
            }
        </div>
    )
}

export default UserInfo;