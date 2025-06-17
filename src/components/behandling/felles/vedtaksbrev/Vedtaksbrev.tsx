import { BodyLong, Heading } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '../../vedtak-layout/hjelpetekst/VedtakHjelpetekst';
import { TekstfeltMedMellomlagring } from '../../../tekstfelt/TekstfeltMedMellomlagring';
import { VedtakBrevFritekstLagringDTO } from '~/types/VedtakTyper';
import { VedtaksbrevForhåndsvisning } from './forhåndsvisning/VedtaksbrevForhåndsvisning';
import { BehandlingData } from '~/types/BehandlingTypes';
import { Nullable } from '~/types/common';
import React, { ReactNode, RefObject } from 'react';
import { BrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { ValideringResultat } from '~/components/behandling/send-og-godkjenn/BehandlingSendTilBeslutning';

import style from './Vedtaksbrev.module.css';

type Props = {
    header: string;
    behandling: BehandlingData;
    rolle: Nullable<SaksbehandlerRolle>;
    tekstRef: RefObject<HTMLTextAreaElement>;
    hjelpetekst?: ReactNode;
    validering: ValideringResultat;
    forhåndsvisningDto: BrevForhåndsvisningDTO;
};

export const Vedtaksbrev = ({
    header,
    behandling,
    rolle,
    tekstRef,
    hjelpetekst,
    validering,
    forhåndsvisningDto,
}: Props) => {
    const { fritekstTilVedtaksbrev, sakId, id } = behandling;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Heading size={'xsmall'} level={'2'}>
                    {header}
                </Heading>
                <BodyLong size={'small'}>{'Teksten vises i vedtaksbrevet til bruker.'}</BodyLong>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Venstre className={style.brev}>
                <TekstfeltMedMellomlagring
                    label={'Tekst til vedtaksbrev'}
                    description={'Teksten vises i vedtaksbrevet til bruker.'}
                    defaultValue={fritekstTilVedtaksbrev ?? ''}
                    readOnly={rolle !== SaksbehandlerRolle.SAKSBEHANDLER}
                    lagringUrl={`/sak/${sakId}/behandling/${id}/fritekst`}
                    lagringBody={(tekst) =>
                        ({ fritekst: tekst }) satisfies VedtakBrevFritekstLagringDTO
                    }
                    minRows={10}
                    ref={tekstRef}
                />
                <VedtaksbrevForhåndsvisning
                    behandling={behandling}
                    dto={forhåndsvisningDto}
                    validering={validering}
                />
            </VedtakSeksjon.Venstre>
            {hjelpetekst && (
                <VedtakSeksjon.Høyre>
                    <VedtakHjelpetekst header={'Tekst i brev'}>{hjelpetekst}</VedtakHjelpetekst>
                </VedtakSeksjon.Høyre>
            )}
        </VedtakSeksjon>
    );
};
