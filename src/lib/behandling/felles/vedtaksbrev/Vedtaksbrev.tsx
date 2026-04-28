import { BodyLong } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/lib/behandling/felles/layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '~/lib/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { FritekstInput } from '~/lib/_felles/fritekst/FritekstInput';
import { VedtaksbrevForhåndsvisning } from './forhåndsvisning/VedtaksbrevForhåndsvisning';
import { ReactNode } from 'react';
import { BrevForhåndsvisningDTO } from '~/lib/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { ValideringResultat } from '~/types/Validering';
import { useBehandling } from '~/lib/behandling/context/BehandlingContext';
import { useBehandlingSkjema } from '~/lib/behandling/context/BehandlingSkjemaContext';

import style from './Vedtaksbrev.module.css';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';

type Props = {
    header: ReactNode;
    hjelpetekst?: ReactNode;
    validering: ValideringResultat;
    hentDto: () => BrevForhåndsvisningDTO;
    readonly?: boolean;
};

export const Vedtaksbrev = ({ header, hjelpetekst, validering, hentDto, readonly }: Props) => {
    const { behandling } = useBehandling();
    const { fritekstTilVedtaksbrev } = behandling;

    const { textAreas, erReadonly } = useBehandlingSkjema();

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                {header}
                <BodyLong size={'small'}>{'Teksten vises i vedtaksbrevet til bruker.'}</BodyLong>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Venstre className={style.brev}>
                <FritekstInput
                    label={'Tekst til vedtaksbrev'}
                    description={'Teksten vises i vedtaksbrevet til bruker.'}
                    defaultValue={fritekstTilVedtaksbrev ?? ''}
                    readOnly={readonly ?? erReadonly}
                    // TODO Gjorde lintingen strengere ved oppgradering til Next 16. Fikset bare åpenbare feil, denne burde undersøkes.
                    /* eslint-disable-next-line react-hooks/refs */
                    ref={textAreas.brevtekst.ref}
                />
                <VedtaksbrevForhåndsvisning
                    behandling={behandling}
                    hentDto={hentDto}
                    validering={validering}
                    readonly={
                        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING ||
                        behandling.status === Rammebehandlingsstatus.KLAR_TIL_BESLUTNING
                            ? !behandling.skalSendeVedtaksbrev
                            : (readonly ?? erReadonly)
                    }
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
