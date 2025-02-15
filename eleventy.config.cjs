const cleanCSS = require("clean-css");
const { DateTime } = require("luxon");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const eleventyImagePlugin = require("@11ty/eleventy-img");
const eleventySyntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const globalMetadata = require("./_data/metadata.json");
const markdownIt = require("markdown-it");
const markdownItFootnote = require('markdown-it-footnote');
const path = require("path");

const markdownOptions = {
	html: true,
	breaks: false,
	linkify: true,
	typographer: true,
};
const mdLibrary = markdownIt(markdownOptions).use(markdownItFootnote);

function relativeToInputPath(inputPath, relativeFilePath) {
	const split = inputPath.split("/");
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

module.exports = async function (eleventyConfig) {
	eleventyConfig.addCollection("activities", function(collectionApi) {
		return collectionApi.getFilteredByTag(
			...Object.keys(globalMetadata['categories'])
		).sort((a, b) => a.date - b.date)
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
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});
	eleventyConfig.addFilter("isoDate", (dateObj) => {
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toISO();
	});
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});
	eleventyConfig.addPairedShortcode(
		"callout",
		function (content, level = "", format = "md", customLabel = "") {
			const label = customLabel || globalMetadata['calloutLabels'][level]
			if (format === "md") {
				content = mdLibrary.renderInline(content);
			} else if (format === "md-block") {
				content = mdLibrary.render(content);
			}
			const labelHtml = label
				? `<div class="callout-label">${label}</div>`
				: "";
			const contentHtml =
				(content || "").trim().length > 0
					? `<div class="callout-content">${content}</div>`
					: "";
			return `<div class="callout${level
				? ` callout-${level}`
				: ""
			}">${labelHtml}${contentHtml}</div>`;
		}
	);
	eleventyConfig.addPassthroughCopy({ "./static/": "/" });
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: "/feed.xml",
		collection: {
			name: "activities",
			limit: 10,
		},
		metadata: globalMetadata,
	});
	for (category in globalMetadata['categories']) {
		eleventyConfig.addPlugin(feedPlugin, {
			type: "atom",
			outputPath: `/feeds/${category}.xml`,
			inputPath: `eleventy-plugin-feed-cameron-otsuka-${category}-atom.njk`,
			collection: {
				name: `${category}`,
				limit: 10,
			},
			metadata: {
				...globalMetadata,
				title: globalMetadata['title'].concat(
					` - ${category.charAt(0).toUpperCase()}`
				),
			},
		});
	}
	eleventyConfig.addPlugin(eleventySyntaxHighlightPlugin);
	eleventyConfig.addShortcode("image", async function (src, alt) {
		let input;
		if(isFullUrl(src)) {
			input = src;
		} else {
			input = relativeToInputPath(this.page.inputPath, src);
		}
		const metadata = await eleventyImagePlugin(input, {
			widths: [360, 720],
			formats: ["svg", "avif", "jpeg", "gif"],
			sharpOptions: {
				animated: true,
				limitInputPixels: false,
			},
			urlPath: "/img/",
			outputDir: path.join(eleventyConfig.dir.output, "img"),
		});
		const imageAttributes = {
			alt,
			sizes: "360w, 720w",
			loading: "lazy",
			decoding: "async",
			"eleventy:ignore": "",
		};
		const options = {
			pictureAttributes: {},
			whitespaceMode: "inline",
		};
		return eleventyImagePlugin.generateHTML(metadata, imageAttributes, options);
	});
	eleventyConfig.setLibrary("md", mdLibrary);
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