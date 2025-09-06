"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Loader2,
	Download,
	Copy,
	Github,
	ExternalLink,
	Users,
	CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
	const [repoUrl, setRepoUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [contributors, setContributors] = useState([]);
	const [generatedImages, setGeneratedImages] = useState<{
		png: string;
		svg: string;
	} | null>(null);
	const [embedCode, setEmbedCode] = useState("");
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);

	const validateGitHubUrl = (url: string): boolean => {
		try {
			const urlObj = new URL(url);
			return (
				urlObj.hostname === "github.com" &&
				/\/[^\/]+\/[^\/]+/.test(urlObj.pathname)
			);
		} catch {
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!validateGitHubUrl(repoUrl)) {
			setError("Please enter a valid GitHub repository URL");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("/api/contributors", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ repoUrl }),
			});

			const data = await response.json();

			if (data.success) {
				setContributors(data.contributors);
				setGeneratedImages(data.images);
				setEmbedCode(data.embedCode);
			} else {
				setError(data.error || "Failed to generate contributors image");
			}
		} catch (error) {
			setError(
				"Network error. Please check your connection and try again."
			);
		} finally {
			setLoading(false);
		}
	};

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			toast.success("Copied to clipboard!", {
				description:
					"The embed code has been copied to your clipboard.",
			});
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy to clipboard:", err);
			toast.error("Failed to copy", {
				description: "Could not copy to clipboard. Please try again.",
			});
		}
	};

	const downloadImage = (dataUrl: string, filename: string) => {
		try {
			const link = document.createElement("a");
			link.href = dataUrl;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			toast.success("Download started!", {
				description: `${filename} is being downloaded.`,
			});
		} catch (err) {
			console.error("Failed to download:", err);
			toast.error("Download failed", {
				description: "Could not download the image. Please try again.",
			});
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			<div className="container mx-auto px-4 py-8">
				{/* Theme Toggle */}
				<div className="flex justify-end mb-4">
					<ThemeToggle />
				</div>

				<div className="max-w-4xl mx-auto space-y-8">
					{/* Header */}
					<div className="text-center space-y-4">
						<div className="flex items-center justify-center gap-2 mb-4">
							<Github className="h-8 w-8" />
							<h1 className="text-4xl font-bold tracking-tight">
								GitHub Contributors Image Generator
							</h1>
						</div>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Generate beautiful contributor images for your
							GitHub repositories in PNG and SVG formats, with
							ready-to-use embed codes for your README files.
						</p>
						<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
							<Badge variant="secondary">PNG & SVG Support</Badge>
							<Badge variant="secondary">Instant Embedding</Badge>
							<Badge variant="secondary">
								Free & Open Source
							</Badge>
						</div>
					</div>

					{/* Input Form */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ExternalLink className="h-5 w-5" />
								Repository URL
							</CardTitle>
							<CardDescription>
								Enter the GitHub repository URL to generate
								contributor images
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="repoUrl">
										GitHub Repository URL
									</Label>
									<Input
										id="repoUrl"
										type="url"
										value={repoUrl}
										onChange={(e) => {
											setRepoUrl(e.target.value);
											setError("");
										}}
										placeholder="https://github.com/owner/repository"
										required
									/>
									{error && (
										<Alert variant="destructive">
											<AlertDescription>
												{error}
											</AlertDescription>
										</Alert>
									)}
								</div>

								<Button
									type="submit"
									disabled={loading || !repoUrl}
									className="w-full"
									size="lg"
								>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Generating Images...
										</>
									) : (
										<>
											<Users className="mr-2 h-4 w-4" />
											Generate Contributors Image
										</>
									)}
								</Button>
							</form>

							{/* Examples */}
							<div className="mt-6 p-4 bg-muted/50 rounded-lg">
								<h4 className="font-medium mb-2">
									Example URLs:
								</h4>
								<div className="space-y-1 text-sm text-muted-foreground">
									<div>
										• https://github.com/facebook/react
									</div>
									<div>
										• https://github.com/microsoft/vscode
									</div>
									<div>
										• https://github.com/vercel/next.js
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Loading State */}
					{loading && (
						<Card>
							<CardHeader>
								<CardTitle>Generating Images...</CardTitle>
								<CardDescription>
									Fetching contributors and creating images,
									please wait.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
									{Array.from({ length: 12 }).map((_, i) => (
										<div
											key={i}
											className="flex flex-col items-center space-y-2"
										>
											<Skeleton className="h-12 w-12 rounded-full" />
											<Skeleton className="h-4 w-16" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Contributors Display */}
					{contributors.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Users className="h-5 w-5" />
									Contributors ({contributors.length})
								</CardTitle>
								<CardDescription>
									Repository contributors with their
									contribution counts
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
									{contributors.map(
										(contributor: any, index) => (
											<div
												key={index}
												className="flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
											>
												<Avatar className="h-12 w-12">
													<AvatarImage
														src={
															contributor.avatar_url
														}
														alt={contributor.login}
													/>
													<AvatarFallback>
														{contributor.login
															.charAt(0)
															.toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div className="text-center">
													<p className="text-sm font-medium truncate max-w-20">
														{contributor.login}
													</p>
													<Badge
														variant="outline"
														className="text-xs"
													>
														{
															contributor.contributions
														}{" "}
														commits
													</Badge>
												</div>
											</div>
										)
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Generated Images */}
					{generatedImages && (
						<div className="space-y-6">
							{/* PNG Image */}
							<Card>
								<CardHeader>
									<CardTitle>PNG Image</CardTitle>
									<CardDescription>
										High-quality raster image perfect for
										most use cases
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="p-4 border rounded-lg bg-muted/20 overflow-hidden">
										<div className="w-full overflow-hidden rounded-lg border bg-white shadow-sm">
											<img
												src={generatedImages.png}
												alt="Contributors PNG"
												className="w-full h-auto max-w-full object-contain"
											/>
										</div>
									</div>
									<Button
										onClick={() =>
											downloadImage(
												generatedImages.png,
												"contributors.png"
											)
										}
										variant="outline"
										className="w-full sm:w-auto"
									>
										<Download className="mr-2 h-4 w-4" />
										Download PNG
									</Button>
								</CardContent>
							</Card>

							{/* SVG Image */}
							<Card>
								<CardHeader>
									<CardTitle>SVG Image</CardTitle>
									<CardDescription>
										Scalable vector image with clickable
										contributor links
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="p-4 border rounded-lg bg-muted/20 overflow-hidden">
										<div className="w-full overflow-hidden rounded-lg border bg-white shadow-sm">
											<div
												className="svg-container"
												dangerouslySetInnerHTML={{
													__html: generatedImages.svg,
												}}
											/>
										</div>
									</div>
									<Button
										onClick={() =>
											downloadImage(
												`data:image/svg+xml;base64,${btoa(
													generatedImages.svg
												)}`,
												"contributors.svg"
											)
										}
										variant="outline"
										className="w-full sm:w-auto"
									>
										<Download className="mr-2 h-4 w-4" />
										Download SVG
									</Button>
								</CardContent>
							</Card>
						</div>
					)}

					{/* Embed Code */}
					{embedCode && (
						<Card>
							<CardHeader>
								<CardTitle>Embed Code</CardTitle>
								<CardDescription>
									Ready-to-use markdown code for your README
									file
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="relative">
									<Textarea
										value={embedCode}
										readOnly
										rows={8}
										className="font-mono text-sm resize-none"
									/>
									<Button
										onClick={() =>
											copyToClipboard(embedCode)
										}
										variant="outline"
										size="sm"
										className="absolute top-2 right-2"
									>
										{copied ? (
											<>
												<CheckCircle className="mr-1 h-3 w-3" />
												Copied
											</>
										) : (
											<>
												<Copy className="mr-1 h-3 w-3" />
												Copy
											</>
										)}
									</Button>
								</div>
								<div className="text-sm text-muted-foreground">
									<p className="font-medium mb-1">
										How to use:
									</p>
									<ol className="list-decimal list-inside space-y-1">
										<li>Copy the code above</li>
										<li>
											Paste it into your README.md file
										</li>
										<li>
											Commit and push to see the
											contributor image
										</li>
									</ol>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
