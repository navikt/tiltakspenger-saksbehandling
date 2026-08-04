import { BodyShort, HelpText, HStack, Label, VStack } from '@navikt/ds-react';
import { Fragment } from 'react';
import { meldekortbehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';
import { hurtigtastTilDagStatus } from '~/lib/meldekort/meldekortbehandling/meldeperioder/meldeperiodebehandling/hurtigtaster/dagStatusHurtigtaster';

import style from './DagStatusHurtigtasterHelpText.module.css';

export const DagStatusHurtigtasterHelpText = () => (
    <HStack gap={'space-8'} align={'center'} className={style.tips}>
        <BodyShort size={'small'}>{'Hurtigtaster: '}</BodyShort>

        <HelpText title={'Hurtigtaster for statusvelgeren'}>
            <VStack gap={'space-8'}>
                <Label size={'small'}>{'Hurtigtaster'}</Label>

                <BodyShort size={'small'}>
                    {
                        'Når statusvelgeren for en dag har fokus, kan du velge status med disse tastene. Merk at hurtigtastene ikke virker mens nedtrekkslisten er åpen.'
                    }
                </BodyShort>

                <dl className={style.hurtigtaster}>
                    {Object.entries(hurtigtastTilDagStatus).map(([tast, status]) => (
                        <Fragment key={tast}>
                            <BodyShort size={'small'} weight={'semibold'} as={'dt'}>
                                {tast.toUpperCase()}
                            </BodyShort>
                            <BodyShort size={'small'} as={'dd'}>
                                {status && meldekortbehandlingDagStatusTekst[status]}
                            </BodyShort>
                        </Fragment>
                    ))}
                </dl>
            </VStack>
        </HelpText>
    </HStack>
);
