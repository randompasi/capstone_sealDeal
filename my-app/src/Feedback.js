import React from "react";
import {useState} from "react";
import {usePopper} from 'react-popper'
import Modal from "../common/components/Modal";
import {noop} from "lodash";
import {useToggle} from "../utils/hooks";
import {Button} from "style-components";
import styled from "styled-components";

export default function Feedback() {

	const Button = styled.button`
  	background-color: #3a4150;
  	color: white;
  	font-size: 16px;
  	padding: 5px 25px;
  	border-radius: 5px;
  	margin: 10px 0px;
  	cursor: pointer;
		text-align: center;
		font-weight: bold;
`;

	const modalStyles = {
		overlay: {
			top: '90%',
			left: '90%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
		},

	};

	const modalState = useToggle(true)

	return (
		<div>
			<Modal styles={modalStyles} onClose={modalState.toggle} isOpen={modalState.isOpen}>
				<h1>SealDeal</h1>
				<h1 align={"center"}>
					Send Feedback
				</h1>
				<p>Your feedback is helping us to do better!</p>
				<input/>
				<Button>Submit</Button>
			</Modal>
		</div>
	);
}
