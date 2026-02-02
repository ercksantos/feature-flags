export class UserId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new Error('UserId não pode ser vazio');
    }

    const cleanValue = value.trim();

    if (cleanValue.length > 255) {
      throw new Error('UserId não pode ter mais de 255 caracteres');
    }

    return new UserId(cleanValue);
  }

  toString(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
