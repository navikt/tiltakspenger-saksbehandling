import { BodyShort, CopyButton, HelpText, HStack, Table, Tag, VStack } from '@navikt/ds-react';
import { AkselColor } from '@navikt/ds-react/types/theme';
import { ReactNode } from 'react';
import { Nullable } from '~/types/UtilTypes';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { erSladdet, hentVerdi, sladdbarTekst } from '~/utils/sladdetVerdi';
import { Periode } from '~/types/Periode';
import {
    antallKalenderDagerUnnaDagensDato,
    formaterDatotekst,
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
import {
    BenkBehandlingBase,
    BenkBehandlingstype,
    BenkTilgangsvurdering,
    harTilgangTilBenkRad,
} from '../typer/felles';
import { BenkSøknadsbehandling } from '../typer/søknader';
import { BenkRevurdering } from '../typer/revurderinger';
import { BenkKlagebehandling } from '../typer/klage';
import { BenkBehandlingMeny } from './BenkBehandlingMeny';
import { useBenkVisning } from './filter/BenkVisningContext';
import { kanFortsetteBenkRad } from '../utils/benkUtils';
import { MeldeperioderTabellVisning } from '~/lib/meldekort/felles/meldeperioder/MeldeperioderTabellVisning';
import { BenkTildelCheckbox } from '~/lib/benk/felles/tildel-flere/BenkTildelCheckbox';
import { RichTooltip } from '~/lib/_felles/tooltip/RichTooltip';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

import style from './BenkTabellCelle.module.css';

/**
 * Datacellene som går igjen på tvers av fanene i benken.
 * Cellenes innhold og oppførsel defineres én gang her, slik at fanene ikke kommer i utakt.
 */

type BenkRadFellesfelt = Pick<
    BenkBehandlingBase,
    'fnr' | 'saksnummer' | 'ventestatus' | 'tilgang' | 'personmarkører'
>;

/** Backend sladder fnr på rader uten tilgang, så teksten kommer alltid fra `fnr` - uten lenke og kopiering */
const Fnr = ({ behandling }: { behandling: BenkRadFellesfelt }) => {
    const fnrTekst = sladdbarTekst(behandling.fnr, '[Fnr sladdet]');
    // Saksnummeret er sladdet på rader uten tilgang, og da finnes det ingen personoversikt å lenke til.
    const saksnummer = hentVerdi(behandling.saksnummer);

    return (
        <Table.HeaderCell scope={'row'}>
            <HStack align={'center'} gap={'space-4'} wrap={false}>
                {harTilgangTilBenkRad(behandling) && saksnummer !== null ? (
                    <>
                        <InternLenke href={personoversiktUrl(saksnummer)}>{fnrTekst}</InternLenke>
                        {!erSladdet(behandling.fnr) && (
                            <CopyButton copyText={fnrTekst} size={'small'} data-color={'accent'} />
                        )}
                    </>
                ) : (
                    fnrTekst
                )}
                <TilgangVarsel behandling={behandling} />
            </HStack>
        </Table.HeaderCell>
    );
};

/**
 * Tilgang og personmarkører for raden, vist som helptekst i fnr-kolonnen.
 * Viser ingenting for en rad med tilgang og uten markører.
 */
const TilgangVarsel = ({ behandling }: { behandling: BenkRadFellesfelt }) => {
    const { tilgang, personmarkører } = behandling;
    const harIkkeTilgang = tilgang.vurdering === BenkTilgangsvurdering.HAR_IKKE_TILGANG;

    const merkelapper = [
        harIkkeTilgang ? 'Ingen tilgang' : null,
        personmarkører.kode6 ? 'Strengt fortrolig adresse' : null,
        personmarkører.kode7 ? 'Fortrolig adresse' : null,
        personmarkører.skjermet ? 'Skjermet' : null,
    ].filter((merkelapp) => merkelapp !== null);

    if (merkelapper.length === 0) {
        return null;
    }

    return (
        <RichTooltip
            content={
                <VStack gap={'space-8'}>
                    <VStack as={'ul'} gap={'space-2'} className={style.statusliste}>
                        {merkelapper.map((merkelapp) => (
                            <li key={merkelapp}>
                                <Tag data-color={'danger'} variant={'outline'} size={'small'}>
                                    {merkelapp}
                                </Tag>
                            </li>
                        ))}
                    </VStack>
                    {harIkkeTilgang && (
                        <BodyShort size={'small'}>{tilgang.grunn.begrunnelse}</BodyShort>
                    )}
                </VStack>
            }
        >
            <ExclamationmarkTriangleFillIcon className={style.tilgangWarning} />
        </RichTooltip>
    );
};

type ResultatProps = {
    behandling: BenkSøknadsbehandling | BenkRevurdering | BenkKlagebehandling;
};

/** Resultatet vises som en tag når det er valgt, ellers '-' */
const Resultat = ({ behandling }: ResultatProps) => (
    <Table.DataCell>{resultatTag(behandling)}</Table.DataCell>
);

const resultatTag = ({ type, resultat }: ResultatProps['behandling']): ReactNode => {
    switch (type) {
        case BenkBehandlingstype.SØKNADSBEHANDLING:
        case BenkBehandlingstype.REVURDERING:
            return resultat ? (
                <RammebehandlingResultatTag resultat={resultat} size={'small'} />
            ) : (
                '-'
            );
        case BenkBehandlingstype.KLAGEBEHANDLING:
            return resultat ? (
                <KlagebehandlingResultatTag resultat={resultat} size={'small'} />
            ) : (
                '-'
            );
    }
};

/** Skjult når filteret skjuler behandlinger på vent - da har alle radene uansett samme verdi */
const Ventestatus = ({
    behandling,
    erTilbakekreving = false,
}: {
    behandling: Pick<BenkBehandlingBase, 'ventestatus'>;
    /** Tilbakekreving lagrer ventegrunnen som en enumnøkkel, ikke som fritekst */
    erTilbakekreving?: boolean;
}) => {
    const { skjulVentestatus } = useBenkVisning();
    const { erSattPåVent, begrunnelse, frist } = behandling.ventestatus;
    const begrunnelseVisning = begrunnelseTekst(begrunnelse, erTilbakekreving);

    if (skjulVentestatus) {
        return null;
    }

    return (
        <Table.DataCell>
            {erSattPåVent ? (
                <HStack gap={'space-4'} align={'center'} wrap={false}>
                    <Tag data-color={finnTagColor(frist)} variant={'moderate'} size={'small'}>
                        {frist ? `Venter til ${formaterDatotekst(frist)}` : 'Venter'}
                    </Tag>
                    {begrunnelseVisning && <HelpText>{begrunnelseVisning}</HelpText>}
                </HStack>
            ) : (
                '-'
            )}
        </Table.DataCell>
    );
};

const begrunnelseTekst = (
    begrunnelse: SladdbarVerdi<Nullable<string>>,
    erTilbakekreving: boolean,
): string => {
    if (erSladdet(begrunnelse)) {
        return sladdbarTekst(begrunnelse);
    }

    const verdi = begrunnelse.verdi ?? '';

    if (erTilbakekreving && verdi in tilbakekrevingVenterStatusTekst) {
        return tilbakekrevingVenterStatusTekst[verdi as TilbakekrevingVentegrunn];
    }

    return verdi;
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

const Meldeperiode = ({ meldeperioder }: { meldeperioder: Periode[] }) => (
    <Table.DataCell align={'right'}>
        <MeldeperioderTabellVisning meldeperioder={meldeperioder} align={'end'} />
    </Table.DataCell>
);

const Beløp = ({ beløp }: { beløp: Nullable<number> }) => (
    <Table.DataCell align={'right'}>{beløp !== null ? formatterBeløp(beløp) : '-'}</Table.DataCell>
);

const Handlinger = ({
    behandling,
    children,
}: {
    behandling: Pick<BenkBehandlingBase, 'tilgang'>;
    children: ReactNode;
}) => (
    <Table.DataCell align={'right'}>
        {harTilgangTilBenkRad(behandling) ? children : null}
    </Table.DataCell>
);

/** Lenke til behandlingen og menyen med handlingene den innloggede saksbehandleren kan gjøre */
const RammebehandlingHandlinger = ({
    behandling,
}: {
    behandling: BenkSøknadsbehandling | BenkRevurdering;
}) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    return (
        <Handlinger behandling={behandling}>
            <HStack gap={'space-8'} justify={'end'} align={'center'} wrap={false}>
                <InternLenkeKnapp
                    href={behandlingUrl({
                        saksnummer: hentVerdi(behandling.saksnummer) ?? '',
                        id: behandling.id,
                    })}
                >
                    {kanFortsetteBenkRad(behandling, innloggetSaksbehandler.navIdent)
                        ? 'Fortsett'
                        : 'Åpne'}
                </InternLenkeKnapp>
                <BenkBehandlingMeny behandling={behandling} />
                <BenkTildelCheckbox behandling={behandling} />
            </HStack>
        </Handlinger>
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
    Handlinger,
    RammebehandlingHandlinger,
};
