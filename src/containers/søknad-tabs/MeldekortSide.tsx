import styles from './meldekort.module.css';
import { MeldekortUke } from '../meldekort-side/MeldekortUke';
import { MeldekortBeregningsvisning } from '../meldekort-side/MeldekortBeregningsVisning';
import { PencilWritingIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { MeldekortDag, MeldekortStatus } from '../../types/MeldekortTypes';

interface MeldekortSideProps extends React.PropsWithChildren {
    title?: string;
    behandlingId: string;
}

export const MeldekortSide = ({behandlingId}: MeldekortSideProps) => {
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
    const [antallDagerIkkeDeltatt, setAntallDagerIkkeDeltatt] = useState<number>(
        meldekortUker.filter((dag: MeldekortDag) => dag.status === MeldekortStatus.IKKE_DELTATT).length
    );
    const [antallDagerDeltatt, setAntallDagerDeltatt] = useState<number>(
        meldekortUker.filter((dag: MeldekortDag) => dag.status === MeldekortStatus.DELTATT).length
    );
    const [antallDagerSyk, setAntallDagerSyk] = useState<number>(
        meldekortUker.filter((dag: MeldekortDag) => dag.status === MeldekortStatus.FRAVÆR_SYK).length
    );
    const [antallDagerSyktBarn, setAntallDagerSyktBarn] = useState<number>(
        meldekortUker.filter((dag: MeldekortDag) => dag.status === MeldekortStatus.FRAVÆR_SYKT_BARN).length
    );
    const [antallDagerVelferd, setAntallDagerVelferd] = useState<number>(
        meldekortUker.filter((dag: MeldekortDag) => dag.status === MeldekortStatus.FRAVÆR_VELFERD).length
    );
    const [antallDager100prosent, setAntallDager100prosent] = useState<number>(0);
    const [antallDager75prosent, setAntallDager75prosent] = useState<number>(0);
    const [sumAntallDager100prosent, setSumAntallDager100prosent] = useState<number>(0);
    const [sumAntallDager75prosent, setSumAntallDager75prosent] = useState<number>(0);
    const egenMeldingsdager = 3;
    const dagsats = 268;

    useEffect(() => {
        finnAntallDagerMedRiktigUtbetalingsprosent();
        beregnRiktigSum();
    });

    const handleOppdaterMeldekort = (index: number, nyStatus: MeldekortStatus, ukeNr: number) => {
        const oppdatertMeldekortUkerKopi = [...oppdatertMeldekortUker];
        if (ukeNr == 2) {
            oppdatertMeldekortUkerKopi[index + 7].status = nyStatus;
        } else {
            oppdatertMeldekortUkerKopi[index].status = nyStatus;
        }
        setOppdaterMeldekortUker(oppdatertMeldekortUkerKopi);
        setAntallDagerIkkeDeltatt(finnAntallDager(MeldekortStatus.IKKE_DELTATT));
        setAntallDagerDeltatt(finnAntallDager(MeldekortStatus.DELTATT));
        setAntallDagerSyk(finnAntallDager(MeldekortStatus.FRAVÆR_SYK));
        setAntallDagerSyktBarn(finnAntallDager(MeldekortStatus.FRAVÆR_SYKT_BARN));
        setAntallDagerVelferd(finnAntallDager(MeldekortStatus.FRAVÆR_VELFERD));
        finnAntallDagerMedRiktigUtbetalingsprosent();
        beregnRiktigSum();
    };

    const finnAntallDager = (meldekortStatus: MeldekortStatus) => {
        return oppdatertMeldekortUker.filter((dag: MeldekortDag) => dag.status === meldekortStatus).length;
    };

    const finnAntallDagerMedRiktigUtbetalingsprosent = () => {
        const sykedager = antallDagerSyk + antallDagerSyktBarn;
        if (sykedager > egenMeldingsdager) {
            setAntallDager100prosent(antallDagerDeltatt + egenMeldingsdager + antallDagerVelferd);
            setAntallDager75prosent(sykedager - egenMeldingsdager);
        } else {
            setAntallDager75prosent(0);
            setAntallDager100prosent(sykedager + antallDagerDeltatt + antallDagerVelferd);
        }
    };

    const beregnRiktigSum = () => {
        setSumAntallDager100prosent(antallDager100prosent * dagsats);
        setSumAntallDager75prosent(antallDager75prosent * dagsats * 0.75);
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

            <MeldekortBeregningsvisning
                antallDagerIkkeDeltatt={antallDagerIkkeDeltatt}
                antallDagerDeltatt={antallDagerDeltatt}
                antallDagerSyk={antallDagerSyk}
                antallDagerSyktBarn={antallDagerSyktBarn}
                antallDagerVelferd={antallDagerVelferd}
                antallDager100prosent={antallDager100prosent}
                antallDager75prosent={antallDager75prosent}
                sumAntallDager100prosent={sumAntallDager100prosent}
                sumAntallDager75prosent={sumAntallDager75prosent}
            />

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
