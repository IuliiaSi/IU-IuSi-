import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

const COOLDOWN_MS = 3000;

@Injectable()
export class AnalysisCooldownService {
  private readonly lastActionAt = new Map<string, number>();

  enforceCooldown(actorKey: string) {
    const now = Date.now();
    const previous = this.lastActionAt.get(actorKey);

    if (typeof previous === 'number' && now - previous < COOLDOWN_MS) {
      throw new HttpException('Подождите немного', HttpStatus.TOO_MANY_REQUESTS);
    }

    this.lastActionAt.set(actorKey, now);
  }
}
