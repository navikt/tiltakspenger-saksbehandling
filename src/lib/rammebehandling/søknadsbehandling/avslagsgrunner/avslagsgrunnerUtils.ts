import { Avslagsgrunn, Søknadsbehandling } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { erAvsluttet } from '~/lib/rammebehandling/rammebehandlingUtils';
import { SakProps } from '~/lib/sak/SakTyper';
import { perioderOverlapper } from '~/utils/periode';

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
 * Vedtaksbrevet oppgir periode og vedtaksdato for den tidligere innvilgelsen bare når søknadsperioden overlapper nøyaktig én innvilgelse.
 * Overlapper den flere, må saksbehandler skrive dette i teksten til vedtaksbrevet.
 * Tellingen speiler gjeldendeInnvilgelseForPeriode i backend, som bruker de samme elementene i innvilgetTidslinje.
 * Varselet gjelder bare pågående behandlinger.
 * For en avsluttet behandling er brevet allerede sendt, og dagens tidslinje kan være endret av senere vedtak.
 */
export const skalVarsleOmFlereTidligereInnvilgelser = (
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

    const overlappendeInnvilgelser = sak.innvilgetTidslinje.elementer.filter((element) =>
        perioderOverlapper(element.periode, søknadsperiode),
    );

    return overlappendeInnvilgelser.length > 1;
};
