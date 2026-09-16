/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Table } from '@navikt/ds-react';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { BehandlingsmenyValg } from '~/lib/behandling-felles/meny/BehandlingsmenyValg';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { personoversiktUrl } from '~/utils/urls';
import { BenkTabellCelle } from './BenkTabellCelle';
import {
    BenkBehandlingBase,
    BenkBehandlingstype,
    BenkPersonmarkører,
    BenkTilgangsvurdering,
    BenkTilgangsårsak,
} from '../typer/felles';

const ingenMarkører: BenkPersonmarkører = { skjermet: false, kode6: false, kode7: false };

const radMedTilgang: BenkBehandlingBase = {
    type: BenkBehandlingstype.TILBAKEKREVING,
    id: 'tilbakekreving_test',
    sakId: 'sak_test',
    fnr: ikkeSladdet('12345678901'),
    saksnummer: '20260000001',
    startet: '2026-01-01T10:00:00Z',
    sistEndret: '2026-01-02T10:00:00Z',
    saksbehandler: null,
    beslutter: null,
    erUnderkjent: false,
    ventestatus: {
        erSattPåVent: true,
        begrunnelse: ikkeSladdet('Venter på dokumentasjon'),
        frist: null,
    },
    tilgang: { vurdering: BenkTilgangsvurdering.HAR_TILGANG, grunn: null },
    personmarkører: ingenMarkører,
};

/** Slik backend sender en rad uten tilgang: fnr og ventebegrunnelse er allerede sladdet */
const radUtenTilgang = (
    grunn: { årsak: BenkTilgangsårsak; begrunnelse: string },
    personmarkører: BenkPersonmarkører = ingenMarkører,
): BenkBehandlingBase => ({
    ...radMedTilgang,
    fnr: sladdet,
    ventestatus: { ...radMedTilgang.ventestatus, begrunnelse: sladdet },
    tilgang: { vurdering: BenkTilgangsvurdering.HAR_IKKE_TILGANG, grunn },
    personmarkører,
});

const visRad = (
    behandling: BenkBehandlingBase,
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[] = [],
) =>
    render(
        <Table>
            <Table.Body>
                <Table.Row>
                    <BenkTabellCelle.Fnr behandling={behandling} />
                    <BenkTabellCelle.Tilgang behandling={behandling} />
                    <BenkTabellCelle.Ventestatus behandling={behandling} />
                    <BenkTabellCelle.Handlinger behandling={behandling}>
                        <InternLenkeKnapp href={personoversiktUrl(behandling.saksnummer)}>
                            {'Åpne'}
                        </InternLenkeKnapp>
                        <BehandlingsmenyValg
                            gyldigeKommandoer={gyldigeKommandoer}
                            onVelg={jest.fn()}
                        />
                    </BenkTabellCelle.Handlinger>
                </Table.Row>
            </Table.Body>
        </Table>,
    );

test('rad uten tilgang viser grunnen og markørene, men ingen persondata eller handlinger', () => {
    visRad(
        radUtenTilgang(
            {
                årsak: BenkTilgangsårsak.SKJERMET,
                begrunnelse: 'Du har ikke tilgang til skjermede personer',
            },
            { skjermet: true, kode6: false, kode7: false },
        ),
        [SaksbehandlerBehandlingKommando.TildelSaksbehandler],
    );

    expect(screen.getByRole('list', { name: 'Tilgang og markeringer' })).toBeInTheDocument();
    expect(screen.getByText('Ingen tilgang')).toBeInTheDocument();
    expect(screen.getByText('Du har ikke tilgang til skjermede personer')).toBeInTheDocument();
    expect(screen.getByText('Skjermet')).toBeInTheDocument();
    expect(screen.getAllByText('[Sladdet]')).toHaveLength(2);
    expect(screen.queryByText('12345678901')).not.toBeInTheDocument();
    expect(screen.queryByText('Venter på dokumentasjon')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /kopier/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Åpne' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Meny' })).not.toBeInTheDocument();
});

test('rad med tilgang viser lenke, kopieringsknapp og handlinger', () => {
    visRad(radMedTilgang, [SaksbehandlerBehandlingKommando.TildelSaksbehandler]);

    expect(screen.getByRole('link', { name: '12345678901' })).toHaveAttribute(
        'href',
        personoversiktUrl(radMedTilgang.saksnummer),
    );
    expect(screen.getByRole('button', { name: /kopier/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Åpne' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Meny' })).toBeInTheDocument();
    expect(screen.getByText('Venter på dokumentasjon')).toBeInTheDocument();
});

test('rad med tilgang og uten markører viser ingen merkelapper', () => {
    visRad(radMedTilgang);

    expect(screen.queryByRole('list', { name: 'Tilgang og markeringer' })).not.toBeInTheDocument();
    expect(screen.queryByText('Ingen tilgang')).not.toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
});

test.each(
    [
        {
            markering: 'Strengt fortrolig adresse',
            årsak: BenkTilgangsårsak.STRENGT_FORTROLIG_ADRESSE,
            personmarkører: { skjermet: false, kode6: true, kode7: false },
        },
        {
            markering: 'Fortrolig adresse',
            årsak: BenkTilgangsårsak.FORTROLIG_ADRESSE,
            personmarkører: { skjermet: false, kode6: false, kode7: true },
        },
        {
            markering: 'Skjermet',
            årsak: BenkTilgangsårsak.SKJERMET,
            personmarkører: { skjermet: true, kode6: false, kode7: false },
        },
    ].flatMap((variant) => [true, false].map((harTilgang) => ({ ...variant, harTilgang }))),
)(
    '$markering vises med samme tekst når tilgangen er $harTilgang',
    ({ markering, årsak, personmarkører, harTilgang }) => {
        visRad(
            harTilgang
                ? { ...radMedTilgang, personmarkører }
                : radUtenTilgang(
                      { årsak, begrunnelse: 'Du har ikke tilgang til personen' },
                      personmarkører,
                  ),
            [SaksbehandlerBehandlingKommando.TildelSaksbehandler],
        );

        expect(screen.getByText(markering)).toBeInTheDocument();

        if (harTilgang) {
            expect(screen.queryByText('Ingen tilgang')).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: '12345678901' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Åpne' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Meny' })).toBeInTheDocument();
        } else {
            expect(screen.getByText('Ingen tilgang')).toBeInTheDocument();
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Åpne' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Meny' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /kopier/i })).not.toBeInTheDocument();
        }
    },
);

test('leserolle med sladdet fnr beholder lenken til personoversikten og får ingen meny', () => {
    visRad(
        {
            ...radMedTilgang,
            fnr: sladdet,
            ventestatus: { ...radMedTilgang.ventestatus, begrunnelse: sladdet },
        },
        [],
    );

    expect(screen.getByRole('link', { name: '[Sladdet]' })).toHaveAttribute(
        'href',
        personoversiktUrl(radMedTilgang.saksnummer),
    );
    expect(screen.getByRole('button', { name: 'Åpne' })).toHaveAttribute(
        'href',
        personoversiktUrl(radMedTilgang.saksnummer),
    );
    expect(screen.queryByRole('button', { name: /kopier/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Meny' })).not.toBeInTheDocument();
});
