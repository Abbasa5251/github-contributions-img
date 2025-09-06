import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { createCanvas, loadImage } from "canvas";
import { generateImageDimensions, getContributorPosition } from "@/lib/utils";

interface Contributor {
	login: string;
	avatar_url: string;
	contributions: number;
	html_url: string;
}

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const owner = searchParams.get("owner");
		const repo = searchParams.get("repo");
		const format = searchParams.get("format") || "png";

		if (!owner || !repo) {
			return new NextResponse("Missing owner or repo parameter", {
				status: 400,
			});
		}

		// Fetch contributors from GitHub API
		const contributorsResponse = await axios.get(
			`https://api.github.com/repos/${owner}/${repo}/contributors`,
			{
				headers: {
					Accept: "application/vnd.github.v3+json",
					"User-Agent": "Contributors-Image-Generator",
					...(process.env.GITHUB_TOKEN && {
						Authorization: `token ${process.env.GITHUB_TOKEN}`,
					}),
				},
				timeout: 10000,
			}
		);

		const contributors: Contributor[] = contributorsResponse.data.slice(
			0,
			30
		); // Limit to first 30 contributors

		if (format === "svg") {
			const svgContent = generateSVGImage(
				contributors,
				`${owner}/${repo}`
			);

			return new NextResponse(svgContent, {
				headers: {
					"Content-Type": "image/svg+xml",
					"Cache-Control": "public, max-age=3600",
					"Access-Control-Allow-Origin": "*",
				},
			});
		} else {
			// Default to PNG
			const pngBuffer = await generatePNGImageBuffer(
				contributors,
				`${owner}/${repo}`
			);

			return new NextResponse(pngBuffer as any, {
				headers: {
					"Content-Type": "image/png",
					"Cache-Control": "public, max-age=3600",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}
	} catch (error: any) {
		console.error("Error generating image:", error);

		if (error.response?.status === 404) {
			return new NextResponse("Repository not found", { status: 404 });
		} else if (error.response?.status === 403) {
			return new NextResponse("GitHub API rate limit exceeded", {
				status: 429,
			});
		}

		return new NextResponse("Failed to generate image", { status: 500 });
	}
}

async function generatePNGImageBuffer(
	contributors: Contributor[],
	repoName: string
): Promise<Buffer> {
	const dimensions = generateImageDimensions(contributors.length);
	const {
		width,
		height,
		contributorsPerRow,
		avatarSize,
		margin,
		padding,
		headerHeight,
	} = dimensions;

	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	// Background with subtle gradient
	const gradient = ctx.createLinearGradient(0, 0, 0, height);
	gradient.addColorStop(0, "#f8fafc");
	gradient.addColorStop(1, "#f1f5f9");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// Header
	ctx.fillStyle = "#1e293b";
	ctx.font =
		'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
	ctx.textAlign = "center";
	ctx.fillText(`Contributors to ${repoName}`, width / 2, padding + 25);

	// Load and draw avatars
	for (let i = 0; i < contributors.length; i++) {
		const contributor = contributors[i];
		const { row, col } = getContributorPosition(i, contributorsPerRow);

		const x = padding + col * (avatarSize + margin);
		const y = padding + headerHeight + row * (avatarSize + margin);

		try {
			const avatar = await loadImage(contributor.avatar_url);

			// Draw shadow
			ctx.save();
			ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
			ctx.shadowBlur = 8;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 2;

			// Draw circular avatar
			ctx.beginPath();
			ctx.arc(
				x + avatarSize / 2,
				y + avatarSize / 2,
				avatarSize / 2,
				0,
				Math.PI * 2
			);
			ctx.clip();
			ctx.drawImage(avatar, x, y, avatarSize, avatarSize);
			ctx.restore();

			// Draw border
			ctx.strokeStyle = "#e2e8f0";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(
				x + avatarSize / 2,
				y + avatarSize / 2,
				avatarSize / 2,
				0,
				Math.PI * 2
			);
			ctx.stroke();
		} catch (error) {
			console.warn(
				`Failed to load avatar for ${contributor.login}:`,
				error
			);
			// If avatar fails to load, draw a placeholder
			drawPlaceholderAvatar(ctx, x, y, avatarSize, contributor.login);
		}
	}

	return canvas.toBuffer("image/png");
}

function drawPlaceholderAvatar(
	ctx: any,
	x: number,
	y: number,
	size: number,
	username: string
) {
	// Background circle
	ctx.fillStyle = "#f1f5f9";
	ctx.beginPath();
	ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
	ctx.fill();

	// Border
	ctx.strokeStyle = "#e2e8f0";
	ctx.lineWidth = 2;
	ctx.stroke();

	// Initial letter
	ctx.fillStyle = "#94a3b8";
	ctx.font = `${size / 3}px Arial`;
	ctx.textAlign = "center";
	ctx.fillText(
		username.charAt(0).toUpperCase(),
		x + size / 2,
		y + size / 2 + size / 8
	);
}

function generateSVGImage(
	contributors: Contributor[],
	repoName: string
): string {
	const dimensions = generateImageDimensions(contributors.length);
	const {
		width,
		height,
		contributorsPerRow,
		avatarSize,
		margin,
		padding,
		headerHeight,
	} = dimensions;

	let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

	// Gradient background
	svg += `<defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.1)"/>
    </filter>
  </defs>`;

	// Background
	svg += `<rect width="${width}" height="${height}" fill="url(#bg)"/>`;

	// Header
	svg += `<text x="${width / 2}" y="${
		padding + 25
	}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#1e293b">Contributors to ${repoName}</text>`;

	// Contributors
	for (let i = 0; i < contributors.length; i++) {
		const contributor = contributors[i];
		const { row, col } = getContributorPosition(i, contributorsPerRow);

		const x = padding + col * (avatarSize + margin);
		const y = padding + headerHeight + row * (avatarSize + margin);

		// Shadow
		svg += `<circle cx="${x + avatarSize / 2 + 1}" cy="${
			y + avatarSize / 2 + 2
		}" r="${avatarSize / 2}" fill="rgba(0,0,0,0.1)"/>`;

		// Circular clip path for avatar
		svg += `<defs><clipPath id="clip${i}"><circle cx="${
			x + avatarSize / 2
		}" cy="${y + avatarSize / 2}" r="${
			avatarSize / 2
		}"/></clipPath></defs>`;

		// Avatar image
		svg += `<image x="${x}" y="${y}" width="${avatarSize}" height="${avatarSize}" href="${contributor.avatar_url}" clip-path="url(#clip${i})"/>`;

		// Border
		svg += `<circle cx="${x + avatarSize / 2}" cy="${
			y + avatarSize / 2
		}" r="${
			avatarSize / 2
		}" fill="none" stroke="#e2e8f0" stroke-width="2"/>`;

		// Link wrapper (invisible clickable area)
		svg += `<a href="${contributor.html_url}" target="_blank">`;
		svg += `<circle cx="${x + avatarSize / 2}" cy="${
			y + avatarSize / 2
		}" r="${avatarSize / 2}" fill="transparent"/>`;
		svg += `<title>${contributor.login} - ${contributor.contributions} contributions</title>`;
		svg += `</a>`;
	}

	svg += "</svg>";

	return svg;
}
