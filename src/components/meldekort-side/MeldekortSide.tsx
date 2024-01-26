import styles from './meldekort.module.css';
import { MeldekortUke } from '../meldekort-side/MeldekortUke';
import { MeldekortBeregningsvisning } from '../meldekort-beregning-visning/MeldekortBeregningsVisning';
import { HStack, Spacer, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { MeldekortDag, MeldekortStatus } from '../../types/MeldekortTypes';
import { MeldekortKnapper } from './MeldekortKnapper';

interface MeldekortSideProps extends React.PropsWithChildren {
  title?: string;
}

export const MeldekortSide = ({}: MeldekortSideProps) => {
  const [disableUkeVisning, setDisableUkeVisning] = useState<boolean>(false);
  const meldekortUker: MeldekortDag[] = [
    {
      dato: new Date('2023-12-04'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.IKKE_DELTATT,
    },
    {
      dato: new Date('2023-12-05'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.IKKE_DELTATT,
    },
    {
      dato: new Date('2023-12-06'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.FRAVÆR_SYKT_BARN,
    },
    {
      dato: new Date('2023-12-07'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.FRAVÆR_SYKT_BARN,
    },
    {
      dato: new Date('2023-12-08'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.DELTATT,
    },
    {
      dato: new Date('2023-12-09'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.IKKE_DELTATT,
    },
    {
      dato: new Date('2023-12-10'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.IKKE_DELTATT,
    },
    {
      dato: new Date('2023-12-11'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.DELTATT,
    },
    {
      dato: new Date('2023-12-12'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.LØNN_FOR_TID_I_ARBEID,
    },
    {
      dato: new Date('2023-12-13'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.FRAVÆR_SYK,
    },
    {
      dato: new Date('2023-12-14'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.DELTATT,
    },
    {
      dato: new Date('2023-12-15'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.DELTATT,
    },
    {
      dato: new Date('2023-12-16'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.IKKE_DELTATT,
    },
    {
      dato: new Date('2023-12-17'),
      tiltak: {
        id: '123',
        periode: {
          fra: '2023-12-20',
          til: '2023-12-30',
        },
        typeBeskrivelse: '',
        typeKode: '',
        antDagerIUken: 3,
      },
      status: MeldekortStatus.IKKE_DELTATT,
    },
  ];

  const [oppdatertMeldekortUker, setOppdaterMeldekortUker] = useState([
    ...meldekortUker,
  ]);
  const [antallDagerIkkeDeltatt, setAntallDagerIkkeDeltatt] = useState<number>(
    meldekortUker.filter(
      (dag: MeldekortDag) => dag.status === MeldekortStatus.IKKE_DELTATT
    ).length
  );
  const [antallDagerDeltatt, setAntallDagerDeltatt] = useState<number>(
    meldekortUker.filter(
      (dag: MeldekortDag) => dag.status === MeldekortStatus.DELTATT
    ).length
  );
  const [antallDagerSyk, setAntallDagerSyk] = useState<number>(
    meldekortUker.filter(
      (dag: MeldekortDag) => dag.status === MeldekortStatus.FRAVÆR_SYK
    ).length
  );
  const [antallDagerSyktBarn, setAntallDagerSyktBarn] = useState<number>(
    meldekortUker.filter(
      (dag: MeldekortDag) => dag.status === MeldekortStatus.FRAVÆR_SYKT_BARN
    ).length
  );
  const [antallDagerVelferd, setAntallDagerVelferd] = useState<number>(
    meldekortUker.filter(
      (dag: MeldekortDag) => dag.status === MeldekortStatus.FRAVÆR_VELFERD
    ).length
  );
  const [antallDager100prosent, setAntallDager100prosent] = useState<number>(0);
  const [antallDager75prosent, setAntallDager75prosent] = useState<number>(0);
  const [sumAntallDager100prosent, setSumAntallDager100prosent] =
    useState<number>(0);
  const [sumAntallDager75prosent, setSumAntallDager75prosent] =
    useState<number>(0);
  const egenMeldingsdager = 3;
  const dagsats = 268;

  useEffect(() => {
    finnAntallDagerMedRiktigUtbetalingsprosent();
    beregnRiktigSum();
  });

  const handleOppdaterMeldekort = (
    index: number,
    nyStatus: MeldekortStatus,
    ukeNr: number
  ) => {
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
    return oppdatertMeldekortUker.filter(
      (dag: MeldekortDag) => dag.status === meldekortStatus
    ).length;
  };

  const finnAntallDagerMedRiktigUtbetalingsprosent = () => {
    const sykedager = antallDagerSyk + antallDagerSyktBarn;
    if (sykedager > egenMeldingsdager) {
      setAntallDager100prosent(
        antallDagerDeltatt + egenMeldingsdager + antallDagerVelferd
      );
      setAntallDager75prosent(sykedager - egenMeldingsdager);
    } else {
      setAntallDager75prosent(0);
      setAntallDager100prosent(
        sykedager + antallDagerDeltatt + antallDagerVelferd
      );
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
    <VStack gap="5" style={{ margin: '1em' }}>
      <HStack
        className={
          disableUkeVisning ? styles.disableUkevisning : styles.ukevisning
        }
      >
        <MeldekortUke
          meldekortUke={oppdatertMeldekortUker.slice(0, 7)}
          ukesnummer={1}
          fom={1}
          tom={7}
          ukeNr={1}
          handleOppdaterMeldekort={handleOppdaterMeldekort}
        />
        <Spacer />
        <MeldekortUke
          meldekortUke={oppdatertMeldekortUker.slice(7, 14)}
          ukesnummer={2}
          fom={8}
          tom={14}
          ukeNr={2}
          handleOppdaterMeldekort={handleOppdaterMeldekort}
        />
      </HStack>
      <MeldekortBeregningsvisning
        tellinger={[
          antallDagerDeltatt,
          antallDagerIkkeDeltatt,
          antallDagerSyk,
          antallDagerSyktBarn,
          antallDagerVelferd,
          antallDager100prosent,
          antallDager75prosent,
        ]}
        sumAntallDager={[sumAntallDager75prosent, sumAntallDager100prosent]}
      />
      <MeldekortKnapper
        håndterEndreMeldekort={() => setDisableUkeVisning(!disableUkeVisning)}
        håndterGodkjennMeldekort={godkjennMeldekort}
      />
    </VStack>
  );
};
