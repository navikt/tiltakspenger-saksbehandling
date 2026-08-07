import { Checkbox } from '@navikt/ds-react';

type Props = {
    checked: boolean;
    onChange: (checked: boolean) => void;
};

export const SkjulPåVentCheckbox = ({ checked, onChange }: Props) => (
    <Checkbox size={'small'} checked={checked} onChange={(e) => onChange(e.target.checked)}>
        {'Skjul behandlinger satt på vent'}
    </Checkbox>
);
