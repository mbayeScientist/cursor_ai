/**
 * Extracts owner and repo name from a GitHub URL
 * @param {string} githubUrl 
 * @returns {{ owner: string, repo: string }}
 */
function parseGithubUrl(githubUrl) {
  try {
    const url = new URL(githubUrl);
    const [, owner, repo] = url.pathname.split('/');
    return { owner, repo };
  } catch (error) {
    throw new Error('Invalid GitHub URL format');
  }
}

/**
 * Fetches README content from a GitHub repository
 * @param {string} githubUrl 
 * @returns {Promise<string>}
 */
export async function getReadmeContent(githubUrl) {
  try {
    const { owner, repo } = parseGithubUrl(githubUrl);
    
    // First, try to fetch the default README.md
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'GitHub-Readme-Fetcher'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch README');
    }

    const content = await response.text();
    return content;

  } catch (error) {
    console.error('Error fetching README:', error);
    throw new Error('Failed to fetch repository README');
  }
} 