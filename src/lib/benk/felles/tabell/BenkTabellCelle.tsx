import { BodyShort, CopyButton, HelpText, HStack, Tag, VStack } from '@navikt/ds-react';
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
import { BenkBehandling, BenkBehandlingstype, BenkTilgangsvurdering } from '../../typer/felles';
import { BenkSøknadsbehandlingMedTilgang } from '../../typer/søknader';
import { BenkRevurderingMedTilgang } from '../../typer/revurderinger';
import { BenkBehandlingMeny } from '../BenkBehandlingMeny';
import { BenkStatusTag, BenkKlageStatusTag, BenkTilbakekrevingStatusTag } from '../BenkStatusTag';
import { benkBehandlingHarTilgang, kanFortsetteBenkRad } from '../../utils/benkRad';
import { MeldeperioderTabellVisning } from '~/lib/meldekort/felles/meldeperioder/MeldeperioderTabellVisning';
import { BenkTildelCheckbox } from '../tildel-flere/BenkTildelCheckbox';
import { RichTooltip } from '~/lib/_felles/tooltip/RichTooltip';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

import style from './BenkTabellCelle.module.css';

type MedBehandling = { behandling: BenkBehandling };

/**
 * Innholdet i cellene som går igjen på tvers av fanene. Selve cellen (og justeringen)
 * lages av BenkTabell ut fra kolonnedefinisjonen - se benkKolonner.
 */

/** Backend sladder fnr på rader uten tilgang, så teksten kommer alltid fra `fnr` - uten lenke og kopiering */
const Fnr = ({ behandling }: MedBehandling) => {
    const fnrTekst = sladdbarTekst(behandling.fnr, '[Fnr sladdet]');

    return (
        <HStack align={'center'} gap={'space-4'} wrap={false}>
            {benkBehandlingHarTilgang(behandling) ? (
                <>
                    <InternLenke href={personoversiktUrl(hentVerdi(behandling.saksnummer))}>
                        {fnrTekst}
                    </InternLenke>
                    {!erSladdet(behandling.fnr) && (
                        <CopyButton copyText={fnrTekst} size={'small'} data-color={'accent'} />
                    )}
                </>
            ) : (
                fnrTekst
            )}
            <TilgangVarsel behandling={behandling} />
        </HStack>
    );
};

/**
 * Tilgang og personmarkører for raden, vist som helptekst i fnr-kolonnen.
 * Viser ingenting for en rad med tilgang og uten markører.
 */
const TilgangVarsel = ({ behandling }: MedBehandling) => {
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

/** Resultatet vises som en tag når det er valgt, ellers '-' */
const Resultat = ({ behandling }: MedBehandling): ReactNode => {
    switch (behandling.type) {
        case BenkBehandlingstype.SØKNADSBEHANDLING:
        case BenkBehandlingstype.REVURDERING:
            return behandling.resultat ? (
                <RammebehandlingResultatTag resultat={behandling.resultat} size={'small'} />
            ) : (
                '-'
            );
        case BenkBehandlingstype.KLAGEBEHANDLING:
            return behandling.resultat ? (
                <KlagebehandlingResultatTag resultat={behandling.resultat} size={'small'} />
            ) : (
                '-'
            );
        default:
            return '';
    }
};

/** Klage og tilbakekreving har egne flyter, og dermed egne statuser */
const Status = ({ behandling }: MedBehandling) => {
    switch (behandling.type) {
        case BenkBehandlingstype.KLAGEBEHANDLING:
            return <BenkKlageStatusTag status={behandling.status} />;
        case BenkBehandlingstype.TILBAKEKREVING:
            return <BenkTilbakekrevingStatusTag status={behandling.status} />;
        default:
            return (
                <BenkStatusTag status={behandling.status} erUnderkjent={behandling.erUnderkjent} />
            );
    }
};

const Ventestatus = ({
    behandling,
}: {
    behandling: Pick<BenkBehandling, 'ventestatus' | 'type'>;
}) => {
    const { erSattPåVent, begrunnelse, frist } = behandling.ventestatus;

    if (!erSattPåVent) {
        return '-';
    }

    // Tilbakekreving lagrer ventegrunnen som en enumnøkkel, ikke som fritekst
    const erTilbakekreving = behandling.type === BenkBehandlingstype.TILBAKEKREVING;
    const begrunnelseVisning = begrunnelseTekst(begrunnelse, erTilbakekreving);

    return (
        <HStack gap={'space-4'} align={'center'} wrap={false}>
            <Tag data-color={finnTagColor(frist)} variant={'moderate'} size={'small'}>
                {frist ? `Venter til ${formaterDatotekst(frist)}` : 'Venter'}
            </Tag>
            {begrunnelseVisning && <HelpText>{begrunnelseVisning}</HelpText>}
        </HStack>
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

const Tidspunkt = ({ tidspunkt }: { tidspunkt: Nullable<string> }) =>
    tidspunkt ? formaterTidspunktKort(tidspunkt) : '-';

/** Saksbehandler- og beslutterkolonnene deler denne - tom ident betyr at ingen har tatt behandlingen */
const Tildelt = ({ ident }: { ident: Nullable<string> }) => ident ?? 'Ikke tildelt';

const PeriodeCelle = ({ periode }: { periode: Periode }) => formaterPeriodeKort(periode);

const Meldeperiode = ({ meldeperioder }: { meldeperioder: Periode[] }) => (
    <MeldeperioderTabellVisning meldeperioder={meldeperioder} align={'end'} />
);

const Beløp = ({ beløp }: { beløp: Nullable<number> }) =>
    beløp !== null ? formatterBeløp(beløp) : '-';

/** Lenke til behandlingen og menyen med handlingene den innloggede saksbehandleren kan gjøre */
const RammebehandlingHandlinger = ({
    behandling,
}: {
    behandling: BenkSøknadsbehandlingMedTilgang | BenkRevurderingMedTilgang;
}) => {
    const { innloggetSaksbehandler } = useSaksbehandler();

    return (
        <HStack gap={'space-8'} justify={'end'} align={'center'} wrap={false}>
            <InternLenkeKnapp
                href={behandlingUrl({
                    saksnummer: hentVerdi(behandling.saksnummer),
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
    );
};

export const BenkTabellCelle = {
    Fnr,
    Resultat,
    Status,
    Ventestatus,
    Tidspunkt,
    Tildelt,
    Periode: PeriodeCelle,
    Meldeperiode,
    Beløp,
    RammebehandlingHandlinger,
};
