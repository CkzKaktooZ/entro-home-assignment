import { Body, Controller, Param, Post, Query } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GitHubRepoAccessRequestDto, GitHubRepoAccessResponseDto, GitHubRepoScanResponseDto, GitHubTokenValidateRequestDto } from './dto/github.dto'
import { GithubService } from './github.service'

@Controller('github')
@ApiTags('github')
class GithubController {
  constructor(private readonly service: GithubService) {}

  @Post('validate-token')
  @ApiBody({ type: GitHubTokenValidateRequestDto })
  async validateToken(@Body() body: GitHubTokenValidateRequestDto): Promise<any> {
    return this.service.validateToken(body.token)
  }

  @Post('check-repo-access')
  // @ApiBody({ type: GitHubRepoAccessRequestDto })
  @ApiResponse({ status: 200, type: GitHubRepoAccessResponseDto })
  async checkRepoAccess(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
    @Param('token') token: string,
  ): Promise<GitHubRepoAccessResponseDto> {
    return this.service.checkRepoAccess(token, owner, repo)
  }

  @Post('scan-repo')
  @ApiResponse({ status: 200, type: GitHubRepoScanResponseDto })
  async scanRepo(@Query('owner') owner: string, @Query('repo') repo: string, @Param('token') token: string): Promise<GitHubRepoScanResponseDto> {
    return this.service.scanRepo(owner, repo, token)
  }

  @Post('branches')
  @ApiBody({ type: GitHubRepoAccessRequestDto })
  @ApiResponse({ status: 200, type: GitHubRepoScanResponseDto })
  async getBranches(@Query('owner') owner: string, @Query('repo') repo: string, @Body() body: GitHubRepoAccessRequestDto) {
    return this.service.getBranches(owner, repo, body.token)
  }
}

export { GithubController }
