"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw } from "lucide-react";

export default function MiniGame() {
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(0);
	const [gameActive, setGameActive] = useState(false);
	const [sequence, setSequence] = useState([]);
	const [playerSequence, setPlayerSequence] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [activeButton, setActiveButton] = useState(null);

	const colors = [
		{ id: 0, color: "bg-red-500", activeColor: "bg-red-300" },
		{ id: 1, color: "bg-blue-500", activeColor: "bg-blue-300" },
		{ id: 2, color: "bg-green-500", activeColor: "bg-green-300" },
		{ id: 3, color: "bg-yellow-500", activeColor: "bg-yellow-300" },
	];

	useEffect(() => {
		const savedHighScore = localStorage.getItem("memoryGameHighScore");
		if (savedHighScore) {
			setHighScore(parseInt(savedHighScore));
		}
	}, []);

	const playSequence = useCallback(async () => {
		setIsPlaying(true);
		for (let i = 0; i < sequence.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 500));
			setActiveButton(sequence[i]);
			await new Promise((resolve) => setTimeout(resolve, 500));
			setActiveButton(null);
		}
		setIsPlaying(false);
	}, [sequence]);

	useEffect(() => {
		if (gameActive && sequence.length > 0) {
			playSequence();
		}
	}, [sequence, gameActive, playSequence]);

	const startGame = () => {
		setScore(0);
		setGameActive(true);
		setPlayerSequence([]);
		const newSequence = [Math.floor(Math.random() * 4)];
		setSequence(newSequence);
	};

	const handleColorClick = (colorId) => {
		if (!gameActive || isPlaying) return;

		const newPlayerSequence = [...playerSequence, colorId];
		setPlayerSequence(newPlayerSequence);

		// Check if correct
		if (
			newPlayerSequence[newPlayerSequence.length - 1] !==
			sequence[newPlayerSequence.length - 1]
		) {
			// Wrong - Game Over
			setGameActive(false);
			if (score > highScore) {
				setHighScore(score);
				localStorage.setItem("memoryGameHighScore", score.toString());
			}
			return;
		}

		// Check if sequence complete
		if (newPlayerSequence.length === sequence.length) {
			// Correct sequence - Level up
			const newScore = score + 1;
			setScore(newScore);
			setPlayerSequence([]);
			setTimeout(() => {
				setSequence([...sequence, Math.floor(Math.random() * 4)]);
			}, 1000);
		}
	};

	return (
		<Card className='border-2'>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					<span className='flex items-center gap-2'>
						<Trophy className='w-5 h-5 text-yellow-600 dark:text-yellow-400' />
						Memory Game
					</span>
					<div className='flex items-center gap-4 text-sm'>
						<div>
							<span className='text-muted-foreground'>
								Score:
							</span>{" "}
							<span className='font-bold'>{score}</span>
						</div>
						<div>
							<span className='text-muted-foreground'>Best:</span>{" "}
							<span className='font-bold'>{highScore}</span>
						</div>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<p className='text-sm text-muted-foreground text-center'>
					{!gameActive
						? "Watch the sequence and repeat it!"
						: isPlaying
							? "Watch carefully..."
							: "Your turn! Click the colors in order."}
				</p>

				{/* Game Grid */}
				<div className='grid grid-cols-2 gap-4 max-w-xs mx-auto'>
					{colors.map((color) => (
						<button
							key={color.id}
							onClick={() => handleColorClick(color.id)}
							disabled={!gameActive || isPlaying}
							className={`aspect-square rounded-2xl transition-all duration-200 transform ${
								activeButton === color.id
									? `${color.activeColor} scale-95`
									: color.color
							} ${
								!gameActive || isPlaying
									? "opacity-50 cursor-not-allowed"
									: "hover:scale-105 hover:shadow-lg active:scale-95"
							}`}
						/>
					))}
				</div>

				{/* Start/Restart Button */}
				<div className='text-center'>
					<Button onClick={startGame} className='w-full max-w-xs'>
						{gameActive ? (
							<>
								<RotateCcw className='w-4 h-4 mr-2' />
								Restart Game
							</>
						) : (
							"Start Game"
						)}
					</Button>
				</div>

				{/* Game Over Message */}
				{!gameActive && score > 0 && (
					<div className='text-center p-4 bg-muted rounded-lg'>
						<p className='font-semibold'>Game Over!</p>
						<p className='text-sm text-muted-foreground'>
							You scored {score} points!
						</p>
						{score === highScore && score > 0 && (
							<p className='text-sm text-yellow-600 dark:text-yellow-400 font-semibold mt-1'>
								🎉 New High Score!
							</p>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
