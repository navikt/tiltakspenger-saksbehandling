import { BodyLong, Heading, HStack } from '@navikt/ds-react';
import { CheckboxMedLabelTilVenstre } from '~/lib/_felles/checkbox/CheckboxMedLabelTilVenstre';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '~/lib/rammebehandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { FritekstInput } from '~/lib/_felles/fritekst/FritekstInput';
import { VedtaksbrevForhåndsvisning } from './forhåndsvisning/VedtaksbrevForhåndsvisning';
import { ReactNode } from 'react';
import { BrevForhåndsvisningDTO } from '~/lib/rammebehandling/felles/vedtaksbrev/forhåndsvisning/useHentVedtaksbrevForhåndsvisning';
import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { useBehandlingSkjema } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { useBehandlingSkjemaFellesDispatch } from '~/lib/rammebehandling/context/felles/behandlingSkjemaFellesContext';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';

import style from './RammebehandlingVedtaksbrev.module.css';

type Props = {
    tittel: string;
    hjelpetekst?: ReactNode;
    validering: ValideringResultat;
    hentDto: () => BrevForhåndsvisningDTO;
};

export const RammebehandlingVedtaksbrev = ({ tittel, hjelpetekst, validering, hentDto }: Props) => {
    const { behandling } = useBehandling();
    const { textAreas, erReadonly, skalSendeVedtaksbrev } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaFellesDispatch();

    const brevErReadonly = erReadonly || !skalSendeVedtaksbrev;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <HStack justify="space-between" align="center">
                    <Heading size={'xsmall'} level={'2'}>
                        {tittel}
                    </Heading>
                    <CheckboxMedLabelTilVenstre
                        size={'small'}
                        readOnly={erReadonly}
                        checked={!skalSendeVedtaksbrev}
                        onChange={(e) =>
                            dispatch({
                                type: 'setSkalSendeVedtaksbrev',
                                payload: { skalSendeVedtaksbrev: !e.target.checked },
                            })
                        }
                    >
                        {'Ikke send vedtaksbrev'}
                    </CheckboxMedLabelTilVenstre>
                </HStack>
                <BodyLong size={'small'}>{'Teksten vises i vedtaksbrevet til bruker.'}</BodyLong>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Venstre className={style.brev}>
                <FritekstInput
                    label={'Tekst til vedtaksbrev'}
                    description={'Teksten vises i vedtaksbrevet til bruker.'}
                    defaultValue={textAreas.brevtekst.getValue() ?? ''}
                    readOnly={brevErReadonly}
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
                            : brevErReadonly
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
