import React, {useState, useEffect, useRef} from 'react';
import '../css/sidebar.css';
import {db} from '../firebase.config';
import {Avatar} from '@material-ui/core';
import {useStateValue} from '../StateProvider';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import useOutsideClick from '../customhook/useOutsideClick';

export default function SideBarChat({setNewRoom, id, showMenu, setShowMenu, name }) {
	
	const ref = useRef();
	const [ showOptions, setShowOptions ] = useState(false);
	const [avatar, setAvatar] = useState();
	const [{user}] = useStateValue();
	const [anchorEl, setAnchorEl] = useState(null);
	
	useEffect(() => {
		setAvatar(Math.floor(Math.random()*5000));
	},[id]);
	
	useOutsideClick(ref, () => {
		setShowOptions(false);
	});
	
	const deleteRoom = () => {
		db.collection('rooms').doc(id).get()
		.then(result => {
			if(result.data().admin === user.email) {
				const password = prompt("Enter password");
				if(password) {
					if(result.data().password === password) {
						db.collection('rooms')
						.doc(id)
						.delete()
						.catch(err => alert(err.message));
					} else {
						alert('wrong password');
					}
				}
			} else {
				alert("Only admins are allowed to delete the room");
			}
		})
		.catch(err=>alert(err.message));
	};
	
	const useStyles = makeStyles((theme) => ({
	  typography: {
		padding: theme.spacing(2),
	  },
	}));
	
	const open = Boolean(anchorEl);
	const pid = open ? 'simple-popover' : undefined;
	const classes = useStyles();
	
 	return (
	<Link 
	  aria-describedby={pid} 
	  variant="contained" 
	  color="primary" 
	  className="addroom-btn" 
	  onClick={(e)=>setAnchorEl(e.currentTarget)} 
	  to={`/rooms/${id}`}>
		<div 
		  onClick={()=>window.screen.width<=700?setShowMenu(false):''}
		  className="sidebar-chat-a"
		>
			<div className="sidebar-chat">
				<Avatar src={`https://avatars.dicebear.com/api/human/${avatar}.svg`} />
				<div className="sidebar-chat-info">
					<h3>{name}</h3>
				</div>
				<div className="more-option"  ref={ref}>
					<MoreHorizIcon 
					  onClick={()=>setShowOptions(!showOptions)} 
					  className="icon" 
					/>
					<div
					  style={{ display: showOptions ? "block" : "none"}}
					  className="delete-option"
					>
						<p onClick={deleteRoom}>Delete</p>
					</div>
				</div>
			</div>
		</div>
	</Link>
	)
}