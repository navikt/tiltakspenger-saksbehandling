import { Tabs } from '@navikt/ds-react';
import React from 'react';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';
import { DocPencilIcon, PersonPencilIcon } from '@navikt/aksel-icons';
import { classNames } from '~/utils/classNames';
import { MeldeperiodeInfoPanel } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiode-info/info-panel/MeldeperiodeInfoPanel';
import { MeldeperiodeBrukersMeldekortPanel } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/meldeperiode-info/brukers-meldekort-panel/MeldeperiodeBrukersMeldekortPanel';

import style from './MeldeperiodeInfo.module.css';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
};

export const MeldeperiodeInfo = ({ meldeperiodeKjede }: Props) => {
    const { brukersMeldekort } = meldeperiodeKjede;

    return (
        <Tabs defaultValue={TabVerdi.Info} className={style.outer}>
            <Tabs.List>
                <Tabs.Tab value={TabVerdi.Info} label={'Meldeperiode'} icon={<DocPencilIcon />} />
                <Tabs.Tab
                    value={TabVerdi.BrukersMeldekort}
                    label={`Meldekort (${brukersMeldekort.length})`}
                    icon={<PersonPencilIcon />}
                />
            </Tabs.List>

            <Tabs.Panel value={TabVerdi.Info} className={classNames(style.tabPanel, style.info)}>
                <MeldeperiodeInfoPanel meldeperiodeKjede={meldeperiodeKjede} />
            </Tabs.Panel>

            <Tabs.Panel value={TabVerdi.BrukersMeldekort} className={style.tabPanel}>
                <MeldeperiodeBrukersMeldekortPanel meldeperiodeKjede={meldeperiodeKjede} />
            </Tabs.Panel>
        </Tabs>
    );
};

enum TabVerdi {
    Info = 'Info',
    BrukersMeldekort = 'BrukersMeldekort',
}
