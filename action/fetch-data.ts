import { writeFileSync } from "fs";
import { get } from "https";
import { Octokit } from "octokit";
import { join } from "path";
import { GithubRepoMeta } from "./ds";
import { fetchDataForAllYears } from "./get-contribs.js";
import { ignore } from "./ignore.json";

const octakit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const {
	repos: { listForAuthenticatedUser },
} = octakit.rest;

class RequestOption {
	hostname: string = "api.github.com";
	headers: Record<string, string> = {
		"user-agent": "Node.js",
		Authorization: `token ${process.env.GITHUB_TOKEN}`,
		Accept: "application/vnd.github+json",
	};
	path: string = ``;
	searchParams: Record<string, string | number> = {
		type: "all",
		per_page: 100,
	};
	constructor(path: string) {
		this.path = path;
	}
}

function convertDate(dateString: string): string {
	const date = new Date(dateString);

	let monthAbbreviations = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const day = date.getUTCDate();
	const month = monthAbbreviations[date.getUTCMonth()];
	const year = date.getUTCFullYear();

	return `${day} ${month} ${year}`;
}

function parseRepoMeta(ghResponse: Record<string, any>): GithubRepoMeta {
	return {
		name: ghResponse.name ?? "",
		owner: {
			login: ghResponse.owner?.login ?? "",
			type: ghResponse.owner?.type ?? "",
		},
		htmlUrl: ghResponse.html_url ?? "",
		description: ghResponse.description ?? "",
		fork: ghResponse.fork ?? "",
		url: ghResponse.url ?? "",
		releasesUrl: ghResponse.releases_url ?? "",
		languagesUrl: ghResponse.languages_url ?? "",
		contributorsUrl: ghResponse.contributors_url ?? "",
		createdAt: ghResponse.created_at ?? "",
		updatedAt: ghResponse.updated_at ?? "",
		homepage: ghResponse.homepage ?? "",
		stargazersCount: ghResponse.stargazers_count ?? "",
		watchersCount: ghResponse.watchers_count ?? "",
		language: ghResponse.language ?? "",
		forksCount: ghResponse.forks_count ?? "",
		archived: ghResponse.archived ?? "",
		openIssuesCount: ghResponse.open_issues_count ?? "",
		license: {
			name: ghResponse.license?.name ?? "",
			spdxId: ghResponse.license?.spdx_id ?? "",
		},
		topics: ghResponse.topics ?? "",
	};
}

async function getReposMeta(username: string): Promise<GithubRepoMeta[]> {
	const reposMeta: GithubRepoMeta[] = [];

	const { data } = await listForAuthenticatedUser({
		username: username,
		type: "all",
		per_page: 100,
	});

	const parsedData: GithubRepoMeta[] = data.map((repoMeta: any) => {
		return parseRepoMeta(repoMeta);
	});

	for (const repoMeta of parsedData) {
		if (ignore.includes(repoMeta.name)) {
			continue;
		}

		let languagesMeta: Record<string, number> = {};
		let latestVersion: string | boolean = "";
		let downloadCount: number = 0;
		let loc: number = 0;

		try {
			languagesMeta = await getLanguagesMeta(repoMeta.languagesUrl ?? "");
			/* Calculate LOC */
			loc = await countLOC(repoMeta.htmlUrl);

			/* Calculate percentage of the language meta */
			languagesMeta = calculateLangUtilPercentage(languagesMeta);

			delete repoMeta.languagesUrl;

			latestVersion = await getLatestVersion(repoMeta.releasesUrl ?? "");

			downloadCount = await getDownloadCount(repoMeta.htmlUrl);
		} catch (err) {
			console.log(err);
			console.log(
				"\n⚠️ Error Getting languages meta or latest version or download count",
			);
		}

		reposMeta.push({
			...repoMeta,
			createdAt: convertDate(repoMeta.createdAt),
			updatedAt: convertDate(repoMeta.updatedAt),
			languagesMeta: languagesMeta,
			latestVersion: latestVersion,
			downloadCount: downloadCount,
			loc: loc,
			language: repoMeta.language === "" ? "Other" : repoMeta.language,
		});
	}

	return reposMeta;
}

function getMostUsedLanguages(rawGHMEta: GithubRepoMeta[]): string[] {
	const mostUsedLanguages: Set<string> = new Set();

	rawGHMEta.forEach((repoMeta: GithubRepoMeta) => {
		mostUsedLanguages.add(repoMeta.language);
	});

	return Array.from(mostUsedLanguages).filter((lang) => lang);
}

function makeRepoGroups(
	uniqueLangs: string[],
	rawGHMEta: any,
): Record<string, GithubRepoMeta[]> {
	let groupsMeta: Record<string, GithubRepoMeta[]> = {};

	uniqueLangs.forEach((language: string) => {
		const groupedMeta = rawGHMEta.filter(
			(repoMeta: GithubRepoMeta) => repoMeta.language === language,
		);

		groupsMeta[language] = groupedMeta;
	});

	return groupsMeta;
}

function calculateLangUtilPercentage(
	languagesMeta: Record<string, number>,
): Record<string, number> {
	const sum = Object.values(languagesMeta).reduce(
		(accumulator, currentValue) => accumulator + currentValue,
		0,
	);

	const calculatedLanguageMeta: Record<string, number> = {};

	for (const language of Object.keys(languagesMeta)) {
		const utilPercent = Math.ceil((languagesMeta[language] / sum) * 100);
		calculatedLanguageMeta[language] = utilPercent;
	}

	return calculatedLanguageMeta;
}

function getLanguagesMeta(
	languageURL: string,
): Promise<Record<string, number>> {
	return new Promise((resolve, reject) => {
		const path = new URL(languageURL).pathname;
		const options = new RequestOption(path);

		get(options, (response) => {
			let data = "";

			response.on("data", (chunk) => {
				data += chunk;
			});

			response.on("end", () => {
				if (response.statusCode === 200) {
					const languagesMeta: Record<string, number> = JSON.parse(data);

					resolve(languagesMeta);
				} else {
					reject(response.statusCode);
				}
			});
		}).on("error", (err) => {
			reject(err);
		});
	});
}

function getLatestVersion(releasesUrl: string): Promise<string | boolean> {
	return new Promise((resolve, reject) => {
		const parsedUrl = new URL(`${releasesUrl.slice(0, -5)}/latest`);
		const options = new RequestOption(parsedUrl.pathname);

		get(options, (response) => {
			let data = "";

			response.on("data", (chunk) => {
				data += chunk;
			});

			response.on("end", () => {
				if (response.statusCode === 200) {
					const latestVersion: string | boolean =
						JSON.parse(data)?.tag_name ?? false;
					resolve(latestVersion);
				} else {
					resolve(false);
				}
			});
		}).on("error", (err) => {
			reject(err);
		});
	});
}

function isNodejsProject(
	userName: string,
	repoName: string,
): Promise<boolean | string> {
	const options = {
		hostname: "raw.githubusercontent.com",
		headers: {
			"user-agent": "Node.js",
			Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
			Accept: "application/json",
		},
		path: `/${userName}/${repoName}/main/package.json`,
	};

	return new Promise((resolve, reject) => {
		get(options, (response) => {
			let data: string = "";

			response.on("data", (chunk) => {
				data += chunk;
			});

			response.on("end", () => {
				if (response.statusCode === 200) {
					const packageName: string = JSON.parse(data).name;
					resolve(packageName);
				} else {
					resolve(false);
				}
			});
		}).on("error", (err) => {
			reject(err);
		});
	});
}

async function getDownloadCount(htmlUrl: string): Promise<number> {
	const [userName, repoName] = htmlUrl.slice(19).split("/");

	const nodejsPackageName: string | boolean = await isNodejsProject(
		userName,
		repoName,
	);

	return new Promise((resolve, reject) => {
		const npmEndpoint: string = `/npm/d18m/${nodejsPackageName}?label=%20&cacheSeconds=60`;
		const githubEndpoint: string = `/github/downloads-pre/${userName}/${repoName}/latest/total?sort=date&label=%20&cacheSeconds=60`;

		const options = {
			hostname: "img.shields.io",
			headers: {
				"user-agent": "Node.js",
				Accept: "application/json",
			},
			path: nodejsPackageName ? npmEndpoint : githubEndpoint,
		};

		get(options, (response) => {
			let data: string = "";

			response.on("data", (chunk) => {
				data += chunk;
			});

			response.on("end", () => {
				if (response.statusCode === 200) {
					const titleMatch = data.match(/<title>(.*?)<\/title>/);
					const downloadCount: number = titleMatch
						? parseInt(titleMatch[1])
						: 0;

					resolve(downloadCount);
				} else {
					resolve(0);
				}
			});
		}).on("error", (err) => {
			reject(err);
		});
	});
}

async function countLOC(repoURL: string): Promise<number> {
	const locMetaFilePath: string = `${repoURL}/raw/main/loc-meta.json`;
	const rawResponse = await fetch(locMetaFilePath);
	const jsonResponse = await rawResponse.json();

	return jsonResponse.SUM?.code;
}

function getOverallDownloadCounts(ghMetas: GithubRepoMeta[]): number {
	let overallDownloadCounts: number = 0;

	ghMetas.forEach((meta) => {
		const downloadCount: number = meta.downloadCount ?? 0;

		if (!!downloadCount) {
			overallDownloadCounts += downloadCount;
		}
	});

	return overallDownloadCounts;
}

/* @ts-ignore */
async function commitsCounter(urls: string[]): Promise<number> {
	let overallCommits: number = 0;

	for (const url of urls) {
		const commitsUrl = `${url}/commits`;
		const options = new RequestOption(new URL(commitsUrl).pathname);

		const totalRepoCommits: number = await new Promise(
			(resolve, reject) => {
				get(options, (response) => {
					let data: string = "";

					response.on("data", (chunk) => {
						data += chunk;
					});

					response.on("end", () => {
						if (response.statusCode === 200) {
							const parsedData: Record<string, any>[] = JSON.parse(
								data ?? "{}",
							);
							const totalRepoCommits: number = parsedData.length ?? 0;

							resolve(totalRepoCommits);
						} else {
							console.log("⚠️Failed " + commitsUrl);
							resolve(0);
						}
					});
				}).on("error", (err) => {
					reject(err);
				});
			},
		);

		overallCommits += totalRepoCommits;
	}

	return overallCommits;
}

async function getTotalContributions(
	userName: string = "iamspdarsan",
): Promise<number> {
	const data: Record<string, any> = await fetchDataForAllYears(userName);

	/* @ts-ignore */
	const totalContributions: number = data.years.reduce(
		(acumulator: number, currentValue: any) =>
			acumulator + currentValue.total,
		0,
	);

	return totalContributions;
}

async function main(): Promise<void> {
	const userName: string = "iamspdarsan";

	let ungroupedMeta: GithubRepoMeta[] = [];
	try {
		ungroupedMeta = await getReposMeta(userName);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}

	const mostUsedLanguages = getMostUsedLanguages(ungroupedMeta);
	const groupedMeta = makeRepoGroups(mostUsedLanguages, ungroupedMeta);

	/* const processedMeta = { All: ungroupedMeta, ...groupedMeta }; */
	/* 	const totalCommits = await commitsCounter(
		[...ungroupedMeta].map((meta) => meta.url),
	); */

	const totalContributions: Awaited<number> =
		await getTotalContributions();

	const localMeta = {
		projects: groupedMeta,
		totalProjects: ungroupedMeta.length,
		totalCommits: totalContributions,
		overallDownloadCounts: getOverallDownloadCounts(ungroupedMeta),
	};

	writeFileSync(
		join(process.cwd(), "ghmeta.json"),
		JSON.stringify(localMeta),
	);
}

main().catch((err) => {
	console.log(err);
});
