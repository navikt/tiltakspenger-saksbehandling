import { BodyLong, Heading } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { FritekstInput } from '~/components/fritekst/FritekstInput';
import { VedtaksbrevForhåndsvisning } from './forhåndsvisning/VedtaksbrevForhåndsvisning';
import { ReactNode } from 'react';
import { BrevForhåndsvisningDTO } from '~/components/behandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { ValideringResultat } from '~/types/Validering';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './Vedtaksbrev.module.css';

type Props = {
    header: string;
    hjelpetekst?: ReactNode;
    validering: ValideringResultat;
    hentDto: () => BrevForhåndsvisningDTO;
};

export const Vedtaksbrev = ({ header, hjelpetekst, validering, hentDto }: Props) => {
    const { behandling } = useBehandling();
    const { fritekstTilVedtaksbrev } = behandling;

    const { textAreas, erReadonly } = useBehandlingSkjema();

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Heading size={'xsmall'} level={'2'}>
                    {header}
                </Heading>
                <BodyLong size={'small'}>{'Teksten vises i vedtaksbrevet til bruker.'}</BodyLong>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Venstre className={style.brev}>
                <FritekstInput
                    label={'Tekst til vedtaksbrev'}
                    description={'Teksten vises i vedtaksbrevet til bruker.'}
                    defaultValue={fritekstTilVedtaksbrev ?? ''}
                    readOnly={erReadonly}
                    ref={textAreas.brevtekst.ref}
                />
                <VedtaksbrevForhåndsvisning
                    behandling={behandling}
                    hentDto={hentDto}
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
