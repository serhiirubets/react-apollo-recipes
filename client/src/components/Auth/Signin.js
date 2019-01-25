import React from 'react';
import { Mutation } from 'react-apollo';
import { SIGNIN_USER } from '../../queries'
import { Error } from '../Error'

const initialState = {
        username: "",
        password: "",
}

class Signin extends React.Component {
    state = { ...initialState }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    clearState = () => {
        this.setState({ ...initialState })
    }

    handleSubmit = (e, signinUser) => {
        e.preventDefault();
        signinUser()
            .then(async ({ data }) => {
                localStorage.setItem('token', data.signinUser.token)
                await this.props.refetch()
                this.clearState()
                this.props.history.push('/')
            })
    }

    validateForm = () => {
        const { username, password } = this.state;
        return !username  || !password
    }

    render() {
        const { username, email, password } = this.state;

        return(
            <div className="App">
                <h2 className="App">
                    Signin
                </h2>
                <Mutation mutation={SIGNIN_USER} variables={{username, email, password}}>
                    {( signinUser, {data, error, loading}) => {
                        return (
                            <form action="" className="form" onSubmit={(event) => this.handleSubmit(event, signinUser)}>
                            <input type="text" name="username" placeholder="Username" value={username} onChange={this.handleChange} />
                            <input type="password" name="password" placeholder="Password" value={password} onChange={this.handleChange} />
                            

                            <button type="submit" className="button-primary" disabled={loading || this.validateForm()}>Save</button>

                            { error && <Error error={error} />}
                        </form>
                        )
                    }}
                </Mutation>
            </div>
        )
    }
}

export default Signin