import { createHash } from 'crypto';

export class RolloutService {
  // Hash determinístico para rollout percentual
  calculateRolloutPercentage(userId: string, flagKey: string): number {
    const input = `${flagKey}:${userId}`;
    const hash = createHash('sha256').update(input).digest('hex');

    // Usa os primeiros 8 caracteres do hash para calcular percentual
    const hashValue = parseInt(hash.substring(0, 8), 16);
    const percentage = (hashValue % 100) + 1; // 1-100

    return percentage;
  }

  shouldEnableForUser(userId: string, flagKey: string, rolloutPercentage: number): boolean {
    if (rolloutPercentage <= 0) {
      return false;
    }

    if (rolloutPercentage >= 100) {
      return true;
    }

    const userPercentage = this.calculateRolloutPercentage(userId, flagKey);
    return userPercentage <= rolloutPercentage;
  }
}
