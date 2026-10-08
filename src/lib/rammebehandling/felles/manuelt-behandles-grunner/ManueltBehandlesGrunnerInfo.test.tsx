/** @jest-environment jsdom */
import { expect, test } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import { ManueltBehandlesGrunnerInfo } from './ManueltBehandlesGrunnerInfo';
import { ManueltBehandlesGrunn } from '~/lib/rammebehandling/typer/Rammebehandling';

test('viser grunnene til at en automatisk stans må behandles manuelt', () => {
    render(
        <ManueltBehandlesGrunnerInfo
            grunner={[
                ManueltBehandlesGrunn.STANS_SLUTTDATO_ER_IKKE_PASSERT,
                ManueltBehandlesGrunn.ANNET_APEN_BEHANDLING,
            ]}
        />,
    );

    expect(screen.getByText(/Kunne ikke behandle saken automatisk/)).toBeInTheDocument();
    expect(
        screen.getByText('Sluttdatoen for tiltaksdeltakelsen er ikke passert ennå'),
    ).toBeInTheDocument();
    expect(screen.getByText('Det finnes en annen åpen behandling på saken')).toBeInTheDocument();
});

test('viser ingenting når det ikke finnes grunner', () => {
    const { container } = render(<ManueltBehandlesGrunnerInfo grunner={[]} />);

    expect(container).toBeEmptyDOMElement();
});
