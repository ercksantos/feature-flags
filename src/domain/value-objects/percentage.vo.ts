export class Percentage {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static create(value: number): Percentage {
        if (value < 0 || value > 100) {
            throw new Error('Percentage deve estar entre 0 e 100');
        }

        if (!Number.isFinite(value)) {
            throw new Error('Percentage deve ser um número válido');
        }

        return new Percentage(value);
    }

    getValue(): number {
        return this.value;
    }

    isZero(): boolean {
        return this.value === 0;
    }

    isFull(): boolean {
        return this.value === 100;
    }

    toString(): string {
        return `${this.value}%`;
    }
}
