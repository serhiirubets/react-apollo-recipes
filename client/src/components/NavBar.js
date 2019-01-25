import React from 'react';
import { NavLink } from 'react-router-dom';
import Signout from './Auth/Signout';

const NavBar = ({ session }) => (
    <nav>
        {session && session.getCurrentUser ? <NavBarAuth session={session} /> : <NavBarUnAuth />}
    </nav>
)

const NavBarUnAuth = () => (
    <ul>
        <li>
            <NavLink to='/' exact>Home</NavLink>
        </li>

        <li>
            <NavLink to='/search'>search</NavLink>
        </li>

        <li>
            <NavLink to='/signin'>signin</NavLink>
        </li>

        <li>
            <NavLink to='/signup'>signup</NavLink>
        </li>
    </ul>
)

const NavBarAuth = ({ session }) => (
    <>
        <ul>
            <li>
                <NavLink to='/' exact>Home</NavLink>
            </li>

            <li>
                <NavLink to='/search'>search</NavLink>
            </li>

            <li>
                <NavLink to='/recipe/add'>Add Recipe</NavLink>
            </li>

            <li>
                <NavLink to='/profile'>Profile</NavLink>
            </li>
            <li><Signout /></li>
        </ul>
        <h4>Welcome, <strong>{session.getCurrentUser.username}</strong></h4>
    </>
)

export default NavBar;