import React from 'react';
import { Tabs } from '@navikt/ds-react';
import styles from './TiltaksdeltagelseDemo.module.css';
import TiltakCard from './TiltakCard';
import { TiltaksdeltagelseDTO } from './types';
import { formatPeriode } from '../../utils/date';
import TiltaksdeltagelseVilkårsvurdering from '../tiltaksdeltagelse-vilkårsvurdering/TiltaksdeltagelseVilkårsvurdering';
import { Utfall } from '../../types/Utfall';
import { FileTextIcon } from '@navikt/aksel-icons';
import StønadsdagerVilkårsvurdering from './StønadsdagerVilkårsvurdering';

interface TiltaksdeltagelseDemoProps {
  tiltaksdeltagelser: TiltaksdeltagelseDTO[];
}

const TiltaksdeltagelseDemo = ({
  tiltaksdeltagelser,
}: TiltaksdeltagelseDemoProps) => {
  return (
    <div className={styles.tiltaksdeltagelse}>
      <Tabs defaultValue="inngangsvilkar">
        <Tabs.List>
          <Tabs.Tab
            value="inngangsvilkar"
            label="Inngangsvilkår"
            icon={<FileTextIcon title="vilkår" aria-hidden />}
          />
          <Tabs.Tab
            value="ovrigevilkar"
            label="Øvrige vilkår"
            icon={<FileTextIcon title="vilkår" aria-hidden />}
          />
          <Tabs.Tab
            value="stonadsdager-next"
            label="Nytt stønadsdager-design"
            icon={<FileTextIcon title="vilkår" aria-hidden />}
          />
        </Tabs.List>
        <Tabs.Panel
          value="inngangsvilkar"
          className="h-24 w-full bg-gray-50 p-4"
        >
          <div style={{ marginTop: '1rem' }}>
            <TiltaksdeltagelseVilkårsvurdering
              samletUtfall={Utfall.OPPFYLT}
              tiltaksdeltagelser={tiltaksdeltagelser}
            />
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="ovrigevilkar" className="h-24 w-full bg-gray-50 p-4">
          <div className={styles.tiltakCardWrapper}>
            {tiltaksdeltagelser.map((tiltaksdeltagelse) => {
              return (
                <TiltakCard
                  tittel={tiltaksdeltagelse.tiltaksvariant}
                  periode={tiltaksdeltagelse.periode}
                  status={tiltaksdeltagelse.status}
                  harSøkt={tiltaksdeltagelse.harSøkt}
                  girRett={tiltaksdeltagelse.girRett}
                  deltagelsesperioder={tiltaksdeltagelse.deltagelsesperioder}
                  onAddTiltaksdeltagelse={() => {}}
                  key={formatPeriode(tiltaksdeltagelse.periode)}
                />
              );
            })}
          </div>
        </Tabs.Panel>
        <Tabs.Panel
          value="stonadsdager-next"
          className="h-24 w-full bg-gray-50 p-4"
        >
          <div style={{ marginTop: '1rem' }}>
            <StønadsdagerVilkårsvurdering
              tiltaksdeltagelser={tiltaksdeltagelser}
            />
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default TiltaksdeltagelseDemo;
