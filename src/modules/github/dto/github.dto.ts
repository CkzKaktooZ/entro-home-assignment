import { ApiProperty } from '@nestjs/swagger'

class GitHubTokenValidateResponseDto {
  @ApiProperty()
  valid: boolean

  @ApiProperty()
  user?: string

  @ApiProperty()
  message?: string
}

class GitHubTokenValidateRequestDto {
  @ApiProperty()
  token: string
}

class GitHubRepoAccessRequestDto {
  @ApiProperty()
  token: string

  @ApiProperty()
  owner: string

  @ApiProperty()
  repo: string
}

class GitHubRepoAccessResponseDto {
  @ApiProperty()
  access: boolean

  @ApiProperty()
  message: string
}

class GitHubRepoScanResponseDto {
  @ApiProperty()
  containsSecrets: boolean

  @ApiProperty()
  foundSecrets?: string[]
}

class GitHubBranchesResponseDto {
  @ApiProperty()
  branches: String[]
}

export {
  GitHubBranchesResponseDto,
  GitHubRepoAccessRequestDto,
  GitHubRepoAccessResponseDto,
  GitHubRepoScanResponseDto,
  GitHubTokenValidateRequestDto,
  GitHubTokenValidateResponseDto,
}
