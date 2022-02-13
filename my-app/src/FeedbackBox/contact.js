import React, { useState } from 'react'
import emailjs from 'emailjs-com'

const Contact = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [emailSent, setEmailSent] = useState(false);

	const submit = () => {
		if (name && email && message) {
			const serviceId = 'service_s2nyyi7';
			const templateId = 'template_3bvu6ik';
			const userId = 'user_P520wmOEaCcj3Bpo4VoUA';
			const templateParams = {
				name,
				email,
				message
			};

			emailjs.send(serviceId, templateId, templateParams, userId)
				.then(response => console.log(response))
				.then(error => console.log(error));

			setName('');
			setEmail('');
			setMessage('');
			setEmailSent(true);
		} else {
			alert('Please fill in all fields');
		}
	}

	return (
		<div id="contact-form">
			<textarea placeholder="Feedback here" value={message} onChange={e => setMessage(e.target.value)}></textarea>

			<div>
				<input type="text" placeholder="Your name here" value={name} onChange={e => setName(e.target.value)} />
				<input type="email" placeholder="Your email here" value={email} onChange={e => setEmail(e.target.value)} />
			</div>

			<div>
				<button className={"submit"} onClick={submit}>Send Message</button>
			</div>
		</div>
	);
};

export default Contact;
