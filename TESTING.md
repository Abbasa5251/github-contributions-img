# Test Plan for GitHub Contributors Image Generator

## Manual Testing Checklist

### Basic Functionality

-   [ ] Application loads at http://localhost:3000
-   [ ] Form accepts GitHub repository URLs
-   [ ] Validation shows error for invalid URLs
-   [ ] Loading state displays during image generation
-   [ ] Contributors list displays after successful fetch
-   [ ] PNG image generates and displays correctly
-   [ ] SVG image generates and displays correctly
-   [ ] Embed code generates with correct URLs
-   [ ] Copy to clipboard functionality works
-   [ ] Download buttons work for both formats

### URL Format Testing

Test with various GitHub URL formats:

-   [ ] https://github.com/facebook/react
-   [ ] https://github.com/microsoft/vscode
-   [ ] https://github.com/vercel/next.js
-   [ ] https://github.com/user/repo.git
-   [ ] https://github.com/user/repo/

### Error Handling

-   [ ] Invalid repository URL shows error
-   [ ] Non-existent repository shows error
-   [ ] Private repository shows appropriate error
-   [ ] Network errors are handled gracefully
-   [ ] Rate limit errors show helpful message

### API Endpoints

-   [ ] POST /api/contributors returns correct data
-   [ ] GET /api/contributors/image?owner=X&repo=Y returns PNG
-   [ ] GET /api/contributors/image?owner=X&repo=Y&format=svg returns SVG
-   [ ] API handles missing parameters correctly
-   [ ] API returns appropriate HTTP status codes

### Edge Cases

-   [ ] Repository with 0 contributors
-   [ ] Repository with 1 contributor
-   [ ] Repository with many contributors (30+)
-   [ ] Contributors with missing/broken avatar images
-   [ ] Very long repository names
-   [ ] Unicode characters in repository names

### Performance

-   [ ] Images generate in reasonable time (< 10 seconds)
-   [ ] Multiple requests don't block each other
-   [ ] Memory usage remains stable
-   [ ] Images are properly cached (check headers)

### Cross-browser Testing

-   [ ] Chrome/Edge
-   [ ] Firefox
-   [ ] Safari
-   [ ] Mobile browsers

## Automated Testing Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build

# Start production server
npm run start
```

## Sample Test URLs

-   https://github.com/facebook/react
-   https://github.com/microsoft/vscode
-   https://github.com/vercel/next.js
-   https://github.com/nodejs/node
-   https://github.com/tailwindlabs/tailwindcss
