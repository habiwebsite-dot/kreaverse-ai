import { Octokit } from 'octokit'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const GITHUB_OWNER = process.env.GITHUB_OWNER || 'habiwebsite-dot'
const GITHUB_REPO = process.env.GITHUB_REPO || 'kreaverse-ai'

/**
 * Commit file to GitHub
 */
export async function commitFileToGithub(
  path: string,
  content: string,
  message: string
): Promise<any> {
  try {
    // Get current file SHA if exists
    let sha: string | undefined
    try {
      const file = await octokit.rest.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path,
      })
      if ('sha' in file.data) {
        sha = file.data.sha
      }
    } catch (e) {
      // File doesn't exist, that's ok
    }

    // Create or update file
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
    })

    return response.data
  } catch (error) {
    console.error('[GitHub Client] Commit failed:', error)
    throw error
  }
}

/**
 * Get file from GitHub
 */
export async function getFileFromGithub(path: string): Promise<string> {
  try {
    const response = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
    })

    if ('content' in response.data) {
      return Buffer.from(response.data.content, 'base64').toString('utf-8')
    }

    throw new Error('File not found')
  } catch (error) {
    console.error('[GitHub Client] Get file failed:', error)
    throw error
  }
}
