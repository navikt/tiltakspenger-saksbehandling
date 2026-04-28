export type ReducerAction = {
    type: string;
    payload?: Record<string, unknown>;
};

export type ReducerSuperAction<Action extends ReducerAction, SuperType extends string> = {
    superType: SuperType;
} & Action;
