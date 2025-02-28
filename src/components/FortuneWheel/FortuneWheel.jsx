import { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";

const segments = [
	"amour", "affaires", "manipulation",
	"amour", "affaires", "manipulation",
	"amour", "affaires", "manipulation"
];
const backgroundColors = ["#ef8bf7", "#050844", "#4f09f8"];

const FortuneWheel = ({ onSpinResult }) => {
	const [mustSpin, setMustSpin] = useState(false);
	const [prizeNumber, setPrizeNumber] = useState(0);

	useEffect(() => {
		const newPrizeNumber = Math.floor(Math.random() * segments.length);
		setPrizeNumber(newPrizeNumber);
		setMustSpin(true);
	}, []);

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			<Wheel
				mustStartSpinning={mustSpin}
				prizeNumber={prizeNumber}
				data={segments.map(option => ({ option }))}
				onStopSpinning={() => {
					setMustSpin(false);
					onSpinResult(segments[prizeNumber]);
				}}
				backgroundColors={backgroundColors}
				textColors={["#ffffff"]}
				spinDuration={0.4}
			/>
		</div>
	);
};

export default FortuneWheel;
