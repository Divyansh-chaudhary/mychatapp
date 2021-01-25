import React from 'react';
import '../css/login.css';
import {Button} from '@material-ui/core';
import {auth, provider} from '../firebase.config';

export default function Login() {
	
	const signIn = () => {
		auth.signInWithPopup(provider)
		.catch(err => alert(err.message))
	}
	return (
		<div className="login">
			<div className='logo'>
				<h2 className='sign  sign__word'>MyChats</h2>
			</div>
			<Button
			  className="signin-btn"
			  onClick={signIn}
			>
			  Sign In with Google Account
			</Button>
		</div>
	)
}