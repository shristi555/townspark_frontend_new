/** @type {import('next').NextConfig} */
const nextConfig = {
	/* config options here */
	reactCompiler: true,
	images: {
		domains: ["localhost"],
	},

	async redirects() {
		return [
			{
				source: "/explore",
				destination: "/issue/explore",
				permanent: false,
			},
			{
				source: "/issue",
				destination: "/issue/explore",
				permanent: false,
			},
			{
				source: "/issue/new",
				destination: "/issue/create",
				permanent: true,
			},
			{
				source: "/issues",
				destination: "/issue/mine",
				permanent: true,
			},
			{
				source: "/home",
				destination: "/issue/explore",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
