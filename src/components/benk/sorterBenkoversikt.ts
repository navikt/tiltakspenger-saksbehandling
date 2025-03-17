import { BehandlingEllerSøknadForOversiktData } from '../../types/BehandlingTypes';

export const sorterBenkoversikt = (
    søknaderOgBehandlinger: BehandlingEllerSøknadForOversiktData[],
): BehandlingEllerSøknadForOversiktData[] => {
    return (
        Object.values(
            Object.groupBy(søknaderOgBehandlinger, ({ fnr }) => fnr),
        ) as BehandlingEllerSøknadForOversiktData[][]
    ) // "as" fordi groupBy return er typet som Partial<T>, selv om fnr alltid er definert
        .toSorted((behandlingerForFnrA, behandlingerForFnrB) => {
            const eldsteA = finnEldsteBehandling(behandlingerForFnrA);
            const eldsteB = finnEldsteBehandling(behandlingerForFnrB);

            return getTimestamp(eldsteA) > getTimestamp(eldsteB) ? -1 : 1;
        })
        .flat();
};

const finnEldsteBehandling = (søknaderOgBehandlinger: BehandlingEllerSøknadForOversiktData[]) =>
    søknaderOgBehandlinger.toSorted((behandlingA, behandlingB) =>
        getTimestamp(behandlingA) > getTimestamp(behandlingB) ? 1 : -1,
    )[0];

const getTimestamp = (søknadEllerBehandling: BehandlingEllerSøknadForOversiktData) =>
    søknadEllerBehandling.kravtidspunkt ?? søknadEllerBehandling.opprettet;
