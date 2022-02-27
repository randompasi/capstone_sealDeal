export default function CircleReview({click}) {
	return (
		<div className="flex flex-row justify-between">
			<Circle number={1} click={click} />
			<Circle number={2} click={click} />
			<Circle number={3} click={click} />
			<Circle number={4} click={click} />
			<Circle number={5} click={click} />
		</div>
	);
}

function Circle({number, click}) {
	console.log(number);
	return (
		<div
			onClick={() => click(number)}
			style={{width: 100, height: 100}}
			className="
            rounded-full 
            text-center 
            text-xl 
            border-green-300 
            hover:border-green-600
            border-2
            mt-4 
            flex 
            flex-col 
            justify-center 
            align-center
            text-green-400
            hover:text-green-700
            "
		>
			{number}
		</div>
	);
}
