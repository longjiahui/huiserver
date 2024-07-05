export const Code = {
    success: 0,
    error: -100,
    haveNotLoginYet: -1000,
    validateFailed: -1001,
    serviceFailed(code: number) {
        return Code.error + code
    },
}

export const success = <D>(data?: D) => {
    return {
        data,
        code: Code.success,
    }
}

export function fail(code: number, reason: string) {
    return {
        code: Code.error + code,
        reason,
    }
}

export function serviceFailed(reason: string, code?: number) {
    return fail(Code.serviceFailed(code ?? 0), reason)
}

export const defaultError = {
    code: Code.error,
    reason: '请联系管理员嗷 !~',
}

export const paginationData = <D>(data: D, total: number) => {
    return {
        data,
        total,
    }
}

export const notLoginError = (msg: string) =>
    serviceFailed(msg || '先登录嗷┗|｀O′|┛ 嗷~~', Code.haveNotLoginYet)

export const validateError = (msg: string) =>
    serviceFailed(msg || '参数错了嗷~', Code.validateFailed)
