import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { createCanvas, loadImage, CanvasRenderingContext2D } from "canvas";
import {
	parseGitHubUrl,
	generateImageDimensions,
	getContributorPosition,
} from "@/lib/utils";

interface Contributor {
	login: string;
	avatar_url: string;
	contributions: number;
	html_url: string;
}

export async function POST(request: NextRequest) {
	try {
		const { repoUrl } = await request.json();

		if (!repoUrl || typeof repoUrl !== "string") {
			return NextResponse.json({
				success: false,
				error: "Repository URL is required",
			});
		}

		// Parse GitHub URL to extract owner and repo
		const parsed = parseGitHubUrl(repoUrl);
		if (!parsed) {
			return NextResponse.json({
				success: false,
				error: "Invalid GitHub repository URL",
			});
		}

		const { owner, repo } = parsed;

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
				timeout: 10000, // 10 second timeout
			}
		);

		const contributors: Contributor[] = contributorsResponse.data.slice(
			0,
			30
		); // Limit to first 30 contributors

		if (contributors.length === 0) {
			return NextResponse.json({
				success: false,
				error: "No contributors found for this repository",
			});
		}

		// Generate PNG image
		const pngBase64 = await generatePNGImage(
			contributors,
			`${owner}/${repo}`
		);

		// Generate SVG image
		const svgContent = generateSVGImage(contributors, `${owner}/${repo}`);

		// Generate embed code
		const embedCode = generateEmbedCode(owner, repo, repoUrl);

		return NextResponse.json({
			success: true,
			contributors,
			images: {
				png: `data:image/png;base64,${pngBase64}`,
				svg: svgContent,
			},
			embedCode,
		});
	} catch (error: unknown) {
		console.error("Error processing request:", error);

		if (error && typeof error === 'object' && 'response' in error) {
			const axiosError = error as { response?: { status?: number } };
			if (axiosError.response?.status === 404) {
				return NextResponse.json({
					success: false,
					error: "Repository not found or is private",
				});
			} else if (axiosError.response?.status === 403) {
				return NextResponse.json({
					success: false,
					error: "GitHub API rate limit exceeded. Please try again later.",
				});
			}
		} else if (
			error && typeof error === 'object' && 'code' in error &&
			(error.code === "ECONNABORTED" || error.code === "ETIMEDOUT")
		) {
			return NextResponse.json({
				success: false,
				error: "Request timeout. Please try again.",
			});
		}

		return NextResponse.json({
			success: false,
			error: "Failed to fetch contributors. Please check the repository URL and try again.",
		});
	}
}

async function generatePNGImage(
	contributors: Contributor[],
	repoName: string
): Promise<string> {
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
	gradient.addColorStop(0, "#ffffff");
	gradient.addColorStop(1, "#f8fafc");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// Header
	ctx.fillStyle = "#1f2937";
	ctx.font =
		'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
	ctx.textAlign = "center";
	ctx.fillText(`Contributors to ${repoName}`, width / 2, padding + 30);

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
			ctx.strokeStyle = "#e5e7eb";
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

	return canvas.toBuffer("image/png").toString("base64");
}

function drawPlaceholderAvatar(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	size: number,
	username: string
) {
	// Background circle
	ctx.fillStyle = "#f3f4f6";
	ctx.beginPath();
	ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
	ctx.fill();

	// Border
	ctx.strokeStyle = "#e5e7eb";
	ctx.lineWidth = 2;
	ctx.stroke();

	// Initial letter
	ctx.fillStyle = "#9ca3af";
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

	let svg = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="max-width: 100%; height: auto; display: block;">`;

	// Gradient background
	svg += `<defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.1)"/>
    </filter>
  </defs>`;

	// Background
	svg += `<rect width="${width}" height="${height}" fill="url(#bg)"/>`;

	// Header
	svg += `<text x="${width / 2}" y="${
		padding + 30
	}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#1f2937">Contributors to ${repoName}</text>`;

	// Contributors
	for (let i = 0; i < contributors.length; i++) {
		const contributor = contributors[i];
		const { row, col } = getContributorPosition(i, contributorsPerRow);

		const x = padding + col * (avatarSize + margin);
		const y = padding + headerHeight + row * (avatarSize + margin);

		// Circular clip path for avatar
		svg += `<defs><clipPath id="clip${i}"><circle cx="${
			x + avatarSize / 2
		}" cy="${y + avatarSize / 2}" r="${
			avatarSize / 2
		}"/></clipPath></defs>`;

		// Avatar group with shadow
		svg += `<g filter="url(#shadow)">`;

		// Avatar image
		svg += `<image x="${x}" y="${y}" width="${avatarSize}" height="${avatarSize}" href="${contributor.avatar_url}" clip-path="url(#clip${i})"/>`;

		// Border
		svg += `<circle cx="${x + avatarSize / 2}" cy="${
			y + avatarSize / 2
		}" r="${
			avatarSize / 2
		}" fill="none" stroke="#e5e7eb" stroke-width="2"/>`;

		svg += `</g>`;

		// Interactive link
		svg += `<a href="${contributor.html_url}" target="_blank">`;
		svg += `<circle cx="${x + avatarSize / 2}" cy="${
			y + avatarSize / 2
		}" r="${avatarSize / 2}" fill="transparent" cursor="pointer"/>`;
		svg += `<title>${contributor.login} - ${contributor.contributions} contributions</title>`;
		svg += `</a>`;
	}

	svg += "</svg>";

	return svg;
}

function generateEmbedCode(
	owner: string,
	repo: string,
	repoUrl: string
): string {
	const deployUrl =
		process.env.VERCEL_URL ||
		process.env.NEXT_PUBLIC_VERCEL_URL ||
		"localhost:3000";
	const protocol = deployUrl.includes("localhost") ? "http" : "https";
	const baseUrl = `${protocol}://${deployUrl}`;

	return `<!-- Contributors -->
[![Contributors](${baseUrl}/api/contributors/image?owner=${owner}&repo=${repo})](${repoUrl}/graphs/contributors)

<!-- Or as HTML -->
<a href="${repoUrl}/graphs/contributors">
  <img src="${baseUrl}/api/contributors/image?owner=${owner}&repo=${repo}" alt="Contributors" />
</a>

<!-- SVG Version -->
[![Contributors](${baseUrl}/api/contributors/image?owner=${owner}&repo=${repo}&format=svg)](${repoUrl}/graphs/contributors)`;
}
