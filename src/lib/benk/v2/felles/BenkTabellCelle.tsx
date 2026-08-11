import { BodyShort, CopyButton, HelpText, HStack, Table, Tag, VStack } from '@navikt/ds-react';
import { AkselColor } from '@navikt/ds-react/types/theme';
import { ReactNode } from 'react';
import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import {
    antallKalenderDagerUnnaDagensDato,
    formaterDatotekst,
    formaterMeldeperiodeKort,
    formaterPeriodeKort,
    formaterTidspunktKort,
} from '~/utils/date';
import { formatterBeløp } from '~/lib/_felles/utbetaling/beløp/beløpUtils';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { behandlingUrl, personoversiktUrl } from '~/utils/urls';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { RammebehandlingResultatTag } from '~/lib/rammebehandling/felles/resultat-tag/RammebehandlingResultatTag';
import { KlagebehandlingResultatTag } from '~/lib/klage/tags/KlagebehandlingResultatTag';
import { tilbakekrevingVenterStatusTekst } from '~/lib/tilbakekreving/tilbakekrevingTekster';
import { TilbakekrevingVentegrunn } from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { BenkV2Behandlingstype, BenkV2Ventestatus } from '../typer/felles';
import { BenkSøknadsbehandling } from '../typer/søknader';
import { BenkRevurdering } from '../typer/revurderinger';
import { BenkKlagebehandling } from '../typer/klage';
import { BenkBehandlingMeny } from './BenkBehandlingMeny';
import { kanFortsetteBenkRad } from '../utils/benkV2Utils';
import { totalPeriode } from '~/utils/periode';

/**
 * Datacellene som går igjen på tvers av fanene i benken.
 * Cellenes innhold og oppførsel defineres én gang her, slik at fanene ikke kommer ut av sync.
 */

const Fnr = ({ fnr, saksnummer }: { fnr: string; saksnummer: string }) => (
    <Table.HeaderCell scope={'row'}>
        <HStack align={'center'} gap={'space-4'} wrap={false}>
            <InternLenke href={personoversiktUrl(saksnummer)}>{fnr}</InternLenke>
            <CopyButton copyText={fnr} size={'small'} data-color={'accent'} />
        </HStack>
    </Table.HeaderCell>
);

type ResultatProps = {
    behandling: BenkSøknadsbehandling | BenkRevurdering | BenkKlagebehandling;
};

/** Resultatet vises som en tag når det er valgt, ellers '-' */
const Resultat = ({ behandling }: ResultatProps) => (
    <Table.DataCell>{resultatTag(behandling)}</Table.DataCell>
);

const resultatTag = ({ type, resultat }: ResultatProps['behandling']): ReactNode => {
    switch (type) {
        case BenkV2Behandlingstype.SØKNADSBEHANDLING:
        case BenkV2Behandlingstype.REVURDERING:
            return resultat ? (
                <RammebehandlingResultatTag resultat={resultat} size={'small'} />
            ) : (
                '-'
            );
        case BenkV2Behandlingstype.KLAGEBEHANDLING:
            return resultat ? (
                <KlagebehandlingResultatTag resultat={resultat} size={'small'} />
            ) : (
                '-'
            );
    }
};

const Ventestatus = ({
    ventestatus,
    erTilbakekreving = false,
}: {
    ventestatus: BenkV2Ventestatus;
    /** Tilbakekreving lagrer ventegrunnen som en enumnøkkel, ikke som fritekst */
    erTilbakekreving?: boolean;
}) => {
    const { erSattPåVent, begrunnelse, frist } = ventestatus;

    return (
        <Table.DataCell>
            {erSattPåVent ? (
                <HStack gap={'space-4'} align={'center'} wrap={false}>
                    <Tag data-color={finnTagColor(frist)} variant={'moderate'} size={'small'}>
                        {frist ? `Venter til ${formaterDatotekst(frist)}` : 'Venter'}
                    </Tag>
                    {begrunnelse && (
                        <HelpText>{begrunnelseTekst(begrunnelse, erTilbakekreving)}</HelpText>
                    )}
                </HStack>
            ) : (
                '-'
            )}
        </Table.DataCell>
    );
};

const begrunnelseTekst = (begrunnelse: string, erTilbakekreving: boolean): string => {
    if (erTilbakekreving && begrunnelse in tilbakekrevingVenterStatusTekst) {
        return tilbakekrevingVenterStatusTekst[begrunnelse as TilbakekrevingVentegrunn];
    }
    return begrunnelse;
};

const finnTagColor = (fristDato: Nullable<string>): AkselColor => {
    if (!fristDato) {
        return 'danger';
    }

    const antallDager = antallKalenderDagerUnnaDagensDato(fristDato);

    if (antallDager <= 0) {
        return 'danger';
    } else if (antallDager <= 3) {
        return 'warning';
    } else {
        return 'info';
    }
};

const Tidspunkt = ({ tidspunkt }: { tidspunkt: Nullable<string> }) => (
    <Table.DataCell align={'right'}>
        {tidspunkt ? formaterTidspunktKort(tidspunkt) : '-'}
    </Table.DataCell>
);

/** Saksbehandler- og beslutterkolonnene deler denne - tom ident betyr at ingen har tatt behandlingen */
const Tildelt = ({ ident }: { ident: Nullable<string> }) => (
    <Table.DataCell>{ident ?? 'Ikke tildelt'}</Table.DataCell>
);

const PeriodeCelle = ({ periode }: { periode: Periode }) => (
    <Table.DataCell align={'right'}>{formaterPeriodeKort(periode)}</Table.DataCell>
);

/**
 * Én meldeperiode vises direkte. Flere vises som totalperioden (første fraOgMed til
 * siste tilOgMed - listen er kronologisk) med antall, og en hjelpetekst lister alle.
 */
const Meldeperiode = ({ meldeperioder }: { meldeperioder: Periode[] }) => {
    if (meldeperioder.length === 0) {
        return <Table.DataCell align={'right'}>{'-'}</Table.DataCell>;
    }

    if (meldeperioder.length === 1) {
        return (
            <Table.DataCell align={'right'}>
                {formaterMeldeperiodeKort(meldeperioder[0])}
            </Table.DataCell>
        );
    }

    const periode = totalPeriode(meldeperioder);

    return (
        <Table.DataCell align={'right'}>
            <HStack gap={'space-4'} align={'center'} justify={'end'} wrap={false}>
                <span>{`${formaterPeriodeKort(periode)} (${meldeperioder.length} meldeperioder)`}</span>
                <HelpText>
                    <VStack gap={'space-4'} align={'start'}>
                        <BodyShort weight={'semibold'}>{'Meldeperioder:'}</BodyShort>
                        {meldeperioder.map((periode) => (
                            <span key={periode.fraOgMed}>{formaterMeldeperiodeKort(periode)}</span>
                        ))}
                    </VStack>
                </HelpText>
            </HStack>
        </Table.DataCell>
    );
};

const Beløp = ({ beløp }: { beløp: Nullable<number> }) => (
    <Table.DataCell align={'right'}>{beløp !== null ? formatterBeløp(beløp) : '-'}</Table.DataCell>
);

/** Lenke til behandlingen og menyen med handlingene den innloggede saksbehandleren kan gjøre */
const RammebehandlingHandlinger = ({
    behandling,
}: {
    behandling: BenkSøknadsbehandling | BenkRevurdering;
}) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    return (
        <Table.DataCell align={'right'}>
            <HStack gap={'space-8'} justify={'end'} align={'center'} wrap={false}>
                <InternLenkeKnapp
                    href={behandlingUrl({
                        saksnummer: behandling.saksnummer,
                        id: behandling.id,
                    })}
                >
                    {kanFortsetteBenkRad(behandling, innloggetSaksbehandler.navIdent)
                        ? 'Fortsett'
                        : 'Se behandling'}
                </InternLenkeKnapp>
                <BenkBehandlingMeny behandling={behandling} />
            </HStack>
        </Table.DataCell>
    );
};

export const BenkTabellCelle = {
    Fnr,
    Resultat,
    Ventestatus,
    Tidspunkt,
    Tildelt,
    Periode: PeriodeCelle,
    Meldeperiode,
    Beløp,
    RammebehandlingHandlinger,
};
