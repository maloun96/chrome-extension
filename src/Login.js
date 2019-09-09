import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import {WEBSITE_URL} from "./constants";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: '', error: null};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        const {onSuccess} = this.props;
        event.preventDefault();
        axios.post(`${WEBSITE_URL}/auth/login`, {email: this.state.email, password: this.state.password}).then((res) => {
            onSuccess(res.data.data.token.access_token);
        }).catch((err) => {
            console.log(err.response);
            this.setState({error: true});
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input type="text" name="email" value={this.state.email} onChange={this.handleChange} className="form-control" placeholder="E-mail" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control" placeholder="Password" />
                </div>
                {this.state.error ? (
                    <div className="alert alert-danger" role="alert">
                        E-mail or password incorrect.
                    </div>
                ): null }
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        );
    }
}

export default Login;
