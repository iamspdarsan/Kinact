export function getRandomColor(): string {
	let color: string = "";
	const min: number = 50;
	const max: number = 255;

	do {
		color = `rgb(${Math.floor(Math.random() * (max - min) + min)}, 
                     ${Math.floor(Math.random() * (max - min) + min)}, 
                     ${Math.floor(Math.random() * (max - min) + min)})`;
	} while (color === "rgb(0, 0, 0)");

	return color;
}

export async function fetchGHMeta(user: string, reponame: string) {
	const response = await fetch(
		`https://raw.githubusercontent.com/${user}/${reponame}/main/ghmeta.json`,
	);
	const repoData = await response.json();
	return repoData;
}

export function getBarColours(percentages: number[]): string[] {
	const colors: string[] = [
		"#0E46A3",
		"#90D26D",
		"#80BCBD",
		"#7077A1",
		"#AC87C5",
	];

	const sortedPercentage = percentages.sort();

	const sortedColours: string[] = [];

	percentages.forEach((percentage: number) => {
		sortedColours.push(colors[sortedPercentage.indexOf(percentage)]);
	});

	return sortedColours;
}
