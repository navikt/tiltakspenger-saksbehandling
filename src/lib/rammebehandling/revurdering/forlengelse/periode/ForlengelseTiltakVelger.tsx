import { BodyShort, Label, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useSak } from '~/lib/sak/SakContext';
import { formaterPeriode } from '~/utils/date';
import { InnvilgbarTiltaksperiode } from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import {
    hentForlengelseTiltaksdeltakelse,
    useForlengelseBehandling,
    useRevurderingForlengelseSkjema,
    useRevurderingForlengelseSkjemaDispatch,
} from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';

type Props = {
    tiltaksdeltakelser: InnvilgbarTiltaksperiode[];
};

export const ForlengelseTiltakVelger = ({ tiltaksdeltakelser }: Props) => {
    const { sak } = useSak();
    const behandling = useForlengelseBehandling();
    const skjema = useRevurderingForlengelseSkjema();
    const dispatch = useRevurderingForlengelseSkjemaDispatch();

    if (tiltaksdeltakelser.length === 0) {
        return (
            <Infokort variant={'advarsel'} size={'small'}>
                {'Ingen av tiltakene i vedtaket varer lenger enn vedtaket.'}
                {
                    ' Oppdater saksopplysningene dersom tiltaksdeltakelsen er forlenget, eller avbryt forlengelsen.'
                }
            </Infokort>
        );
    }

    if (tiltaksdeltakelser.length === 1) {
        return (
            <VStack gap={'space-4'}>
                <Label size={'small'}>{'Tiltak'}</Label>
                <BodyShort size={'small'}>{tiltakVisningsnavn(tiltaksdeltakelser[0])}</BodyShort>
            </VStack>
        );
    }

    return (
        <RadioGroup
            legend={'Hvilket tiltak skal vedtaket forlenges for?'}
            size={'small'}
            value={hentForlengelseTiltaksdeltakelse(skjema) ?? null}
            readOnly={skjema.erReadonly}
            onChange={(internDeltakelseId: string) => {
                dispatch({
                    type: 'settForlengelseTiltaksdeltakelse',
                    payload: { internDeltakelseId, behandling, sak },
                });
            }}
        >
            {tiltaksdeltakelser.map((tiltaksdeltakelse) => (
                <Radio
                    value={tiltaksdeltakelse.internDeltakelseId}
                    key={tiltaksdeltakelse.internDeltakelseId}
                >
                    {tiltakVisningsnavn(tiltaksdeltakelse)}
                </Radio>
            ))}
        </RadioGroup>
    );
};

const tiltakVisningsnavn = (tiltaksdeltakelse: InnvilgbarTiltaksperiode): string =>
    `${tiltaksdeltakelse.typeNavn} (${formaterPeriode(tiltaksdeltakelse.periode)})`;
