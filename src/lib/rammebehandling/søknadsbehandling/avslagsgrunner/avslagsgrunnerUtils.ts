import { Avslagsgrunn, Søknadsbehandling } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { erAvsluttet } from '~/lib/rammebehandling/rammebehandlingUtils';
import { SakProps } from '~/lib/sak/SakTyper';
import { perioderErLike } from '~/utils/periode';

/**
 * InnvilgetTiltakspenger skjules bak avslagInnvilgetTiltakspengerToggle til den er klar for prod.
 * En grunn som allerede er valgt vises likevel, slik at en lagret behandling viser det som faktisk er valgt.
 */
export const synligeAvslagsgrunner = (
    avslagInnvilgetTiltakspengerToggle: boolean,
    valgteAvslagsgrunner: Avslagsgrunn[],
): Avslagsgrunn[] =>
    Object.values(Avslagsgrunn).filter(
        (grunn) =>
            grunn !== Avslagsgrunn.InnvilgetTiltakspenger ||
            avslagInnvilgetTiltakspengerToggle ||
            valgteAvslagsgrunner.includes(grunn),
    );

/**
 * Vedtaksbrevet oppgir periode og vedtaksdato for den tidligere innvilgelsen bare når søknadsperioden er lik hele perioden i ett innvilget vedtak.
 * Er vedtaket stanset eller opphørt for en del av perioden, eller har det opphold, må saksbehandler skrive dette i teksten til vedtaksbrevet.
 * Det samme gjelder når søknaden dekker flere vedtak, bare delvis overlapper ett, eller når saken ikke har noen innvilgelse.
 * Sammenligningen speiler innvilgelseMedNøyaktigPeriode i backend.
 * Et omgjøringsvedtak kan både innvilge og opphøre dager, så vi sammenligner med hele vedtaksperioden, ikke bare den innvilgede delen.
 * Varselet gjelder bare pågående behandlinger.
 * For en avsluttet behandling er brevet allerede sendt, og dagens tidslinje kan være endret av senere vedtak.
 */
export const skalVarsleOmManglendeForhåndsutfylling = (
    sak: SakProps,
    behandling: Søknadsbehandling,
    avslagsgrunner: Avslagsgrunn[],
): boolean => {
    const søknadsperiode = behandling.søknad.tiltaksdeltakelseperiodeDetErSøktOm;

    if (
        erAvsluttet(behandling) ||
        !søknadsperiode ||
        !avslagsgrunner.includes(Avslagsgrunn.InnvilgetTiltakspenger)
    ) {
        return false;
    }

    return !sak.innvilgetTidslinje.elementer.some((element) => {
        const rammevedtak = sak.alleRammevedtak.find(
            (rammevedtak) => rammevedtak.id === element.rammevedtakId,
        );

        if (!rammevedtak) {
            return false;
        }

        return (
            perioderErLike(element.periode, søknadsperiode) &&
            perioderErLike(rammevedtak.opprinneligVedtaksperiode, søknadsperiode)
        );
    });
};
