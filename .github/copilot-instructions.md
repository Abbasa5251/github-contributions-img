# GitHub Contributors Image Generator - Project Instructions

## Project Overview

This is a Next.js application that generates contributor images from GitHub repository URLs and provides embeddable links for README files. The application helps repository maintainers showcase their contributors in a visually appealing format.

## Core Functionality

-   **GitHub URL Input**: Accept GitHub repository URLs (e.g., `https://github.com/owner/repo`)
-   **Contributors Fetching**: Use GitHub API to fetch repository contributors
-   **Image Generation**: Generate contributor images/badges dynamically
-   **Embeddable Links**: Provide ready-to-use markdown/HTML embed codes for README files
-   **Customization Options**: Allow styling options (size, layout, theme, etc.)

## Tech Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **API Integration**: GitHub REST API / GraphQL API
-   **Image Generation**: Canvas API, Sharp, or similar image processing library
-   **Deployment**: Vercel (recommended for Next.js projects)

## Key Features to Implement

### 1. GitHub Repository Input

-   URL validation for GitHub repositories
-   Support for both public and private repositories (with proper authentication)
-   Handle various GitHub URL formats

### 2. Contributors Data Fetching

-   Fetch contributors list using GitHub API
-   Handle pagination for repositories with many contributors
-   Include contributor details: username, avatar, contributions count
-   Respect GitHub API rate limits

### 3. Image Generation

-   Generate contributor grids/collages
-   Support different layouts (grid, horizontal, circular)
-   Include contributor avatars and usernames
-   Customizable sizes and themes
-   Export formats: PNG, SVG, or embedded HTML

### 4. Embed Code Generation

-   Generate markdown code for README files
-   Generate HTML embed codes
-   Provide direct image URLs for embedding
-   Include copy-to-clipboard functionality

### 5. Customization Options

-   **Layout**: Grid, horizontal scroll, circular
-   **Size**: Small, medium, large, custom dimensions
-   **Theme**: Light, dark, colorful, minimal
-   **Max Contributors**: Limit number of contributors shown
-   **Sorting**: By contributions, alphabetical, recent activity

## API Endpoints Structure

### `/api/github/contributors`

-   **Method**: GET/POST
-   **Purpose**: Fetch contributors from GitHub repository
-   **Parameters**:
    -   `repoUrl`: GitHub repository URL
    -   `maxContributors`: Maximum number of contributors
    -   `token`: Optional GitHub token for private repos

### `/api/generate/image`

-   **Method**: POST
-   **Purpose**: Generate contributor image
-   **Parameters**:
    -   `contributors`: Array of contributor data
    -   `layout`: Image layout type
    -   `theme`: Visual theme
    -   `size`: Image dimensions

### `/api/embed/code`

-   **Method**: POST
-   **Purpose**: Generate embed codes
-   **Parameters**:
    -   `imageUrl`: Generated image URL
    -   `repoUrl`: Original repository URL
    -   `format`: markdown, html, or both

## File Structure Guidelines

```
/
├── app/
│   ├── page.tsx                 # Main landing page
│   ├── generate/
│   │   └── page.tsx            # Image generation interface
│   ├── api/
│   │   ├── github/
│   │   │   └── contributors/
│   │   │       └── route.ts    # GitHub API integration
│   │   ├── generate/
│   │   │   └── image/
│   │   │       └── route.ts    # Image generation endpoint
│   │   └── embed/
│   │       └── code/
│   │           └── route.ts    # Embed code generation
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── forms/
│   │   ├── RepositoryInput.tsx # GitHub URL input form
│   │   └── CustomizationPanel.tsx # Style customization
│   ├── preview/
│   │   └── ContributorPreview.tsx # Live preview component
│   └── output/
│       ├── EmbedCodes.tsx      # Embed code display
│       └── DownloadOptions.tsx # Download/copy options
├── lib/
│   ├── github/
│   │   ├── api.ts              # GitHub API utilities
│   │   └── types.ts            # GitHub API types
│   ├── image/
│   │   ├── generator.ts        # Image generation logic
│   │   └── canvas-utils.ts     # Canvas/image utilities
│   └── utils.ts                # General utilities
├── types/
│   ├── contributor.ts          # Contributor data types
│   └── image.ts                # Image generation types
└── public/
    ├── examples/               # Example generated images
    └── templates/              # Image templates
```

## Environment Variables

-   `GITHUB_TOKEN`: GitHub personal access token (optional, for higher rate limits)
-   `NEXT_PUBLIC_APP_URL`: Application base URL for embed links
-   `NEXTAUTH_SECRET`: For authentication if implementing user accounts

## GitHub API Integration Notes

-   Use GitHub REST API v4 or GraphQL API
-   Implement proper error handling for API failures
-   Cache contributor data to reduce API calls
-   Handle rate limiting gracefully
-   Support both authenticated and unauthenticated requests

## Image Generation Best Practices

-   Use server-side image generation for better performance
-   Implement caching for generated images
-   Support multiple output formats (PNG, SVG, WebP)
-   Optimize images for web usage
-   Provide fallback options for image generation failures

## User Experience Considerations

-   **Progressive Enhancement**: Show loading states during API calls and image generation
-   **Error Handling**: Clear error messages for invalid URLs or API failures
-   **Responsive Design**: Ensure the interface works on all device sizes
-   **Accessibility**: Proper alt text for images, keyboard navigation
-   **Performance**: Lazy loading, optimized images, minimal bundle size

## SEO and Marketing Features

-   **Landing Page**: Clear explanation of the tool's purpose and benefits
-   **Examples Gallery**: Showcase different styles and layouts
-   **Documentation**: Usage examples and API documentation
-   **Social Sharing**: Meta tags for social media sharing

## Testing Strategy

-   Unit tests for GitHub API integration
-   Integration tests for image generation
-   E2E tests for the complete workflow
-   Visual regression tests for generated images
-   Performance tests for large contributor lists

## Deployment Considerations

-   Configure proper CORS settings for API endpoints
-   Set up CDN for generated images
-   Implement proper caching strategies
-   Monitor API usage and rate limits
-   Set up error tracking and analytics

## Future Enhancements

-   **Animations**: Animated contributor showcases
-   **Integrations**: GitHub Apps, VS Code extension
-   **Templates**: Pre-designed contributor card templates
-   **Analytics**: Track most popular repositories
-   **User Accounts**: Save favorite configurations
-   **Batch Processing**: Generate images for multiple repositories

## Code Style Guidelines

-   Use TypeScript for type safety
-   Follow Next.js App Router conventions
-   Implement proper error boundaries
-   Use Tailwind CSS for consistent styling
-   Follow accessibility best practices
-   Write comprehensive JSDoc comments for API functions

This project aims to make it easy for open-source maintainers to showcase their community contributors in an attractive, customizable format that enhances their repository's README files.
