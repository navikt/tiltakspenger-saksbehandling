import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HarBarnFortroligAdresse from '../../../components/har-barn-fortrolig-adresse/HarBarnFortroligAdresse';
import { Barn } from '../../../types/Personalia';

test('skal vise at barn har fortrolig adresse', async () => {
    const mockBarn: Partial<Barn>[] = [
        { fortrolig: true, strengtFortrolig: false },
        { fortrolig: false, strengtFortrolig: false },
    ];

    render(<HarBarnFortroligAdresse barn={mockBarn as Barn[]} />);

    expect(screen.getByText('Barn har fortrolig adresse')).toBeVisible();
});

test('skal vise at barn har strengt fortrolig adresse', async () => {
    const mockBarn: Partial<Barn>[] = [
        { fortrolig: true, strengtFortrolig: false },
        { fortrolig: false, strengtFortrolig: true },
    ];

    render(<HarBarnFortroligAdresse barn={mockBarn as Barn[]} />);

    expect(screen.getByText('Barn har strengt fortrolig adresse')).toBeVisible();
});

test('skal ikke vise tag', async () => {
    const mockBarn: Partial<Barn>[] = [
        { fortrolig: false, strengtFortrolig: false },
        { fortrolig: false, strengtFortrolig: false },
    ];

    render(<HarBarnFortroligAdresse barn={mockBarn as Barn[]} />);

    const fortrolig = await screen.queryByText('Barn har fortrolig adresse');
    const strengtFortrolig = await screen.queryByText('Barn har strengt fortrolig adresse');

    expect(fortrolig).toBeNull();
    expect(strengtFortrolig).toBeNull();
});
