import Box from "../Box";
import {render} from "react-dom";

/**
 * @param {{list: ProfilePage.History}} props
 */
function History(list) {
	const historyLists = [
		{
			id: 0,
			content: 'Bicycle',
			date: '22.10.2021',
			button: 'User Review'
		},
		{
			id: 1,
			content: 'Bicycle',
			date: '22.10.2021',
			button: 'User Review'
		},
		{
			id: 2,
			content: 'Bicycle',
			date: '22.10.2021',
			button: 'User Review'
		},
		{
			id: 3,
			content: 'Bicycle',
			date: '22.10.2021',
			button: 'User Review'
		}
	]

	const listAll = historyLists.map(historyList =>
		<li key={historyList.id}>
			{historyList.content}
			{historyList.date}
			{historyList.button}
		</li>
	)

	return (
		<div>
			<ul>
				{listAll}
			</ul>
		</div>
	)
}

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
// eslint-disable-next-line no-unused-vars
export default function SellingHistory(user) {
	return (
		<Box className="my-5" title="Selling history">
			<div className="grid grid-cols-3 w-full">
				<History list={history} key={history} />
			</div>
		</Box>
	);
}
