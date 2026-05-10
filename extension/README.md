# Career AI - Chrome Extension

Get instant job compatibility analysis and AI-powered insights directly from job boards.

## Features

- **One-Click Analysis**: Analyze any job posting on LinkedIn, Indeed, Glassdoor, and more
- **Compatibility Scoring**: Get a compatibility score based on your profile
- **Skill Gap Analysis**: Identify skills you need to develop
- **Save for Later**: Bookmark jobs to review in your Career AI dashboard

## Supported Job Boards

- LinkedIn Jobs
- Indeed
- Glassdoor
- Lever
- Greenhouse
- Angel List

## Installation

### For Development

1. **Build the extension:**
   ```bash
   # The extension files are in ./extension directory
   # No build step required - it's ready to use
   ```

2. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension` folder from this project
   - The extension will appear in your Chrome toolbar

3. **Set API Endpoint:**
   - Click the extension icon
   - It will prompt you to log in to Career AI
   - Set your API endpoint to `http://localhost:3000` (development)

### For Production

1. **Build:**
   ```bash
   # Package the extension directory
   cd extension
   zip -r career-ai-extension.zip .
   ```

2. **Submit to Chrome Web Store:**
   - Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
   - Create a new extension
   - Upload the .zip file
   - Fill in store listing details
   - Submit for review

## Usage

1. **Navigate to a job posting** on any supported job board
2. **Click the Career AI icon** in your Chrome toolbar
3. **Review the analysis**:
   - Match score (0-100%)
   - Matching skills
   - Skills to develop
   - Recommendations
4. **Click "View Full Analysis"** to see detailed insights in your dashboard
5. **"Save for Later"** to bookmark the job

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── popup.html            # Popup UI
├── popup.js              # Popup logic
├── content.js            # DOM extraction
├── background.js         # Background service worker
└── icons/               # Extension icons
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

## How It Works

1. **Content Script**: When you view a job posting, the content script extracts:
   - Job title
   - Company name
   - Full job description
   - Current page URL

2. **Popup**: Sends the extracted data to your Career AI backend for analysis

3. **Analysis**: The API:
   - Matches skills from your persona/resume
   - Calculates compatibility score
   - Identifies skill gaps
   - Generates recommendations

4. **Results**: Displays in the popup with options to:
   - View full analysis
   - Save the job for later
   - Go to Career AI dashboard

## Configuration

### API Endpoint

Set via Chrome storage in the extension options:
```javascript
chrome.storage.local.set({
  apiBaseUrl: 'http://localhost:3000/api',
  personaId: 'your-persona-id',
  apiToken: 'your-auth-token'
});
```

### Supported Domains

Currently supports job boards on:
- `linkedin.com`
- `indeed.com`
- `glassdoor.com`
- `lever.co`
- `greenhouse.io`
- `angel.co`

Add more in `content.js` by implementing domain-specific extractors.

## Development

### Adding Support for New Job Boards

1. Add domain to `manifest.json` host_permissions
2. Create extractor function in `content.js`:

```javascript
function extractCustomJob() {
  return {
    title: document.querySelector('selector-for-title')?.textContent,
    company: document.querySelector('selector-for-company')?.textContent,
    description: document.querySelector('selector-for-description')?.innerText,
    url: window.location.href,
  };
}
```

3. Add to `extractJobData()` function
4. Test on the job board

### Testing

1. Keep extension reloaded in `chrome://extensions/`
2. Open DevTools (F12)
3. Use console to test extraction:
   ```javascript
   chrome.runtime.sendMessage({action: 'getJobData'}, console.log)
   ```

## Troubleshooting

### Extension not showing on job boards
- Verify domain is in `host_permissions` in manifest.json
- Check `chrome://extensions/` to see permissions

### Analysis not working
- Verify Career AI backend is running (`http://localhost:3000`)
- Check authentication token in `chrome://extensions/` > Details > Storage
- Open DevTools console for error messages

### Job data not extracted
- Check that selectors in `content.js` match current job board layout
- Job boards frequently update their HTML structure
- Update selectors accordingly

## Privacy & Security

- Extension only runs on specified job board domains
- Job data is sent to your Career AI backend for analysis
- No data is shared with third parties
- All communication is HTTPS in production

## Support

For issues or feature requests:
- GitHub Issues: [Project Repository]
- Email: support@careerai.com

## License

MIT - See LICENSE file for details

---

Ready to land your dream role? Install Career AI today!
