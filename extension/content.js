// Content script for Career AI extension
// Extracts job data from various job boards

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getJobData') {
    const jobData = extractJobData();
    sendResponse({ jobData });
  }
});

function extractJobData() {
  const url = window.location.hostname;

  // LinkedIn Jobs
  if (url.includes('linkedin.com')) {
    return extractLinkedInJob();
  }

  // Indeed
  if (url.includes('indeed.com')) {
    return extractIndeedJob();
  }

  // Glassdoor
  if (url.includes('glassdoor.com')) {
    return extractGlassdoorJob();
  }

  // Lever
  if (url.includes('lever.co')) {
    return extractLeverJob();
  }

  // Greenhouse
  if (url.includes('greenhouse.io')) {
    return extractGreenhouseJob();
  }

  // Angel List
  if (url.includes('angel.co')) {
    return extractAngelListJob();
  }

  // Bayt.com
  if (url.includes('bayt.com')) {
    return extractBaytJob();
  }

  // Naukri.com
  if (url.includes('naukri.com')) {
    return extractNaukriJob();
  }

  return null;
}

function extractLinkedInJob() {
  try {
    const title = document.querySelector('[data-job-title]')?.textContent || 'Job Title';
    const company = document.querySelector('[data-company-name]')?.textContent || 'Company';
    const description =
      document.querySelector('.description__text')?.innerText ||
      document.body.innerText.substring(0, 2000);

    return {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      url: window.location.href,
    };
  } catch (error) {
    console.error('Error extracting LinkedIn job:', error);
    return null;
  }
}

function extractIndeedJob() {
  try {
    const title = document.querySelector('[data-testid="jobsearch-JobInfoHeader-jobTitle"]')?.textContent || 'Job Title';
    const company = document.querySelector('[data-testid="jobsearch-JobInfoHeader-companyName"]')?.textContent || 'Company';
    const description =
      document.querySelector('[data-testid="jobsearch-JobComponent-FullJobDescription"]')?.innerText ||
      document.body.innerText.substring(0, 2000);

    return {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      url: window.location.href,
    };
  } catch (error) {
    console.error('Error extracting Indeed job:', error);
    return null;
  }
}

function extractGlassdoorJob() {
  try {
    const title =
      document.querySelector('[data-test="job-title"]')?.textContent ||
      document.querySelector('h1')?.textContent ||
      'Job Title';
    const company =
      document.querySelector('[data-test="job-company"]')?.textContent ||
      document.querySelector('[data-test="employer-name"]')?.textContent ||
      'Company';
    const description =
      document.querySelector('[data-test="job-description"]')?.innerText ||
      document.querySelector('.description')?.innerText ||
      document.body.innerText.substring(0, 2000);

    return {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      url: window.location.href,
    };
  } catch (error) {
    console.error('Error extracting Glassdoor job:', error);
    return null;
  }
}

function extractLeverJob() {
  try {
    const title = document.querySelector('.postings-title')?.textContent || 'Job Title';
    const company = document.querySelector('[data-qa="company-name"]')?.textContent || 'Company';
    const description =
      document.querySelector('.posting-content')?.innerText ||
      document.body.innerText.substring(0, 2000);

    return {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      url: window.location.href,
    };
  } catch (error) {
    console.error('Error extracting Lever job:', error);
    return null;
  }
}

function extractGreenhouseJob() {
  try {
    const title = document.querySelector('.app-title')?.textContent || 'Job Title';
    const company = document.querySelector('.company-name')?.textContent || 'Company';
    const description =
      document.querySelector('.job-content')?.innerText ||
      document.querySelector('.content')?.innerText ||
      document.body.innerText.substring(0, 2000);

    return {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      url: window.location.href,
    };
  } catch (error) {
    console.error('Error extracting Greenhouse job:', error);
    return null;
  }
}

function extractAngelListJob() {
  try {
    const title = document.querySelector('[data-test="job-title"]')?.textContent || 'Job Title';
    const company = document.querySelector('[data-test="company-name"]')?.textContent || 'Company';
    const description =
      document.querySelector('[data-test="job-description"]')?.innerText ||
      document.body.innerText.substring(0, 2000);

    return {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      url: window.location.href,
    };
  } catch (error) {
    console.error('Error extracting Angel List job:', error);
    return null;
  }
}

function extractBaytJob() {
  try {
    const title = document.querySelector('h1')?.textContent || document.querySelector('.job-title')?.textContent || 'Job Title';
    const company = document.querySelector('.t-bold')?.textContent || document.querySelector('.company-name')?.textContent || 'Company';
    const description =
      document.querySelector('.is-post-details')?.innerText ||
      document.querySelector('.job-details')?.innerText ||
      document.querySelector('.card-content')?.innerText ||
      document.body.innerText.substring(0, 2000);

    return {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      url: window.location.href,
    };
  } catch (error) {
    console.error('Error extracting Bayt job:', error);
    return null;
  }
}

function extractNaukriJob() {
  try {
    const title = document.querySelector('.jd-header-title')?.textContent || document.querySelector('h1')?.textContent || 'Job Title';
    const company = document.querySelector('.jd-header-comp-name')?.textContent || 'Company';
    const description =
      document.querySelector('.job-desc')?.innerText ||
      document.querySelector('.job-description-details')?.innerText ||
      document.body.innerText.substring(0, 2000);

    return {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      url: window.location.href,
    };
  } catch (error) {
    console.error('Error extracting Naukri job:', error);
    return null;
  }
}


// Function to inject the floating character
function injectFloatingCharacter() {
  if (document.getElementById('career-ai-overlay')) return;

  const iframe = document.createElement('iframe');
  iframe.id = 'career-ai-overlay';
  iframe.src = CONFIG.BASE_URL + CONFIG.OVERLAY_PATH;
  iframe.allow = 'display-capture; microphone';
  iframe.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 450px;
    height: 700px;
    border: none;
    z-index: 2147483647;
    background: transparent !important;
    pointer-events: none;
  `;
  
  // Allow pointer events for the character specifically
  iframe.onload = () => {
    iframe.style.pointerEvents = 'auto';
  };

  document.body.appendChild(iframe);
}

// Automatically inject on supported job boards
const jobBoardDomains = [
  'linkedin.com',
  'indeed.com',
  'glassdoor.com',
  'lever.co',
  'greenhouse.io',
  'angel.co',
  'bayt.com',
  'naukri.com',
];

if (jobBoardDomains.some(domain => window.location.hostname.includes(domain))) {
  injectFloatingCharacter();
}
