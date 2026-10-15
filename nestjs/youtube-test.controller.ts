import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'node:path';

/**
 * Coloque web/youtube-test.html em ./public/youtube-test.html
 * e ajuste o caminho abaixo à estrutura do seu projeto.
 */
@Controller()
export class YouTubeTestController {
  @Get('youtube-test')
  @Header('Cache-Control', 'no-store')
  serveTestPage(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'public', 'youtube-test.html'));
  }

  @Get('health')
  health() {
    return { ok: true, service: 'trezioplay-youtube-test' };
  }
}
