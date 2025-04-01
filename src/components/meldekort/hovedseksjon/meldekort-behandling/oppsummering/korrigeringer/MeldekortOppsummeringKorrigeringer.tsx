import { Alert, Link, VStack } from '@navikt/ds-react';
import { Fragment } from 'react';
import { meldeperiodeUrl } from '../../../../../../utils/urls';
import NextLink from 'next/link';
import { formaterTidspunktKort, periodeTilFormatertDatotekst } from '../../../../../../utils/date';
import { MeldekortOppsummeringUke } from '../MeldekortOppsummeringUke';
import { MeldeperiodeKorrigering } from '../../../../../../types/meldekort/MeldekortBehandling';
import { useSak } from '../../../../../../context/sak/SakContext';

import style from './MeldekortOppsummeringKorrigeringer.module.css';

type Props = {
    korrigeringer: MeldeperiodeKorrigering[];
};

export const MeldekortOppsummeringKorrigeringer = ({ korrigeringer }: Props) => {
    const { saksnummer } = useSak().sak;

    return (
        <VStack gap={'5'} className={style.korrigering}>
            {korrigeringer.map((korrigering) => (
                <Fragment key={korrigering.meldekortId}>
                    <Alert size={'small'} inline={true} variant={'info'}>
                        {'Korrigering av meldeperioden '}
                        <Link href={meldeperiodeUrl(saksnummer, korrigering.periode)} as={NextLink}>
                            {periodeTilFormatertDatotekst(korrigering.periode)}
                        </Link>
                        {` endret på beregningen av dette meldekortet. Korrigeringen ble iverksatt ${formaterTidspunktKort(korrigering.iverksatt)}`}
                    </Alert>
                    <MeldekortOppsummeringUke utbetalingUke={korrigering.dager.slice(0, 7)} />
                    <MeldekortOppsummeringUke utbetalingUke={korrigering.dager.slice(7, 14)} />
                </Fragment>
            ))}
        </VStack>
    );
};
