import '@testing-library/jest-dom';
import Header from './Header';
import { render, screen } from '@testing-library/react';
import { Saksbehandler } from '../../types/Saksbehandler';

describe('Header', () => {
    it('renders a header with ', () => {
        const saksbehandlerMock: Saksbehandler = {
            navIdent: 'MockBruker',
            brukernavn: 'mockbruker',
            epost: 'mockepost',
            roller: [],
        };
        render(<Header innloggetSaksbehandler={saksbehandlerMock} />);
        const saksbehandlersBrukernavn = screen.getByText(saksbehandlerMock.navIdent);
        expect(saksbehandlersBrukernavn).toBeInTheDocument();
    });
});
