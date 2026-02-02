import { DomainException } from './domain.exception';

export class InvalidValueObjectException extends DomainException {
    constructor(valueObjectName: string, reason: string) {
        super(`${valueObjectName} inválido: ${reason}`, 'INVALID_VALUE_OBJECT');
    }
}
