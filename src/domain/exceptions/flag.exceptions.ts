import { DomainException } from './domain.exception';

export class FlagNotFoundException extends DomainException {
    constructor(identifier: string) {
        super(`Feature flag não encontrada: ${identifier}`, 'FLAG_NOT_FOUND');
    }
}

export class FlagAlreadyExistsException extends DomainException {
    constructor(key: string, environment: string) {
        super(
            `Feature flag '${key}' já existe no ambiente '${environment}'`,
            'FLAG_ALREADY_EXISTS',
        );
    }
}

export class FlagArchivedCannotBeModifiedException extends DomainException {
    constructor(key: string) {
        super(`Feature flag '${key}' está arquivada e não pode ser modificada`, 'FLAG_ARCHIVED');
    }
}

export class InvalidFlagConfigurationException extends DomainException {
    constructor(reason: string) {
        super(`Configuração de flag inválida: ${reason}`, 'INVALID_FLAG_CONFIGURATION');
    }
}
