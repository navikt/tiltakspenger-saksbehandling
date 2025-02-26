import { Textarea } from '@navikt/ds-react';
import { ComponentProps, useCallback } from 'react';
import { mellomlagre } from './mellomlagring';

type MellomlagringProps<Body> = {
    url: string;
    tilBody: (tekst: string) => Body;
};

type Props<MellomlagringBody = unknown> = {
    label?: string;
    mellomlagring?: MellomlagringProps<MellomlagringBody>;
} & Omit<ComponentProps<typeof Textarea>, 'label'>;

export const Tekstfelt = ({ label = '', mellomlagring, onChange, ...textareaProps }: Props) => {
    const lagre = useCallback(
        mellomlagring ? mellomlagre({ url: mellomlagring.url }) : () => ({}),
        [mellomlagring],
    );

    console.log('what');

    return (
        <Textarea
            label={label}
            hideLabel={true}
            minRows={10}
            resize={'vertical'}
            onChange={(event) => {
                const verdi = event.target.value;
                lagre?.(verdi);
                onChange?.(event);
            }}
            {...textareaProps}
        />
    );
};
