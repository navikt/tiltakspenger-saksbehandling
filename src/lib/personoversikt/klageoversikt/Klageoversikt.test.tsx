/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import {
    AppRouterContext,
    AppRouterInstance,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NotificationProvider } from '~/lib/_felles/notifications/NotificationContext';
import { SakProvider } from '~/lib/sak/SakContext';
import { KlagebehandlingResultat, KlagebehandlingStatus } from '~/lib/klage/typer/Klage';
import { Klagevedtak } from '~/lib/klage/typer/Klagevedtak';
import { VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import { tilTidspunkt } from '~/types/DatoTid';
import { avvistResultat, klagebehandling } from '~test/klage';
import { sak } from '~test/rammebehandling';
import { Klageoversikt } from './Klageoversikt';

describe('Klageoversikt', () => {
    test('viser lenke med tekst til en avvist klage som har fått vedtak', () => {
        const avvistKlage = klagebehandling({
            status: KlagebehandlingStatus.VEDTATT,
            resultat: avvistResultat(),
            iverksattTidspunkt: tilTidspunkt('2025-04-02T10:00:00'),
        });
        const vedtak: Klagevedtak = {
            klagevedtakId: 'vedtak_klage_1' as VedtakId,
            klagebehandlingId: avvistKlage.id,
            sakId: avvistKlage.sakId,
            opprettet: tilTidspunkt('2025-04-02T10:00:00'),
            journalpostId: null,
            journalføringstidspunkt: null,
            distribusjonId: null,
            distribusjonstidspunkt: null,
            vedtaksdato: null,
            resultat: KlagebehandlingResultat.AVVIST,
        };

        render(
            <AppRouterContext.Provider value={{ push: jest.fn() } as unknown as AppRouterInstance}>
                <NotificationProvider>
                    <SakProvider
                        sak={sak({ klagebehandlinger: [avvistKlage], alleKlagevedtak: [vedtak] })}
                    >
                        <Klageoversikt />
                    </SakProvider>
                </NotificationProvider>
            </AppRouterContext.Provider>,
        );

        expect(screen.getByRole('button', { name: 'Se behandling' })).toBeInTheDocument();
    });
});
