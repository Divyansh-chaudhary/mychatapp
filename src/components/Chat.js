import React, {useState,  useEffect} from 'react';
import '../css/chat.css';
import {IconButton, Avatar, Button} from '@material-ui/core';
import Message from './Message';
import firebase from 'firebase';
import {db,auth} from '../firebase.config';
import SendIcon from '@material-ui/icons/Send';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import {useParams} from 'react-router-dom';
import {useStateValue} from '../StateProvider';
import TextField from '@material-ui/core/TextField';
import {actionTypes} from '../reducer';

export default function Chat({ showMenu, setShowMenu }) {
	
	const [chatInput, setChatInput] = useState('');
	const {roomId} = useParams();
	const [roomName, setRoomName] = useState();
	const [messages, setMessages] = useState([]);
	const [avatar, setAvatar] = useState();
	const [{user}, dispatch] = useStateValue();
	const [redirect, setRedirect] = useState(false);
	const [password, setPassword] = useState('');
	const [warn, setWarn] = useState('');
	
	const redirectOrNot = () => {
		for(let i = 0; i <= user.roomId.length - 1; i++) {
			if(roomId === user.roomId[i]) {
				setRedirect(true);
				break;
			} else {
				setRedirect(false);
			}
		}
	}
	
	useEffect(() => {
		setWarn('');
		if(roomId) {
			redirectOrNot();
			db.collection('rooms').doc(roomId).onSnapshot(snap => 
				setRoomName(snap.data()?.name)
			);
			db.collection('rooms')
			.doc(roomId)
			.collection('messages')
			.orderBy("sentAt", "asc")
			.onSnapshot(snapshot => {
				setMessages(snapshot.docs.map(doc => doc.data()))
			});
		}
		setAvatar(Math.floor(Math.random()*5000));
	},[roomId, user]);
	
	const submit = (e) => {
		if(roomId) {
			e.preventDefault();
			db.collection('rooms')
			.doc(roomId)
			.collection('messages')
			.add({
				message: chatInput,
				sentAt:  firebase.firestore.FieldValue.serverTimestamp(),
				name: user.displayName,
			});
			setChatInput('');
		}
	}
	
	const verifyPassword = (e) => {
		e.preventDefault();
		db.collection('rooms').doc(roomId).get()
		.then(result => {
			if(result.data().password === password) {
				if(user.roomId[0] == '') {
					user.roomId[0] = roomId;
				} else {
					user.roomId[user.roomId.length] = roomId;
				}
				redirectOrNot();
			} else {
				setWarn('wrong password');
			}
			dispatch({
				type: actionTypes.SET_USER,
				payload: user,
			});
		})
		.catch(err=>alert(err.message));
		setPassword('');
	};
	
	if(redirect) {
		return (
			<div className="chat">
				<div className='chat-header'>
					<IconButton onClick={()=>setShowMenu(!showMenu)} className='menu-btn'>
						<MenuOpenIcon />
					</IconButton>
					{roomId ? (
						<div className="chatheader-info">
							<Avatar src={`https://avatars.dicebear.com/api/human/${avatar}.svg`} />
							<h2>
								{roomName}
								<span>
									{messages[0] ? (new Date(messages[messages.length - 1]?.sentAt?.toDate()).toLocaleString()) : ''}
								</span>
							</h2>
						</div>
					) : ''}
					<div className="sidebar-footer">
						<Button onClick={()=>auth.signOut()} className="logout-btn">LogOut</Button>
					</div>
				</div>
				<div className='chat-messages'>
				{roomId ? (
					messages?.map((msg, index) => (
						<Message sentAt={new Date(msg?.sentAt?.toDate()).toLocaleString()} key={index+1} text={msg?.message} name={msg?.name} />
					))
				):(
					<h2 className="empty-chat">
						Select Your Chat room from sidebar OR Create New
					</h2>
				)}
				</div>
				<div className="chat-input">
					<form>
						<input 
						  onChange={e => setChatInput(e.target.value)} 
						  type="text"
						  value={chatInput}
						  placeholder="Enter chat"/>
						<IconButton
						  onClick={submit}
						  type="submit"
						  className="send-btn">
							<SendIcon />
						</IconButton>
					</form>
				</div>
			</div>
		)
	} else {
		return (
			<div className="chat">
				<div className='chat-header'>
					<IconButton onClick={()=>setShowMenu(!showMenu)} className='menu-btn'>
						<MenuOpenIcon />
					</IconButton>
						<div className="chatheader-info">
							<Avatar src={`https://avatars.dicebear.com/api/human/${avatar}.svg`} />
						</div>
					<div className="sidebar-footer">
						<Button onClick={()=>auth.signOut()} className="logout-btn">LogOut</Button>
					</div>
				</div>
				<div className='chat-messages'>
				{roomId ? (
					<form className="empty-chat">
						<h3>{roomName}</h3>
						<p style={{color:'crimson'}}>{warn}</p>
						<TextField
						  id="standard-password-input"
						  label="Password"
						  type="password"
						  autoComplete="current-password"
						  value={password}
						  onChange={e=>setPassword(e.target.value)}
						/>
						<br/>
						<Button 
						  type="submit" 
						  onClick={verifyPassword}
						>Submit</Button>
					</form>
				):(
					<h2 className="empty-chat">
						Select Your Chat room from sidebar OR Create New
					</h2>
				)}
				</div>
			</div>
		)
	}
}