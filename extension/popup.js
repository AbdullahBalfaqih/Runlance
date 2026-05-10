// Popup script for Career AI extension
const API_BASE_URL = CONFIG.BASE_URL + CONFIG.API_PATH;

document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('content');

  try {
    // Get the current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Fetch job data from content script
    chrome.tabs.sendMessage(tab.id, { action: 'getJobData' }, (response) => {
      if (response && response.jobData) {
        displayJobAnalysis(response.jobData, content);
      } else {
        content.innerHTML =
          '<div style="padding: 20px; text-align: center;"><p style="font-size: 13px; color: #6b7280;">No job posting detected on this page.</p></div>';
      }
    });
  } catch (error) {
    console.error('Error:', error);
    content.innerHTML =
      '<div class="error">Error loading job data. Please try again.</div>';
  }
});

function displayJobAnalysis(jobData, container) {
  // Get user preferences from storage
  chrome.storage.local.get(['personaId', 'apiToken'], async (data) => {
    if (!data.personaId) {
      container.innerHTML =
        '<div style="padding: 20px; text-align: center;"><p style="font-size: 13px; color: #6b7280;">Please log in to Career AI first</p><button class="button button-primary" onclick="openLogin()">Open Dashboard</button></div>';
      return;
    }

    try {
      // Call analyze-job API
      const response = await fetch(`${API_BASE_URL}/analyze-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': data.personaId,
        },
        body: JSON.stringify({
          personaId: data.personaId,
          jobTitle: jobData.title,
          companyName: jobData.company,
          jobDescription: jobData.description,
          jobUrl: jobData.url,
          extractedFromDom: true,
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const analysis = await response.json();
      displayResults(analysis, container, jobData);
    } catch (error) {
      console.error('Error analyzing job:', error);
      container.innerHTML =
        '<div class="error">Error analyzing job. Please try again.</div>';
    }
  });
}

function displayResults(analysis, container, jobData) {
  const score = analysis.compatibilityScore || 0;
  const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  container.innerHTML = `
    <div class="status">
      <div class="status-dot"></div>
      Analysis complete
    </div>

    <div class="job-info">
      <div class="job-title">${jobData.title}</div>
      <div class="job-company">${jobData.company || 'Company'}</div>
      <div class="score-container">
        <div class="score-label">Match Score</div>
        <div class="score" style="color: ${scoreColor};">${score}%</div>
      </div>
    </div>

    <div style="background: #f3f4f6; border-radius: 8px; padding: 12px; margin-bottom: 12px; font-size: 12px;">
      <div style="font-weight: 600; color: #000; margin-bottom: 6px;">Quick Summary</div>
      <div style="color: #6b7280;">
        <p>${analysis.analysisDetails?.summary || 'Analysis summary will appear here'}</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
      <div style="background: #f3f4f6; border-radius: 6px; padding: 10px; font-size: 12px;">
        <div style="font-weight: 600; color: #000; margin-bottom: 4px;">Matching Skills</div>
        <div style="color: #6b7280; font-size: 11px;">${(analysis.matchingSkills || []).length} skills match</div>
      </div>
      <div style="background: #f3f4f6; border-radius: 6px; padding: 10px; font-size: 12px;">
        <div style="font-weight: 600; color: #000; margin-bottom: 4px;">Skill Gaps</div>
        <div style="color: #6b7280; font-size: 11px;">${Object.keys(analysis.skillGaps || {}).length} to develop</div>
      </div>
    </div>

    <button class="button button-primary" onclick="openFullAnalysis('${analysis.id}')">
      View Full Analysis
    </button>
    <button class="button button-secondary" onclick="saveLater('${jobData.url}')">
      Save for Later
    </button>
  `;
}

function openFullAnalysis(analysisId) {
  chrome.tabs.create({
    url: `${CONFIG.BASE_URL}${CONFIG.DASHBOARD_PATH}/analyses?id=${analysisId}`,
  });
}

function saveLater(jobUrl) {
  chrome.storage.local.get(['savedJobs'], (data) => {
    const savedJobs = data.savedJobs || [];
    savedJobs.push({
      url: jobUrl,
      savedAt: new Date().toISOString(),
    });
    chrome.storage.local.set({ savedJobs });
    alert('Job saved for later!');
  });
}

function openLogin() {
  chrome.tabs.create({ url: `${CONFIG.BASE_URL}${CONFIG.DASHBOARD_PATH}` });
}
