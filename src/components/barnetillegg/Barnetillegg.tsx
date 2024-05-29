import {
  BodyShort,
  Box,
  Button,
  Heading,
  Table,
  VStack,
} from '@navikt/ds-react';
import styles from './Barnetillegg.module.css';
import { PencilIcon } from '@navikt/aksel-icons';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';

const barn = [
  {
    navn: 'Ole Duck',
    fnr: '01010847205',
    fdato: '01.01.2008',
    alder: '16',
    bosatt: 'Norge',
    opphold: 'Innenfor Norge/EØS',
    opplysninger: [
      {
        fakta: 'Barnet er under 18 år',
        periode: '12.01.2024 - 22.05.2024',
        kilde: 'PDL',
        detaljer: '',
        utfall: 'OPPFYLT',
      },
      {
        fakta: 'Barnet forsørges av søker',
        periode: '12.01.2024 - 22.05.2024',
        kilde: 'PDL',
        detaljer: '',
        utfall: 'OPPFYLT',
      },
      {
        fakta: 'Barnet bosatt i Norge',
        periode: '12.01.2024 - 22.05.2024',
        kilde: 'PDL',
        detaljer: '',
        utfall: 'OPPFYLT',
      },
      {
        fakta: 'Barnet har ikke vært utenfor EØS over 90 dager',
        periode: '12.01.2024 - 22.05.2024',
        kilde: 'Søknaden',
        detaljer: '',
        utfall: 'OPPFYLT',
      },
    ],
  },
  {
    navn: 'Dole Duck',
    fnr: '01010894568',
    fdato: '01.01.2008',
    alder: '16',
    bosatt: 'Norge',
    opphold: 'Innenfor Norge/EØS',
    opplysninger: [
      {
        fakta: 'Barnet er under 18 år',
        periode: '12.01.2024 - 22.05.2024',
        kilde: 'PDL',
        detaljer: '',
        utfall: 'OPPFYLT',
      },
      {
        fakta: 'Barnet forsørges av søker',
        periode: '12.01.2024 - 22.05.2024',
        kilde: 'PDL',
        detaljer: '',
        utfall: 'OPPFYLT',
      },
      {
        fakta: 'Barnet oppholder seg i Norge',
        periode: '12.01.2024 - 22.05.2024',
        kilde: 'PDL',
        detaljer: '',
        utfall: 'OPPFYLT',
      },
      {
        fakta: 'Barnet har ikke vært utenfor EØS over 90 dager',
        periode: '12.01.2024 - 22.05.2024',
        kilde: 'PDL',
        detaljer: '',
        utfall: 'OPPFYLT',
      },
    ],
  },
];

const Barnetillegg = () => (
  <VStack gap="5" className={styles.barnetillegg}>
    {barn.map(({ fnr, navn, fdato, alder, bosatt, opphold, opplysninger }) => (
      <Box
        padding="5"
        borderColor="border-strong"
        borderWidth="2"
        borderRadius="large"
        key={fnr}
      >
        <Heading size="medium" level="3" spacing>
          <b>{navn}</b>
        </Heading>
        <BodyShort>
          <b>Fødselsnr:</b> {fnr}
        </BodyShort>
        <BodyShort>
          <b>Fødselsdato:</b> {fdato}
        </BodyShort>
        <BodyShort>
          <b>Alder:</b> {alder}
        </BodyShort>
        <BodyShort>
          <b>Bosatt:</b> {bosatt}
        </BodyShort>
        <BodyShort spacing>
          <b>Opphold:</b> {opphold}
        </BodyShort>
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col"></Table.HeaderCell>
              <Table.HeaderCell scope="col">Vurdering</Table.HeaderCell>
              <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
              <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
              <Table.HeaderCell scope="col">Detaljer</Table.HeaderCell>
              <Table.HeaderCell scope="col"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {opplysninger.map((opplysning) => (
              <Table.Row key={opplysning.fakta}>
                <Table.DataCell>
                  <UtfallIkon utfall={opplysning.utfall} />
                </Table.DataCell>
                <Table.DataCell>{opplysning.fakta}</Table.DataCell>
                <Table.DataCell>{opplysning.periode}</Table.DataCell>
                <Table.DataCell>{opplysning.kilde}</Table.DataCell>
                <Table.DataCell>{opplysning.detaljer}</Table.DataCell>
                <Table.DataCell>
                  <Button
                    onClick={() => console.log('hei')}
                    variant="tertiary"
                    iconPosition="left"
                    icon={<PencilIcon />}
                    aria-label="hidden"
                  />
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Box>
    ))}
  </VStack>
);

export default Barnetillegg;
