/** @type {import('next').NextConfig} */
const nextConfig = {
	/* config options here */
	reactCompiler: true,
	images: {
		domains: ["localhost"],
	},

	async redirects() {
		const aliases = {
			"/issue/explore": ["/explore", "/issue", "/home", "/issues"],
			"/issue/create": ["/issue/new"],
			"/issue/mine": ["/profile/issues", "/my-issues"],
		};

		const permanentAliases = ["/issue/new", "/issues"];

		const redirects = [];

		for (const [destination, sources] of Object.entries(aliases)) {
			for (const source of sources) {
				redirects.push({
					source,
					destination,
					permanent: permanentAliases.includes(source),
				});
			}
		}

		return redirects;
	},
};

export default nextConfig;
