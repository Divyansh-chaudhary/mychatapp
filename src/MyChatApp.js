import React, {useState, useEffect} from 'react';
import './css/mychatapp.css';
import SideBar from './components/SideBar';
import Chat from './components/Chat';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

export default function MyChatApp() {
	
	const [ showMenu, setShowMenu ] = useState();
	
	useEffect(() => {
		window.screen.width <= 700 ? setShowMenu(false) : setShowMenu(true)
	},[]);
	
	return (
		<div className="mychatapp">
			<BrowserRouter>
				<SideBar showMenu={showMenu} setShowMenu={setShowMenu} />
				<Switch>
					<Route exact path="/rooms/:roomId">
						<Chat 
						  showMenu={showMenu} 
						  setShowMenu={setShowMenu} 
						/>
					</Route>
					<Route path="/">
						<Chat 
						  showMenu={showMenu} 
						  setShowMenu={setShowMenu} 
						/>
					</Route>
				</Switch>
			</BrowserRouter>
		</div>
	)
}