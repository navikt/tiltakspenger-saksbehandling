import { Select } from '@navikt/ds-react';
import { HjemmelForStansOgOpphør } from '~/types/Revurdering';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

type Props = {
    label: string;
    valgteHjemler: HjemmelForStansOgOpphør[];
    onChange: (hjemler: HjemmelForStansOgOpphør[]) => void;
};

export const StansOgOpphørHjemmelVelger = ({ label, valgteHjemler, onChange }: Props) => {
    const { erReadonly } = useBehandlingSkjema();

    return (
        <Select
            label={label}
            size={'medium'}
            readOnly={erReadonly}
            defaultValue={valgteHjemler.at(0) ?? defaultOption}
            onChange={(event) => {
                const valg = event.target.value as HjemmelForStansOgOpphør | typeof defaultOption;
                onChange(valg ? [valg] : []);
            }}
        >
            <option value={defaultOption} disabled={true}>
                {'- Velg hjemmel -'}
            </option>
            {Object.entries(hjemler).map(([kode, beskrivelse]) => (
                <option key={kode} value={kode}>
                    {beskrivelse}
                </option>
            ))}
        </Select>
    );
};

const defaultOption = '';

const hjemler: Record<HjemmelForStansOgOpphør, string> = {
    [HjemmelForStansOgOpphør.DELTAR_IKKE_PÅ_ARBEIDSMARKEDSTILTAK]:
        'Ingen deltakelse - tiltakspengeforskriften § 2',
    [HjemmelForStansOgOpphør.ALDER]: 'Alder - tiltakspengeforskriften § 3',
    [HjemmelForStansOgOpphør.LIVSOPPHOLDYTELSER]:
        'Andre livsoppholdsytelser - tiltakspengeforskriften § 7, første ledd',
    [HjemmelForStansOgOpphør.KVALIFISERINGSPROGRAMMET]:
        'KVP - tiltakspengeforskriften § 7, tredje ledd',
    [HjemmelForStansOgOpphør.INTRODUKSJONSPROGRAMMET]:
        'Introduksjonsprogram - tiltakspengeforskriften § 7, tredje ledd',
    [HjemmelForStansOgOpphør.LØNN_FRA_TILTAKSARRANGØR]:
        'Lønn fra tiltaksarrangør - tiltakspengeforskriften § 8',
    [HjemmelForStansOgOpphør.LØNN_FRA_ANDRE]: 'Lønn fra andre - arbeidsmarkedsloven § 13',
    [HjemmelForStansOgOpphør.INSTITUSJONSOPPHOLD]: 'Institusjon - tiltakspengeforskriften § 9',
} as const;
