import { Checkbox, VStack } from '@navikt/ds-react';
import { FritekstInput } from '~/lib/_felles/fritekst/FritekstInput';
import { TextAreaInput } from '~/lib/_felles/fritekst/fritekstUtils';

type Props = {
    erPrioritert: boolean;
    onChange: (erPrioritert: boolean) => void;
    begrunnelse: TextAreaInput;
    readOnly: boolean;
};

export const PrioriteringValg = ({ erPrioritert, onChange, begrunnelse, readOnly }: Props) => {
    return (
        <VStack gap={'space-8'}>
            <Checkbox
                size={'small'}
                checked={erPrioritert}
                readOnly={readOnly}
                onChange={(e) => onChange(e.target.checked)}
                description={
                    'Kun for hastesaker. Disse vises alltid øverst i behandlingsoversikten.'
                }
            >
                {'Prioritert behandling'}
            </Checkbox>
            {erPrioritert && (
                <FritekstInput
                    label={'Begrunnelse for prioritering'}
                    hideLabel={false}
                    size={'small'}
                    minRows={2}
                    defaultValue={begrunnelse.getValue() ?? ''}
                    readOnly={readOnly}
                    ref={begrunnelse.ref}
                />
            )}
        </VStack>
    );
};
