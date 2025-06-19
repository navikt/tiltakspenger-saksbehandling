type ReducerAction = {
    type: string;
    payload: Record<string, unknown>;
};

export type ReducerActionHandlers<State, Actions extends ReducerAction> = {
    [Type in Actions['type']]: (
        state: State,
        payload: Extract<Actions, { type: Type }>['payload'],
    ) => State;
};
