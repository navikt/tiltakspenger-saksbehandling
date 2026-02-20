import { Select } from '@navikt/ds-react';
import { HjemmelForStansEllerOpphør } from '~/types/Revurdering';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

type Props = {
    label: string;
    aktuelleHjemler: HjemmelForStansEllerOpphør[];
    valgteHjemler: HjemmelForStansEllerOpphør[];
    onChange: (hjemler: HjemmelForStansEllerOpphør[]) => void;
};

export const StansOgOpphørHjemmelVelger = ({
    label,
    aktuelleHjemler,
    valgteHjemler,
    onChange,
}: Props) => {
    const { erReadonly } = useBehandlingSkjema();

    return (
        <Select
            label={label}
            size={'medium'}
            readOnly={erReadonly}
            defaultValue={valgteHjemler.at(0) ?? defaultOption}
            onChange={(event) => {
                const valg = event.target.value as
                    | HjemmelForStansEllerOpphør
                    | typeof defaultOption;
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
    [HjemmelForStansEllerOpphør.DELTAR_IKKE_PÅ_ARBEIDSMARKEDSTILTAK]:
        'Ingen deltakelse - tiltakspengeforskriften § 2',
    [HjemmelForStansEllerOpphør.ALDER]: 'Alder - tiltakspengeforskriften § 3',
    [HjemmelForStansEllerOpphør.LIVSOPPHOLDYTELSER]:
        'Andre livsoppholdsytelser - tiltakspengeforskriften § 7, første ledd',
    [HjemmelForStansEllerOpphør.KVALIFISERINGSPROGRAMMET]:
        'KVP - tiltakspengeforskriften § 7, tredje ledd',
    [HjemmelForStansEllerOpphør.INTRODUKSJONSPROGRAMMET]:
        'Introduksjonsprogram - tiltakspengeforskriften § 7, tredje ledd',
    [HjemmelForStansEllerOpphør.LØNN_FRA_TILTAKSARRANGØR]:
        'Lønn fra tiltaksarrangør - tiltakspengeforskriften § 8',
    [HjemmelForStansEllerOpphør.LØNN_FRA_ANDRE]: 'Lønn fra andre - arbeidsmarkedsloven § 13',
    [HjemmelForStansEllerOpphør.INSTITUSJONSOPPHOLD]: 'Institusjon - tiltakspengeforskriften § 9',
    [HjemmelForStansEllerOpphør.IKKE_LOVLIG_OPPHOLD]:
        'Ikke lovlig opphold - arbeidsmarkedsloven § 2',
    [HjemmelForStansEllerOpphør.FREMMET_FOR_SENT]:
        'Fremmet for sent - tiltakspengeforskriften § 11, arbeidsmarkedsloven § 15 - frist',
} as const;
