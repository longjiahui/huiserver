export type Slice1Parameters<T extends Function> = T extends (
    d: any,
    ...rest: infer R
) => any
    ? R
    : any[]

export type SameKeyObject<T> = Partial<
    T extends object
        ? {
              [k in keyof T]:
                  | SameKeyObject<T[k]>
                  | string
                  | number
                  | boolean
                  | null
          } & {
              [k: string]: any
          }
        : T
>
export type SameKeyArrayObject<T extends any[] | undefined> = SameKeyObject<
    NonNullable<T>[number]
>

export {}
