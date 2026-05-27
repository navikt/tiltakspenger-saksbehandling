export type ReducerAction<
    Type extends string = string,
    Payload extends Record<string, unknown> = Record<string, unknown>,
> = {
    type: Type;
    payload: Payload;
};

export type ReducerSuperAction<Action extends ReducerAction, SuperType extends string> = {
    superType: SuperType;
} & Action;
