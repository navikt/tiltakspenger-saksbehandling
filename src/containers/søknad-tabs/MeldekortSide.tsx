import styles from './meldekort.module.css';
import { MeldekortUke } from '../meldekort-side/MeldekortUke';
import { MeldekortBeregningsvisning } from '../meldekort-side/MeldekortBeregningsVisning';
import { PencilWritingIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
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

    const handleOppdaterMeldekort1 = (index: number, nyStatus: any) => {
        console.log('nyStatus', nyStatus);
        console.log('index', index);
        const oppdatertMeldekortUkerKopi = [...meldekortUke1];
        oppdatertMeldekortUkerKopi[index].status = nyStatus;
        setOppdaterMeldekort1(oppdatertMeldekortUkerKopi);
    };
    const handleOppdaterMeldekort2 = (index: number, nyStatus: any) => {
        const oppdatertMeldekortUkerKopi = [...meldekortUke2];
        oppdatertMeldekortUkerKopi[index].status = nyStatus;
        setOppdaterMeldekort2(oppdatertMeldekortUkerKopi);
    };
    const beregnAntallDagerIkkeDeltatt = (meldekortUke1, meldekortUke2) => {
        const antallUke1 = meldekortUke1.reduce((countMap: { [x: string]: any }, meldekort: { status: any }) => {
            const status = meldekort.status;
            countMap[status] = (countMap[status] || 0) + 1;
            return countMap;
        });

        const antallUke2 = meldekortUke2.reduce((countMap: { [x: string]: any }, meldekort: { status: any }) => {
            const status = meldekort.status;
            countMap[status] = (countMap[status] || 0) + 1;
            return countMap;
        });
        console.log('antalluke1', antallUke1);
        return antallUke1 + antallUke2;
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
                    ></MeldekortUke>
                </div>
                <div className={styles.uke2}>
                    <MeldekortUke
                        meldekortUke={oppdatertMeldekort2}
                        ukesnummer={2}
                        fom={8}
                        tom={14}
                        handleOppdaterMeldekort={handleOppdaterMeldekort2}
                    ></MeldekortUke>
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
