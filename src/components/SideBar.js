import React, {useState,useEffect} from 'react';
import '../css/sidebar.css';
import {Avatar,  Button} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SideBarChat from './SideBarChat';
import {db} from '../firebase.config';
import {useStateValue} from '../StateProvider';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';

export default function SideBar({showMenu, setShowMenu}) {
	
	const [ searchInput, setSearchInput ] = useState('');
	const [ rooms, setRooms ] = useState([]);
	const [{user}] = useStateValue();
	const [ newRoomInput , setNewRoomInput ] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);
	const [newRoomPassInput, setNewRoomPassInput] = useState('');
	
	useEffect(() => {
		setSearchInput('');
		const unsubscribe = db.collection('rooms')
		.onSnapshot(
			(snapshot) => 
				setRooms(snapshot.docs.map(doc => ({
						name: doc.data().name,
						id: doc.id
					})
				))
		);
		return () => {
			unsubscribe();
		}
	},[]);
	
	const useStyles = makeStyles((theme) => ({
	  typography: {
		padding: theme.spacing(2),
		textAlign: 'center',
	  },
	}));

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const classes = useStyles();
	
	const createNewRoom = (e) => {
		e.preventDefault();
		if(newRoomInput !== '') {
			if (newRoomPassInput !== '') {
				db.collection('rooms').add({
					name: newRoomInput,
					password: newRoomPassInput,
					admin: user.email,
				});
				setAnchorEl(null);
				setNewRoomInput('');
				setNewRoomPassInput('');
			} else {
				alert('password can not be empty');
			}
		} else {
			alert('name can not be empty');
		}

	};
	
	return (
		<div 
		  style={{ marginLeft: `${showMenu ? "0" : "-320px"}` }}
		  className="sidebar" 
		>
			<div className="sidebar-header">
				<Avatar src={user?.photoURL} className='sidebar-avatar' />
				<div className="sidebar-input">
					<SearchIcon />
					<input
						onChange={e => setSearchInput(e.target.value)}
						value={searchInput}
						placeholder='search name...' 
					/>
				</div>
			</div>
			<div style={{marginBottom: '10px'}}>
				<Button 
				  aria-describedby={id} 
				  variant="contained" 
				  color="primary" 
				  className="addroom-btn" 
				  onClick={(e)=>setAnchorEl(e.currentTarget)}>
					Add New Room
				</Button>
				<Popover 
				  id={id} 
				  open={open} 
				  anchorEl={anchorEl}
				  onClose={()=>setAnchorEl(null)} 
				  anchorOrigin={{vertical: 'bottom',horizontal: 'center',}}	
				  transformOrigin={{ vertical: 'top',horizontal: 'center',}}>
					<div className={classes.typography}>
						<form>
							<TextField
							  id="standard-password"
							  label="Enter name of new room"
							  type="text" 
							  autoComplete="current-password"
							  value={newRoomInput}
							  onChange={e=>setNewRoomInput(e.target.value)}
							  autoFocus
							/>
							 <br/><br/>
							 <TextField
							  id="standard-password-input"
							  label="Enter password"
							  type="password" 
							  autoComplete="current-password"
							  onChange={e => setNewRoomPassInput(e.target.value)}
							  value={newRoomPassInput}
							/>
							<br/><br/>
							<Button
							  type="submit"
							  onClick={createNewRoom}>
							  Create
							</Button>
						</form>
					</div>
				</Popover>
			</div>
			<div className="sidebar-chats">
			{rooms.map(room => {
				if(room.name?.search(searchInput) !== -1) {
					return (
						<SideBarChat
							key={room.id}
							id={room.id}
							showMenu={showMenu} 
							setShowMenu={setShowMenu} 
							name={room.name}
						/>
					)
				}
			})}
			</div>
		</div>
	)
}
/*

*/