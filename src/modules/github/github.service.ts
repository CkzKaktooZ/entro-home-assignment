import { Injectable } from '@nestjs/common'
import { GitHubBranchesResponseDto, GitHubRepoAccessResponseDto, GitHubRepoScanResponseDto, GitHubTokenValidateResponseDto } from './dto/github.dto'

@Injectable()
class GithubService {
  //AWS SECRETS REGEX
  private readonly AWS_KEY_REGEX = /(?:AKIA|ASIA|AIDA|AROA)[A-Z2-7]{16}/g
  private readonly baseUrl = 'https://api.github.com'
  async validateToken(token: string): Promise<GitHubTokenValidateResponseDto> {
    if (!token) {
      return {
        valid: false,
        message: 'GitHub token is required',
      }
    }

    try {
      const requestData = {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
      const response = await fetch('https://api/github.com/user', requestData)

      if (response.ok) {
        const user = await response.json()
        return { valid: true, user: user.login }
      } else {
        return { valid: false, message: 'Invalid or expired token' }
      }
    } catch (error) {
      return { valid: false, message: 'Error connecting to GitHub API' }
    }
  }

  async checkRepoAccess(token: string, owner: string, repo: string): Promise<GitHubRepoAccessResponseDto> {
    const url = `${this.baseUrl}/${owner}/${repo}`

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })

      if (response.status === 200) {
        return { access: true, message: 'repo found. token has access.' }
      } else if (response.status === 404) {
        return { access: false, message: 'repo not found or no access.' }
      } else if (response.status === 403) {
        return { access: false, message: 'access denied. token lacks permissions.' }
      }

      return { access: false, message: `${response.statusText}` }
    } catch (error) {
      return { access: false, message: `${error.message}` }
    }
  }

  async scanRepo(owner: string, repo: string, token: string): Promise<GitHubRepoScanResponseDto> {
    console.log(`Scanning repo: ${owner}/${repo}...`)

    try {
      const files = await this.getRepoFiles(owner, repo, token)
      let foundSecrets: string[] = []

      for (const file of files) {
        console.log(`Scanning: ${file}`)
        const secrets = await this.scanFile(owner, repo, file, token)
        foundSecrets = foundSecrets.concat(secrets)
      }

      return {
        containsSecrets: foundSecrets.length > 0,
        foundSecrets,
      }
    } catch (error) {
      throw new Error(`GitHub scan failed: ${error.message}`)
    }
  }

  async getRepoFiles(owner: string, repo: string, token: string, path = ''): Promise<string[]> {
    const url = `${this.baseUrl}/${owner}/${repo}/contents/${path}`
    const response = await fetch(url, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch repository contents: ${response.statusText}`)
    }

    const data = await response.json()
    const files: string[] = []

    for (const item of data) {
      if (item.type === 'file') {
        files.push(item.path)
      } else if (item.type === 'dir') {
        const subFiles = await this.getRepoFiles(owner, repo, token, item.path)
        files.push(...subFiles)
      }
    }

    return files
  }

  async scanFile(owner: string, repo: string, filePath: string, token: string): Promise<string[]> {
    const url = `${this.baseUrl}/${owner}/${repo}/contents/${filePath}`
    const response = await fetch(url, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3.raw' },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch file ${filePath}: ${response.statusText}`)
    }

    const content = await response.text()
    const matches = content.match(this.AWS_KEY_REGEX)

    return matches ? matches.map(match => `${filePath}: ${match}`) : []
  }

  async getBranches(owner: string, repo: string, token: string): Promise<GitHubBranchesResponseDto> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/branches`
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      const data = await response.json()
      const branches: String[] = data.map((branch: { name: String }) => branch.name)
      return { branches }
    } catch (error) {
      throw new Error(`Failed to fetch branches. error: ${error.message}`)
    }
  }

  async getBranchCommits(owner: string, repo: string, token: string, branch: string) {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/branches`
  }
}

export { GithubService }
