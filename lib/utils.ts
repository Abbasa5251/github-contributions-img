import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseGitHubUrl(
	url: string
): { owner: string; repo: string } | null {
	// Handle various GitHub URL formats
	const patterns = [
		/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/.*)?$/,
		/github\.com\/([^\/]+)\/([^\/]+)/,
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) {
			return {
				owner: match[1],
				repo: match[2],
			};
		}
	}

	return null;
}

export function generateImageDimensions(
	contributorCount: number,
	avatarSize: number = 60
) {
	const margin = 15;
	const padding = 30;
	const headerHeight = 60;
	const maxPerRow = 12;

	const contributorsPerRow = Math.min(contributorCount, maxPerRow);
	const rows = Math.ceil(contributorCount / contributorsPerRow);

	const width =
		contributorsPerRow * (avatarSize + margin) - margin + padding * 2;
	const height =
		headerHeight + rows * (avatarSize + margin) - margin + padding * 2;

	return {
		width,
		height,
		contributorsPerRow,
		rows,
		avatarSize,
		margin,
		padding,
		headerHeight,
	};
}

export function isValidGitHubUrl(url: string): boolean {
	try {
		const urlObj = new URL(url);
		return urlObj.hostname === "github.com" && parseGitHubUrl(url) !== null;
	} catch {
		return false;
	}
}

export function getContributorPosition(
	index: number,
	contributorsPerRow: number
) {
	const row = Math.floor(index / contributorsPerRow);
	const col = index % contributorsPerRow;
	return { row, col };
}
