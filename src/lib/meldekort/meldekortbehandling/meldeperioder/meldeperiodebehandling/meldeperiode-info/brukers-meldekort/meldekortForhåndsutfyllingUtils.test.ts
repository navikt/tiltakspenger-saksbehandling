import { describe, expect, test } from '@jest/globals';
import { hentMeldekortForhåndsutfyllingFraBrukersMeldekort } from '~/lib/meldekort/meldekortbehandling/meldeperioder/meldeperiodebehandling/meldeperiode-info/brukers-meldekort/meldekortForhåndsutfyllingUtils';
import { BrukersMeldekortDagStatus } from '~/lib/meldekort/typer/BrukersMeldekort';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    FØRSTE_MANDAG,
    brukersMeldekort,
    erHelg,
    meldekortDager,
    meldeperiode,
} from '~test/meldekort';

const meldeperiodeMedRett = meldeperiode(FØRSTE_MANDAG);

describe('hentMeldekortForhåndsutfyllingFraBrukersMeldekort', () => {
    test.each([
        [
            BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET,
            MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
        ],
        [
            BrukersMeldekortDagStatus.DELTATT_MED_LØNN_I_TILTAKET,
            MeldekortbehandlingDagStatus.DeltattMedLønnITiltaket,
        ],
        [BrukersMeldekortDagStatus.FRAVÆR_SYK, MeldekortbehandlingDagStatus.FraværSyk],
        [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN, MeldekortbehandlingDagStatus.FraværSyktBarn],
        [
            BrukersMeldekortDagStatus.FRAVÆR_STERKE_VELFERDSGRUNNER_ELLER_JOBBINTERVJU,
            MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju,
        ],
        [
            BrukersMeldekortDagStatus.FRAVÆR_GODKJENT_AV_NAV,
            MeldekortbehandlingDagStatus.FraværGodkjentAvNav,
        ],
        [BrukersMeldekortDagStatus.FRAVÆR_ANNET, MeldekortbehandlingDagStatus.FraværAnnet],
        [BrukersMeldekortDagStatus.IKKE_TILTAKSDAG, MeldekortbehandlingDagStatus.IkkeTiltaksdag],
    ])('brukers %s fylles ut som %s på dager som gir rett', (brukersStatus, forventet) => {
        expect(
            hentMeldekortForhåndsutfyllingFraBrukersMeldekort(
                brukersMeldekort(FØRSTE_MANDAG, () => brukersStatus),
                meldeperiodeMedRett,
            ),
        ).toEqual(meldekortDager(FØRSTE_MANDAG, () => forventet));
    });

    test('dager bruker ikke har besvart fylles ut som ikke tiltaksdag', () => {
        expect(
            hentMeldekortForhåndsutfyllingFraBrukersMeldekort(
                brukersMeldekort(FØRSTE_MANDAG, () => BrukersMeldekortDagStatus.IKKE_BESVART),
                meldeperiodeMedRett,
            ),
        ).toEqual(meldekortDager(FØRSTE_MANDAG, () => MeldekortbehandlingDagStatus.IkkeTiltaksdag));
    });

    test('dager som ikke gir rett i siste meldeperiode blir ikke rett, uansett hva bruker har meldt', () => {
        const meldeperiodeUtenRettIHelgene = meldeperiode(FØRSTE_MANDAG, {
            girRett: (dato) => !erHelg(dato),
        });

        expect(
            hentMeldekortForhåndsutfyllingFraBrukersMeldekort(
                brukersMeldekort(
                    FØRSTE_MANDAG,
                    () => BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET,
                ),
                meldeperiodeUtenRettIHelgene,
            ),
        ).toEqual(
            meldekortDager(FØRSTE_MANDAG, (dato) =>
                erHelg(dato)
                    ? MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger
                    : MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
            ),
        );
    });

    test('dager som ikke ga rett da bruker meldte, men gir rett nå, må besvares av saksbehandler', () => {
        expect(
            hentMeldekortForhåndsutfyllingFraBrukersMeldekort(
                brukersMeldekort(FØRSTE_MANDAG, (dato) =>
                    erHelg(dato)
                        ? BrukersMeldekortDagStatus.IKKE_RETT_TIL_TILTAKSPENGER
                        : BrukersMeldekortDagStatus.FRAVÆR_SYK,
                ),
                meldeperiodeMedRett,
            ),
        ).toEqual(
            meldekortDager(FØRSTE_MANDAG, (dato) =>
                erHelg(dato)
                    ? MeldekortbehandlingDagStatus.IkkeBesvart
                    : MeldekortbehandlingDagStatus.FraværSyk,
            ),
        );
    });

    test('dager som mangler i meldeperioden regnes som ikke rett', () => {
        const meldekortMedEkstraDag = brukersMeldekort(
            FØRSTE_MANDAG,
            () => BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET,
        );
        meldekortMedEkstraDag.dager.push({
            dato: '2025-01-20',
            status: BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET,
        });

        expect(
            hentMeldekortForhåndsutfyllingFraBrukersMeldekort(
                meldekortMedEkstraDag,
                meldeperiodeMedRett,
            ).at(-1),
        ).toEqual({
            dato: '2025-01-20',
            status: MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger,
        });
    });
});
