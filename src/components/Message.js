import React from 'react';
import '../css/message.css';
import {useStateValue} from '../StateProvider';

export default function Message({text, sentAt, name}) {
	
	const [{user}] = useStateValue();
	
	return (
		<div className={`message ${user.displayName === name ?'':'receiver'}`}>
			<p className='name'>{name}</p>
			<p className='msg'>{text}</p>
			<p className='date'>{sentAt}</p>
		</div>
	)
}