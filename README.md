# GitHub Contributors Image Generator

A beautiful web application that generates contributor images for GitHub repositories in both PNG and SVG formats. Perfect for adding to your project's README files!

## Features

-   🎨 **Beautiful Design**: Generate clean, professional-looking contributor images
-   📱 **Multiple Formats**: Support for both PNG and SVG formats
-   🔗 **Direct Embedding**: Get ready-to-use markdown code for your README
-   ⚡ **Fast Generation**: Quick image generation using GitHub's API
-   🎯 **Click-to-Profile**: SVG images include clickable links to contributor profiles
-   📊 **Contribution Stats**: Shows contribution counts for each contributor

## Usage

### Web Interface

1. Visit the application at [github-contributions-img.vercel.app](https://github-contributions-img.vercel.app/)
2. Enter your GitHub repository URL (e.g., `https://github.com/owner/repository`)
3. Click "Generate Contributors Image"
4. Download the generated images or copy the embed code

### Direct Image API

You can also use the API directly to embed images in your README:

#### PNG Format

```markdown
![Contributors](https://github-contributions-img.vercel.app/api/contributors/image?owner=OWNER&repo=REPO)
```

#### SVG Format

```markdown
![Contributors](https://github-contributions-img.vercel.app/api/contributors/image?owner=OWNER&repo=REPO&format=svg)
```

#### HTML Format

```html
<a href="https://github.com/OWNER/REPO/graphs/contributors">
	<img
		src="https://github-contributions-img.vercel.app/api/contributors/image?owner=OWNER&repo=REPO"
		alt="Contributors"
	/>
</a>
```

## API Endpoints

### POST `/api/contributors`

Generate contributor images and get detailed information.

**Request Body:**

```json
{
	"repoUrl": "https://github.com/owner/repository"
}
```

**Response:**

```json
{
  "success": true,
  "contributors": [...],
  "images": {
    "png": "data:image/png;base64,...",
    "svg": "<svg>...</svg>"
  },
  "embedCode": "<!-- Ready-to-use markdown -->"
}
```

### GET `/api/contributors/image`

Get contributor image directly.

**Query Parameters:**

-   `owner` (required): Repository owner
-   `repo` (required): Repository name
-   `format` (optional): `png` or `svg` (default: `png`)

## Technology Stack

-   **Next.js 15**: React framework with App Router
-   **TypeScript**: Type-safe development
-   **Tailwind CSS**: Utility-first styling
-   **Canvas API**: PNG image generation
-   **SVG**: Scalable vector graphics
-   **GitHub API**: Repository and contributor data

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Abbasa5251/github-contributions-img.git
cd github-contributions-img
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

No environment variables are required for basic functionality. The app uses GitHub's public API.

For production deployment, you may want to add:

-   `GITHUB_TOKEN`: To increase API rate limits
-   `NEXT_PUBLIC_VERCEL_URL`: For proper embed code generation

## Deployment

The app can be deployed to any platform that supports Next.js:

-   Vercel (recommended)
-   Netlify
-   Railway
-   AWS Amplify
-   Docker

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

-   GitHub API for providing contributor data
-   Next.js team for the amazing framework
-   Canvas API for image generation capabilities
