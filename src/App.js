import React,  {useEffect} from 'react';
import MyChatApp from './MyChatApp';
import './css/app.css';
import Login from './components/Login';
import {auth} from './firebase.config';
import {useStateValue} from './StateProvider';
import {actionTypes} from './reducer';

export default function App() {
	
	const [{user}, dispatch] = useStateValue();
	
	useEffect(() => {
		auth.onAuthStateChanged(authUser => {
			if(authUser) {
				authUser.passwordVerified = false;
				authUser.roomId = [];
				dispatch({
					type: actionTypes.SET_USER,
					payload: authUser,
				});
			} else {
				dispatch({
					type: actionTypes.SET_USER,
					payload: null,
				});
			}
		});
	},[dispatch]);
	
	return(
		<div className="app">
			{user?<MyChatApp />:<Login />}
		</div>
	)
}