import { writeFileSync } from "fs";
import { get } from "https";
import { join } from "path";
import { GithubRepoMeta } from "./ds";

class RequestOption {
	hostname: string = "api.github.com";
	headers: Record<string, string> = {
		"user-agent": "Node.js",
		Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
		Accept: "application/json",
	};
	path: string = ``;

	constructor(path: string) {
		this.path = path;
	}
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

function getReposMeta(user: string): Promise<GithubRepoMeta[]> {
	const path = `/users/${user}/repos`;
	const options = new RequestOption(path);

	return new Promise((resolve, reject) => {
		get(options, (res) => {
			let data: string = "";

			res.on("data", (chunk) => {
				data += chunk;
			});

			res.on("end", async () => {
				if (res.statusCode === 200) {
					const ghResponse: Record<string, any>[] = JSON.parse(data);

					const reposMeta: GithubRepoMeta[] = [];

					for (const repoMetaRaw of ghResponse) {
						const repoMeta: GithubRepoMeta = parseRepoMeta(repoMetaRaw);

						let languagesMeta: Record<string, number> = {};
						let latestVersion: string | boolean = "";
						try {
							languagesMeta = await getLanguagesMeta(
								repoMeta.languagesUrl ?? "",
							);
							delete repoMeta.languagesUrl;

							latestVersion = await getLatestVersion(
								repoMeta.releasesUrl ?? "",
							);
						} catch {
							console.log(
								"⚠️ Error Getting languages meta or latest version",
							);
						}

						reposMeta.push({
							...repoMeta,
							languagesMeta: languagesMeta,
							latestVersion: latestVersion,
						});
					}

					resolve(reposMeta);
				} else {
					reject("Error code:" + res.statusCode);
				}
			});
		}).on("error", (err: Error) => {
			reject(err);
		});
	});
}

function getMostUsedLanguages(rawGHMEta: any): string[] {
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
					const calculatedLanguageMeta =
						calculateLangUtilPercentage(languagesMeta);
					resolve(calculatedLanguageMeta);
				} else {
					reject(response.statusCode);
				}
			});
		}).on("error", (err) => {
			reject(err);
		});
	});
}

const loadGithubMeta = async () => {
	/* GitHub page owners whose projects you have worked on */
	const workedOn: string[] = ["iamspdarsan", "cresteem"];

	const reposMeta: GithubRepoMeta[] = [];

	for (const page of workedOn) {
		const currentPageReposMeta: GithubRepoMeta[] = await getReposMeta(
			page,
		);
		/* filter */

		reposMeta.push(...currentPageReposMeta);
	}
	return reposMeta;
};

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

async function main(): Promise<void> {
	let rawGHMEta = {};
	try {
		rawGHMEta = await loadGithubMeta();
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
	const mostUsedLanguages = getMostUsedLanguages(rawGHMEta);
	const groupedMeta = makeRepoGroups(mostUsedLanguages, rawGHMEta);

	writeFileSync(
		join(process.cwd(), "ghmeta.json"),
		JSON.stringify(groupedMeta),
	);
}

main().catch((err) => {
	console.log(err);
});
