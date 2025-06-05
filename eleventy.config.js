import { transform } from "lightningcss";
import { DateTime } from "luxon";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import eleventyImagePlugin, { generateHTML } from "@11ty/eleventy-img";
import eleventySyntaxHighlightPlugin from "@11ty/eleventy-plugin-syntaxhighlight";
import globalMetadata from "./_data/metadata.json" with { type: "json" };
import markdownIt from "markdown-it";
import markdownItFootnote from 'markdown-it-footnote';
import { resolve, sep, join } from "path";

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
	return resolve(split.join(sep), relativeFilePath);
}

function isFullUrl(url) {
	try {
		new URL(url);
		return true;
	} catch(e) {
		return false;
	}
}

export default async function (eleventyConfig) {
	eleventyConfig.addCollection("activities", async (collectionApi) => {
		let collectionSubset = [];
		// getFilteredByTag matches ALL tags its passed, not any, so we have to do this
		for (const category in globalMetadata['categories']) {
			collectionSubset.push(...collectionApi.getFilteredByTag(category))
		}
		let sortedSubset = collectionSubset.sort(function(a, b) {
			// maintain sort order when working with default collections objects
			return a.date - b.date;
		});
		return sortedSubset;
	});
	eleventyConfig.addFilter("cssmin", function (originalCSS) {
		let { code } = transform({
			code: Buffer.from(originalCSS),
			minify: true,
			sourceMap: false
		});
		return code;
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
	eleventyConfig.addFilter("keys", function (obj) {
		return Object.keys(obj);
	});
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});
	eleventyConfig.addFilter("notIn", (stringList, rejectList) => {
		return stringList.filter(str => !rejectList.includes(str));
	});
	eleventyConfig.addFilter("startsWith", (str, prefix) => {
		return str.startsWith(prefix);
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
	for (const category in globalMetadata['categories']) {
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
					` - ${category.charAt(0).toUpperCase() + category.slice(1)}`
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
			widths: [360, 720, 1440],
			formats: ["svg", "avif", "jpeg", "gif"],
			svgAllowUpscale: true,
			sharpOptions: {
				animated: true,
				limitInputPixels: false,
			},
			urlPath: "/img/",
			outputDir: join(eleventyConfig.dir.output, "img"),
		});
		const sizes = new Set(
			Object.values(metadata).flatMap(format =>
				Object.values(format).map(size => `${size.width}w`)
			)
		);
		const imageAttributes = {
			alt,
			sizes: Array.from(sizes).join(", "),
			loading: "lazy",
			decoding: "async",
			"eleventy:ignore": "",
		};
		const options = {
			pictureAttributes: {},
			whitespaceMode: "inline",
		};
		return generateHTML(metadata, imageAttributes, options);
	});
	eleventyConfig.addShortcode("currentYear", () => {
		return `${new Date().getFullYear()}`;
	});
	eleventyConfig.addShortcode("youtube", (videoURL, title) => {
		const url = new URL(videoURL);
		const videoID = url.searchParams.get("v");
		return `<iframe class="youtube-shortcode" src="https://www.youtube-nocookie.com/embed/${videoID}" title="${title}" loading="lazy" allow="fullscreen"></iframe>`;
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