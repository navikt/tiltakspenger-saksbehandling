import { Heading, HStack, InlineMessage, VStack } from '@navikt/ds-react';
import { useSak } from '~/lib/sak/SakContext';
import { DetaljVertikal } from '~/lib/_felles/detaljer/DetaljVertikal';
import { MeldekortbehandlingStatusTags } from '~/lib/meldekort/meldekortbehandling/header/behandling-status/MeldekortbehandlingStatusTags';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { formaterMeldeperiode, formaterPeriode, formaterTidspunktKort } from '~/utils/date';
import { meldeperiodebehandlingTypeTekst } from '~/lib/meldekort/utils/tekster';
import { hentMeldekortbehandling } from '~/lib/sak/sakUtils';
import { classNames } from '~/utils/classNames';

import style from './ApenMeldekortbehandlingOppsummering.module.css';

type Props = {
    className?: string;
};

export const ApenMeldekortbehandlingOppsummering = ({ className }: Props) => {
    const { sak } = useSak();
    const { saksnummer, åpenMeldekortbehandlingId } = sak;

    if (!åpenMeldekortbehandlingId) {
        return null;
    }

    const meldekortbehandling = hentMeldekortbehandling(sak, åpenMeldekortbehandlingId);

    const { id, periode, saksbehandler, beslutter, opprettet, meldeperioder } = meldekortbehandling;

    return (
        <VStack gap={'space-16'} className={classNames(className, style.outer)}>
            <HStack gap={'space-16'} justify={'space-between'} align={'center'} wrap={true}>
                <InlineMessage status={'info'}>
                    <Heading level={'3'} size={'small'}>
                        {'Åpen meldekortbehandling'}
                    </Heading>
                </InlineMessage>

                <MeldekortbehandlingStatusTags meldekortbehandling={meldekortbehandling} />
            </HStack>

            <InternLenke href={meldekortbehandlingUrl(saksnummer, id)} className={style.lenke}>
                {'Til behandlingen'}
            </InternLenke>

            <div className={style.metadataGrid}>
                <DetaljVertikal navn={'Totalperiode'}>{formaterPeriode(periode)}</DetaljVertikal>
                <DetaljVertikal navn={'Opprettet'}>
                    {formaterTidspunktKort(opprettet)}
                </DetaljVertikal>
                <DetaljVertikal navn={'Saksbehandler'}>{saksbehandler ?? '-'}</DetaljVertikal>
                <DetaljVertikal navn={'Beslutter'}>{beslutter ?? '-'}</DetaljVertikal>
            </div>

            <DetaljVertikal navn={'Meldeperioder'}>
                <VStack as={'ul'} gap={'space-4'} className={style.meldeperiodeListe}>
                    {meldeperioder
                        .toSorted((a, b) => (a.periode.fraOgMed < b.periode.fraOgMed ? -1 : 1))
                        .map((meldeperiode) => (
                            <HStack
                                as={'li'}
                                key={meldeperiode.meldeperiodeId}
                                gap={'space-8'}
                                align={'center'}
                            >
                                {`${formaterMeldeperiode(meldeperiode.periode)} - ${meldeperiodebehandlingTypeTekst[meldeperiode.type]}`}
                            </HStack>
                        ))}
                </VStack>
            </DetaljVertikal>
        </VStack>
    );
};
