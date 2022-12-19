import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Personalia from '../../types/Personalia';
import PersonaliaHeader from './PersonaliaHeader';

describe('Barn', () => {
    it('skal vise fortrolig adresse', async () => {
        const mockBarn: Partial<Personalia>[] = [{ fortrolig: true }];
        const mockPersonalia: Partial<Personalia> = new Personalia({
            barn: mockBarn as Personalia[],
        });
        render(<PersonaliaHeader personalia={mockPersonalia as Personalia} />);
    });

    it('skal vise strengt fortrolig adresse', async () => {
        const mockBarn: Partial<Personalia>[] = [{ strengtFortrolig: true }];
        const mockPersonalia: Partial<Personalia> = new Personalia({
            barn: mockBarn as Personalia[],
        });
        render(<PersonaliaHeader personalia={mockPersonalia as Personalia} />);
    });

    it('skal vise både fortrolig adresse og strengt fortrolig adresse etikett', async () => {
        const mockBarn: Partial<Personalia>[] = [{ fortrolig: true }, { strengtFortrolig: true }];
        const mockPersonalia: Partial<Personalia> = new Personalia({
            barn: mockBarn as Personalia[],
        });
        render(<PersonaliaHeader personalia={mockPersonalia as Personalia} />);
    });
});
