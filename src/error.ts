export class DefaultError extends Error {
    messages: any[]
    constructor(...messages: any[]) {
        super(
            messages
                .map((m) => (typeof m === 'string' ? m : JSON.stringify(m)))
                .join(' ')
        )
        this.messages = messages
        this.name = 'DefaultError'
    }
}

export class ValidateError extends DefaultError {
    constructor(...rest: any[]) {
        super(...rest)
        this.name = 'ValidateError'
    }
}

export class AuthError extends DefaultError {
    constructor(...rest: any[]) {
        super(...rest)
        this.name = 'AuthError'
    }
}

export class ServiceError extends DefaultError {
    constructor(...rest: any[]) {
        super(...rest)
        this.name = 'ServiceError'
    }
}

export class UnExpectedError extends DefaultError {
    constructor(...rest: any[]) {
        super(...rest)
        this.name = 'UnExpectedError'
    }
}

export class FatalError extends DefaultError {
    constructor(...rest: any[]) {
        super(...rest)
        this.name = 'FatalError'
    }
}

export class AxiosError extends DefaultError {
    constructor(...rest: any[]) {
        super(...rest)
        this.name = 'AxiosError'
    }
}
