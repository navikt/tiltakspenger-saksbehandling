import { Button } from '@navikt/ds-react';
import { MeldeperiodeProps } from '../../../../types/MeldekortTypes';

type Props = {
    meldeperiode: MeldeperiodeProps;
};

export const MeldekortBehandlingOpprett = ({ meldeperiode }: Props) => {
    return (
        <Button onClick={() => console.log('Oppretter behandling')}>{'Opprett behandling'}</Button>
    );
};
