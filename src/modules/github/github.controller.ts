import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GitHubRepoAccessRequestDto, GitHubRepoAccessResponseDto, GitHubRepoScanResponseDto } from './dto/github.dto'
import { GithubService } from './github.service'

@Controller('github')
@ApiTags('github')
class GithubController {
  constructor(private readonly service: GithubService) {}

  // @Post('validate-token')
  // @ApiBody({ type: GitHubTokenValidateRequestDto })
  // async validateToken(@Body() body: GitHubTokenValidateRequestDto): Promise<GitHubTokenValidateResponseDto> {
  //   return this.service.validateToken(body.token)
  // }

  @Post('check-repo-access')
  @ApiBody({ type: GitHubRepoAccessRequestDto })
  @ApiResponse({ status: 200, type: GitHubRepoAccessResponseDto })
  async checkRepoAccess(@Body() body: GitHubRepoAccessRequestDto): Promise<GitHubRepoAccessResponseDto> {
    return this.service.checkRepoAccess(body.token, body.owner, body.repo)
  }

  @Post('scan-repo')
  @ApiBody({ type: GitHubRepoAccessRequestDto })
  @ApiResponse({ status: 200, type: GitHubRepoScanResponseDto })
  async scanRepo(@Body() body: GitHubRepoAccessRequestDto): Promise<GitHubRepoScanResponseDto> {
    return this.service.scanRepo(body.owner, body.repo, body.token)
  }
}

export { GithubController }
