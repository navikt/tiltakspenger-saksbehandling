import styles from './meldekort.module.css';
import { MeldekortUke } from '../meldekort-side/MeldekortUke';
import { MeldekortBeregningsvisning } from '../meldekort-side/MeldekortBeregningsVisning';
import { PencilWritingIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { MeldekortDag, MeldekortStatus } from '../../types/MeldekortTypes';

interface MeldekortSideProps extends React.PropsWithChildren {
    title?: string;
}

export const MeldekortSide = ({}: MeldekortSideProps) => {
    const [disableUkeVisning, setDisableUkeVisning] = useState<boolean>(false);
    const meldekortUke1: MeldekortDag[] = [
        { dag: 'Mandag', dato: new Date('2023-11-13'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Tirsdag', dato: new Date('2023-11-14'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Onsdag', dato: new Date('2023-11-15'), status: MeldekortStatus.FRAVÆR_SYKT_BARN },
        { dag: 'Torsdag', dato: new Date('2023-11-16'), status: MeldekortStatus.FRAVÆR_SYKT_BARN },
        { dag: 'Fredag', dato: new Date('2023-11-17'), status: MeldekortStatus.DELTATT },
        { dag: 'Lørdag', dato: new Date('2023-11-18'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Søndag', dato: new Date('2023-11-19'), status: MeldekortStatus.IKKE_DELTATT },
    ];
    const meldekortUke2: MeldekortDag[] = [
        { dag: 'Mandag', dato: new Date('2023-11-20'), status: MeldekortStatus.DELTATT },
        { dag: 'Tirsdag', dato: new Date('2023-11-21'), status: MeldekortStatus.LØNN_FOR_TID_I_ARBEID },
        { dag: 'Onsdag', dato: new Date('2023-11-22'), status: MeldekortStatus.FRAVÆR_SYK },
        { dag: 'Torsdag', dato: new Date('2023-11-23'), status: MeldekortStatus.DELTATT },
        { dag: 'Fredag', dato: new Date('2023-11-24'), status: MeldekortStatus.DELTATT },
        { dag: 'Lørdag', dato: new Date('2023-11-25'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Søndag', dato: new Date('2023-11-26'), status: MeldekortStatus.IKKE_DELTATT },
    ];

    const [oppdatertMeldekort1, setOppdaterMeldekort1] = useState([...meldekortUke1]);
    const [oppdatertMeldekort2, setOppdaterMeldekort2] = useState([...meldekortUke2]);
    const [antallDagerIkkeDeltatt, settAntallDagerIkkeDeltatt] = useState<number>(0);

    useEffect(() => {
        beregnAntallDagerIkkeDeltatt(oppdatertMeldekort1, oppdatertMeldekort2);
    });

    const handleOppdaterMeldekort1 = (index: number, nyStatus: MeldekortStatus) => {
        const oppdatertMeldekortUkerKopi = [...oppdatertMeldekort1];
        oppdatertMeldekortUkerKopi[index].status = nyStatus;
        setOppdaterMeldekort1(oppdatertMeldekortUkerKopi);
        beregnAntallDagerIkkeDeltatt(oppdatertMeldekort1, oppdatertMeldekort2);
    };
    const handleOppdaterMeldekort2 = (index: number, nyStatus: MeldekortStatus) => {
        const oppdatertMeldekortUkerKopi = [...oppdatertMeldekort2];
        oppdatertMeldekortUkerKopi[index].status = nyStatus;
        setOppdaterMeldekort2(oppdatertMeldekortUkerKopi);
        beregnAntallDagerIkkeDeltatt(oppdatertMeldekort1, oppdatertMeldekort2);
    };
    const beregnAntallDagerIkkeDeltatt = (meldekortUke1: MeldekortDag[], meldekortUke2: MeldekortDag[]) => {
        const antallDager1 = meldekortUke1.filter(
            (dag: MeldekortDag) => dag.status === MeldekortStatus.IKKE_DELTATT
        ).length;
        const antallDager2 = meldekortUke2.filter(
            (dag: MeldekortDag) => dag.status === MeldekortStatus.IKKE_DELTATT
        ).length;

        settAntallDagerIkkeDeltatt(antallDager1 + antallDager2);
    };

    const godkjennMeldekort = () => {
        setDisableUkeVisning(true);
    };

    return (
        <>
            <div className={disableUkeVisning ? styles.disableUkevisning : styles.ukevisning}>
                <div className={styles.uke1}>
                    <MeldekortUke
                        meldekortUke={oppdatertMeldekort1}
                        ukesnummer={1}
                        fom={1}
                        tom={7}
                        handleOppdaterMeldekort={handleOppdaterMeldekort1}
                    />
                </div>
                <div className={styles.uke2}>
                    <MeldekortUke
                        meldekortUke={oppdatertMeldekort2}
                        ukesnummer={2}
                        fom={8}
                        tom={14}
                        handleOppdaterMeldekort={handleOppdaterMeldekort2}
                    />
                </div>
            </div>

            <MeldekortBeregningsvisning antallDagerIkkeDeltatt={antallDagerIkkeDeltatt} />

            <div style={{ marginTop: '2rem', justifyItems: 'center', alignItems: 'center' }}>
                <Button
                    icon={<PencilWritingIcon />}
                    variant="tertiary"
                    size="small"
                    onClick={() => setDisableUkeVisning(false)}
                >
                    Endre meldekortperiode
                </Button>
                <Button size="small" style={{ marginLeft: '2rem' }} onClick={godkjennMeldekort}>
                    Godkjenn meldekortperiode
                </Button>
            </div>
        </>
    );
};
