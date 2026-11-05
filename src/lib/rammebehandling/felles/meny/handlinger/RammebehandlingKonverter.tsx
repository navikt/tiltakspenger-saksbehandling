import { Button, Dialog, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { ArrowsSquarepathIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { Saksnummer } from '~/lib/sak/Saksnummer';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { Rammevedtak, VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import { Nullable } from '~/types/UtilTypes';
import { formaterDatotekst } from '~/utils/date';
import { personoversiktUrl } from '~/utils/urls';

/**
 * Typene en revurdering kan konverteres til.
 * Omgjøring konverteres alltid til en omgjøring uten valgt resultat, og resultatet velges i behandlingen etterpå.
 */
export type KonverterRevurderingTil =
    | RevurderingResultat.STANS
    | RevurderingResultat.INNVILGELSE
    | RevurderingResultat.FORLENGELSE
    | RevurderingResultat.OMGJØRING;

export const konverterRevurderingTilTekst: Record<KonverterRevurderingTil, string> = {
    [RevurderingResultat.STANS]: 'Stans',
    [RevurderingResultat.INNVILGELSE]: 'Innvilgelse',
    [RevurderingResultat.FORLENGELSE]: 'Forlengelse',
    [RevurderingResultat.OMGJØRING]: 'Omgjøring',
};

const tilType = (resultat: RevurderingResultat): KonverterRevurderingTil => {
    switch (resultat) {
        case RevurderingResultat.OMGJØRING:
        case RevurderingResultat.OMGJØRING_OPPHØR:
        case RevurderingResultat.OMGJØRING_IKKE_VALGT:
            return RevurderingResultat.OMGJØRING;
        default:
            return resultat;
    }
};

/**
 * Typene revurderingen kan konverteres til, altså alle bortsett fra den den allerede har.
 * Alle omgjøringsresultatene regnes som samme type.
 */
export const konverteringsalternativer = (
    resultat: RevurderingResultat,
): KonverterRevurderingTil[] => {
    const nåværende = tilType(resultat);
    return (Object.keys(konverterRevurderingTilTekst) as KonverterRevurderingTil[]).filter(
        (type) => type !== nåværende,
    );
};

type KonverterRevurderingBody = {
    revurderingType: KonverterRevurderingTil;
    rammevedtakIdSomForlenges: Nullable<VedtakId>;
};

type Props = {
    sakId: SakId;
    saksnummer: Saksnummer;
    behandlingId: RammebehandlingId;
    til: KonverterRevurderingTil;
    alleRammevedtak: Rammevedtak[];
    åpen: boolean;
    onClose: () => void;
    onSuccess: (oppdatertSak: SakProps) => void;
};

/**
 * Behandlingen finnes ikke lenger (404) eller er endret av noen andre (409), så et nytt forsøk vil aldri lykkes.
 */
const erTerminalFeil = (status?: number) => status === 404 || status === 409;

export const RammebehandlingKonverter = ({
    sakId,
    saksnummer,
    behandlingId,
    til,
    alleRammevedtak,
    åpen,
    onClose,
    onSuccess,
}: Props) => {
    const [valgtVedtakId, setValgtVedtakId] = useState<VedtakId | null>(null);

    const { trigger, error, isMutating, reset } = useFetchJsonFraApi<
        SakProps,
        KonverterRevurderingBody
    >(`/sak/${sakId}/behandling/${behandlingId}/konverter`, 'POST');

    const terminal = erTerminalFeil(error?.status);
    const erForlengelse = til === RevurderingResultat.FORLENGELSE;
    const forlengbareVedtak = alleRammevedtak.flatMap(({ id, gyldigeKommandoer }) =>
        gyldigeKommandoer.FORLENG
            ? [{ id, forlengesFraOgMed: gyldigeKommandoer.FORLENG.forlengesFraOgMed }]
            : [],
    );
    const typetekst = konverterRevurderingTilTekst[til].toLowerCase();

    // En terminal feil beholdes, slik at et nytt forsøk mot en behandling som er borte eller endret ikke tilbys.
    const lukk = () => {
        setValgtVedtakId(null);
        if (!terminal) {
            reset();
        }
        onClose();
    };

    const konverter = () => {
        trigger({
            revurderingType: til,
            rammevedtakIdSomForlenges: erForlengelse ? valgtVedtakId : null,
        }).then((oppdatertSak) => {
            if (oppdatertSak) {
                setValgtVedtakId(null);
                onSuccess(oppdatertSak);
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && !isMutating && lukk()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <Dialog.Title>{`Endre revurderingen til ${typetekst}?`}</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>
                    <VStack gap={'space-16'}>
                        {
                            'Resultatet du har fylt ut nullstilles. Begrunnelsen og fritekst til vedtaksbrevet beholdes slik de sist ble lagret, så lagre behandlingen først hvis du har endringer du vil ta vare på.'
                        }

                        {til === RevurderingResultat.OMGJØRING &&
                            'Du velger resultatet for omgjøringen i behandlingen etterpå.'}

                        {erForlengelse &&
                            (forlengbareVedtak.length > 0 ? (
                                <RadioGroup
                                    legend={'Hvilket vedtak skal forlenges?'}
                                    value={valgtVedtakId ?? ''}
                                    onChange={(vedtakId: VedtakId) => setValgtVedtakId(vedtakId)}
                                >
                                    {forlengbareVedtak.map((vedtak) => (
                                        <Radio key={vedtak.id} value={vedtak.id}>
                                            {`Forleng fra ${formaterDatotekst(vedtak.forlengesFraOgMed)}`}
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <Infokort variant={'info'} header={'Ingen vedtak kan forlenges'}>
                                    {
                                        'Saken har ingen vedtak som kan forlenges, så revurderingen kan ikke endres til forlengelse.'
                                    }
                                </Infokort>
                            ))}

                        {error && (
                            <Infokort
                                variant={'feil'}
                                header={'Kunne ikke endre revurderingen'}
                            >{`Feil: ${error.message} (kode ${error.status})`}</Infokort>
                        )}
                    </VStack>
                </Dialog.Body>

                <Dialog.Footer>
                    {terminal ? (
                        <InternLenke href={personoversiktUrl(saksnummer)} onClick={lukk}>
                            {'Gå til personoversikten'}
                        </InternLenke>
                    ) : (
                        <Button
                            variant={'primary'}
                            icon={<ArrowsSquarepathIcon aria-hidden />}
                            loading={isMutating}
                            disabled={erForlengelse && !valgtVedtakId}
                            onClick={konverter}
                        >
                            {`Endre til ${typetekst}`}
                        </Button>
                    )}

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'} disabled={isMutating}>
                            {terminal ? 'Lukk' : 'Avbryt'}
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
