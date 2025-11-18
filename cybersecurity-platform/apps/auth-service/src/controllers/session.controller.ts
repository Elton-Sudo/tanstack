import { CurrentUser } from '@app/common';
import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionService } from '../services/session.service';

@ApiTags('sessions')
@ApiBearerAuth()
@Controller('auth/sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiOperation({ summary: 'List active sessions' })
  async getSessions(@CurrentUser('id') userId: string) {
    return this.sessionService.getUserSessions(userId);
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current session info' })
  async getCurrentSession(@CurrentUser('id') userId: string) {
    return this.sessionService.getCurrentSession(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke specific session' })
  async revokeSession(@CurrentUser('id') userId: string, @Param('id') sessionId: string) {
    return this.sessionService.revokeSession(userId, sessionId);
  }

  @Delete()
  @ApiOperation({ summary: 'Revoke all sessions' })
  async revokeAllSessions(@CurrentUser('id') userId: string) {
    return this.sessionService.revokeAllSessions(userId);
  }
}
