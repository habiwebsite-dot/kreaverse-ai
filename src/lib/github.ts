import { Octokit } from '@octokit/rest';
import { env } from '@/lib/env';

export async function commitRepoFile(path: string, content: string, message: string) {
  if (!env.githubToken || !env.githubRepo) {
    throw new Error('GITHUB_NOT_CONFIGURED');
  }
  const [owner, repo] = env.githubRepo.split('/');
  const octokit = new Octokit({ auth: env.githubToken });

  let sha: string | undefined;
  try {
    const current = await octokit.repos.getContent({ owner, repo, path, ref: env.githubBranch });
    if (!Array.isArray(current.data) && 'sha' in current.data) {
      sha = current.data.sha;
    }
  } catch {
    sha = undefined;
  }

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha,
    branch: env.githubBranch,
  });
}
