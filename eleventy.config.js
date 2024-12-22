const cleanCSS = require("clean-css");
const { DateTime } = require("luxon");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const eleventyImagePlugin = require("@11ty/eleventy-img");
const eleventySyntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const globalMetadata = require("./_data/metadata.json");
const path = require("path");

function relativeToInputPath(inputPath, relativeFilePath) {
	let split = inputPath.split("/");
	split.pop();
	return path.resolve(split.join(path.sep), relativeFilePath);
}

function isFullUrl(url) {
	try {
		new URL(url);
		return true;
	} catch(e) {
		return false;
	}
}

module.exports = function (eleventyConfig) {
	eleventyConfig.addCollection("activities", function(collectionApi) {
		let collectionSubset = [
			...collectionApi.getFilteredByTag("articles"),
			...collectionApi.getFilteredByTag("reviews"),
		];
		let sortedSubset = collectionSubset.sort(function(a, b) {
			// maintain sort order when working with default collections objects
			return a.date - b.date;
		});
		return sortedSubset;
	});
	eleventyConfig.addFilter("cssmin", function (code) {
		return new cleanCSS({}).minify(code).styles;
	});
	eleventyConfig.addFilter("head", (array, n) => {
		// Get the first `n` elements of a collection.
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});
	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});
	eleventyConfig.addFilter("isoDate", (dateObj) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toISO();
	});
	eleventyConfig.addFilter("min", (...numbers) => {
		// Return the smallest number argument
		return Math.min.apply(null, numbers);
	});
	eleventyConfig.addPassthroughCopy({ "./static/": "/" });
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: "/feed.xml",
		collection: {
			name: "articles",
			limit: 10,
		},
		metadata: globalMetadata,
	});
	eleventyConfig.addPlugin(eleventySyntaxHighlightPlugin);
	eleventyConfig.addShortcode("image", async function (src, alt) {
		let input;
		if(isFullUrl(src)) {
			input = src;
		} else {
			input = relativeToInputPath(this.page.inputPath, src);
		}

		let metadata = await eleventyImagePlugin(input, {
			widths: [360, 720],
			formats: ["svg", "avif", "jpeg"],
			urlPath: "/img/",
			outputDir: path.join(eleventyConfig.dir.output, "img"),
		});

		let imageAttributes = {
			alt,
			sizes: "360w, 720w",
			loading: "lazy",
			decoding: "async",
		};

		let options = {
			pictureAttributes: {},
			whitespaceMode: "inline",
		};

		return eleventyImagePlugin.generateHTML(metadata, imageAttributes, options);
	});
	return {
		templateFormats: [
			"md",
			"njk",
			"html"
		],
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dir: {
			input: "content",
			includes: "../_includes",
			data: "../_data",
			output: "_site"
		},
		pathPrefix: "/"
	};
};