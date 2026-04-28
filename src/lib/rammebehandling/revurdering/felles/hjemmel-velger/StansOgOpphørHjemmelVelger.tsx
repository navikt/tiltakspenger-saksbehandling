import { Select } from '@navikt/ds-react';
import { HjemmelForOpphør, HjemmelForStans } from '~/types/Revurdering';
import { useBehandlingSkjema } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';

type HjemmelForStansEllerOpphør = HjemmelForStans | HjemmelForOpphør;

type Props<Hjemler extends HjemmelForStansEllerOpphør> = {
    label: string;
    aktuelleHjemler: Hjemler[];
    valgteHjemler: Hjemler[];
    onChange: (hjemler: Hjemler[]) => void;
};

export const StansOgOpphørHjemmelVelger = <Hjemler extends HjemmelForStansEllerOpphør>({
    label,
    aktuelleHjemler,
    valgteHjemler,
    onChange,
}: Props<Hjemler>) => {
    const { erReadonly } = useBehandlingSkjema();

    return (
        <Select
            label={label}
            size={'medium'}
            readOnly={erReadonly}
            defaultValue={valgteHjemler.at(0) ?? defaultOption}
            onChange={(event) => {
                const valg = event.target.value as Hjemler | typeof defaultOption;
                onChange(valg ? [valg] : []);
            }}
        >
            <option value={defaultOption} disabled={true}>
                {'- Velg hjemmel -'}
            </option>
            {aktuelleHjemler.map((hjemmel) => (
                <option key={hjemmel} value={hjemmel}>
                    {hjemmelBeskrivelser[hjemmel]}
                </option>
            ))}
        </Select>
    );
};

const defaultOption = '';

const hjemmelBeskrivelser: Record<HjemmelForStansEllerOpphør, string> = {
    DeltarIkkePåArbeidsmarkedstiltak: 'Ingen deltakelse - tiltakspengeforskriften § 2',
    Alder: 'Alder - tiltakspengeforskriften § 3',
    Livsoppholdytelser: 'Andre livsoppholdsytelser - tiltakspengeforskriften § 7, første ledd',
    Kvalifiseringsprogrammet: 'KVP - tiltakspengeforskriften § 7, tredje ledd',
    Introduksjonsprogrammet: 'Introduksjonsprogram - tiltakspengeforskriften § 7, tredje ledd',
    LønnFraTiltaksarrangør: 'Lønn fra tiltaksarrangør - tiltakspengeforskriften § 8',
    LønnFraAndre: 'Lønn fra andre - arbeidsmarkedsloven § 13',
    Institusjonsopphold: 'Institusjon - tiltakspengeforskriften § 9',
    IkkeLovligOpphold: 'Ikke lovlig opphold - arbeidsmarkedsloven § 2',
    FremmetForSent:
        'Fremmet for sent - tiltakspengeforskriften § 11, arbeidsmarkedsloven § 15 - frist',
} as const;
