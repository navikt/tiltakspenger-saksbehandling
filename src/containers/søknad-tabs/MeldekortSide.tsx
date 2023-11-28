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
    const meldekortUker: MeldekortDag[] = [
        { dag: 'Mandag', dato: new Date('2023-11-13'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Tirsdag', dato: new Date('2023-11-14'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Onsdag', dato: new Date('2023-11-15'), status: MeldekortStatus.FRAVÆR_SYKT_BARN },
        { dag: 'Torsdag', dato: new Date('2023-11-16'), status: MeldekortStatus.FRAVÆR_SYKT_BARN },
        { dag: 'Fredag', dato: new Date('2023-11-17'), status: MeldekortStatus.DELTATT },
        { dag: 'Lørdag', dato: new Date('2023-11-18'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Søndag', dato: new Date('2023-11-19'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Mandag', dato: new Date('2023-11-20'), status: MeldekortStatus.DELTATT },
        { dag: 'Tirsdag', dato: new Date('2023-11-21'), status: MeldekortStatus.LØNN_FOR_TID_I_ARBEID },
        { dag: 'Onsdag', dato: new Date('2023-11-22'), status: MeldekortStatus.FRAVÆR_SYK },
        { dag: 'Torsdag', dato: new Date('2023-11-23'), status: MeldekortStatus.DELTATT },
        { dag: 'Fredag', dato: new Date('2023-11-24'), status: MeldekortStatus.DELTATT },
        { dag: 'Lørdag', dato: new Date('2023-11-25'), status: MeldekortStatus.IKKE_DELTATT },
        { dag: 'Søndag', dato: new Date('2023-11-26'), status: MeldekortStatus.IKKE_DELTATT },
    ];

    const [oppdatertMeldekortUker, setOppdaterMeldekortUker] = useState([...meldekortUker]);
    const [antallDagerIkkeDeltatt, settAntallDagerIkkeDeltatt] = useState<number>(0);

    useEffect(() => {
        beregnAntallDagerIkkeDeltatt(meldekortUker);
    });

    const handleOppdaterMeldekort = (index: number, nyStatus: MeldekortStatus, ukeNr: number) => {
        const oppdatertMeldekortUkerKopi = [...oppdatertMeldekortUker];
        if (ukeNr == 2) {
            oppdatertMeldekortUkerKopi[index + 7].status = nyStatus;
        } else {
            oppdatertMeldekortUkerKopi[index].status = nyStatus;
        }
        setOppdaterMeldekortUker(oppdatertMeldekortUkerKopi);
        beregnAntallDagerIkkeDeltatt(meldekortUker);
    };

    const beregnAntallDagerIkkeDeltatt = (meldekortUker: MeldekortDag[]) => {
        const antallDager1 = meldekortUker.filter(
            (dag: MeldekortDag) => dag.status === MeldekortStatus.IKKE_DELTATT
        ).length;

        settAntallDagerIkkeDeltatt(antallDager1);
    };

    const godkjennMeldekort = () => {
        setDisableUkeVisning(true);
    };

    return (
        <>
            <div className={disableUkeVisning ? styles.disableUkevisning : styles.ukevisning}>
                <div className={styles.uke1}>
                    <MeldekortUke
                        meldekortUke={oppdatertMeldekortUker.slice(0, 7)}
                        ukesnummer={1}
                        fom={1}
                        tom={7}
                        ukeNr={1}
                        handleOppdaterMeldekort={handleOppdaterMeldekort}
                    />
                </div>
                <div className={styles.uke2}>
                    <MeldekortUke
                        meldekortUke={oppdatertMeldekortUker.slice(7, 14)}
                        ukesnummer={2}
                        fom={8}
                        tom={14}
                        ukeNr={2}
                        handleOppdaterMeldekort={handleOppdaterMeldekort}
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
