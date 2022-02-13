import React from "react";
import {useState} from "react";
import {usePopper} from 'react-popper'
import Modal from "../common/components/Modal";
import {noop} from "lodash";
import {useInput, useToggle} from "../utils/hooks";
import styled from "styled-components";
import Contact from "./contact";

export default function FeedbackBox() {

	const sendEmail = () => {
		sendEmail({
			example_user: "hongdu@utu.fi",
			example_data: new Date().toISOString(),
		});
	};

	const msgSend = () => {
		console.log();
		alert(`Send successful!`)
	}


	const modalStyles = {
		overlay: {
			top: '80%',
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

				<div>
					<Contact />
				</div>

			</Modal>
		</div>
	);
}
