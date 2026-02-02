export class FlagKey {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): FlagKey {
        if (!value || value.trim().length === 0) {
            throw new Error('FlagKey não pode ser vazio');
        }

        const cleanValue = value.trim().toLowerCase();

        // Validação: apenas letras, números, underscores e hífens
        if (!/^[a-z0-9_-]+$/.test(cleanValue)) {
            throw new Error('FlagKey deve conter apenas letras minúsculas, números, _ e -');
        }

        if (cleanValue.length < 3 || cleanValue.length > 100) {
            throw new Error('FlagKey deve ter entre 3 e 100 caracteres');
        }

        return new FlagKey(cleanValue);
    }

    toString(): string {
        return this.value;
    }

    equals(other: FlagKey): boolean {
        return this.value === other.value;
    }
}
