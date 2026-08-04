import { BehandlingSaksopplysning } from '~/lib/rammebehandling/saksopplysninger/BehandlingSaksopplysning';
import { formaterSøknadsspørsmålSvar } from '~/utils/tekstformateringUtils';
import { formaterPeriode } from '~/utils/date';
import { PeriodeSpm } from '~/types/Søknad';

type Props = {
    navn: string;
    periodeSpm: PeriodeSpm;
    spacing?: boolean;
    visVarsel: boolean;
};

export const BehandlingSaksopplysningMedPeriodeSpm = ({
    navn,
    periodeSpm,
    spacing,
    visVarsel,
}: Props) => {
    const verdi =
        periodeSpm.periode && visVarsel
            ? `${formaterSøknadsspørsmålSvar(periodeSpm.svar)} (${formaterPeriode(periodeSpm.periode)})`
            : periodeSpm.svar;

    return (
        <BehandlingSaksopplysning
            navn={navn}
            verdi={verdi}
            spacing={spacing}
            visVarsel={visVarsel}
        />
    );
};
