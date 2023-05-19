import fs from "fs";
import ip from "ip";

import { jujuStateFactory } from "./jaas-dashboard/src/testing/factories";
import {
  configFactory,
  credentialFactory,
  generalStateFactory,
} from "./jaas-dashboard/src/testing/factories/general";
import { modelStatusInfoFactory } from "./jaas-dashboard/src/testing/factories/juju/ClientV6";
import {
  modelDataApplicationFactory,
  modelDataFactory,
  modelDataInfoFactory,
  modelDataMachineFactory,
  modelDataStatusFactory,
  modelDataUnitFactory,
  modelListInfoFactory,
} from "./jaas-dashboard/src/testing/factories/juju/juju";
import {
  applicationInfoFactory,
  machineChangeDeltaFactory,
  modelWatcherModelDataFactory,
  modelWatcherModelInfoFactory,
  relationChangeDeltaFactory,
  unitChangeDeltaFactory,
} from "./jaas-dashboard/src/testing/factories/juju/model-watcher";
import { rootStateFactory } from "./jaas-dashboard/src/testing/factories/root";

const OUTPUT = "./mock-store.json";

const controllerEndpoint = `ws://${ip.address()}:17070/api`;

const state = rootStateFactory.build({
  general: generalStateFactory.build({
    config: configFactory.build({
      controllerAPIEndpoint: controllerEndpoint,
    }),
    controllerConnections: {
      [controllerEndpoint]: {
        user: {
          "display-name": "eggman",
          identity: "user-eggman@external",
          "controller-access": "",
          "model-access": "",
        },
      },
    },
    credentials: {
      [controllerEndpoint]: credentialFactory.build(),
    },
  }),
  juju: jujuStateFactory.build({
    modelData: {
      abc123: modelDataFactory.build({
        info: modelDataInfoFactory.build({
          "controller-uuid": "controller123",
          "cloud-tag": "cloud-aws",
          uuid: "abc123",
          name: "test-model",
          users: [
            {
              user: "eggman@external",
              access: "admin",
              "display-name": "",
              "last-connection": "",
              "model-tag": "",
            },
          ],
        }),
        model: modelStatusInfoFactory.build({
          "cloud-tag": "cloud-aws",
          name: "test-model",
        }),
        uuid: "abc123",
        applications: {
          etcd: modelDataApplicationFactory.build({
            units: {
              "etcd/0": modelDataUnitFactory.build({
                "agent-status": modelDataStatusFactory.build({
                  status: "allocating",
                }),
                charm: "ch:etcd",
              }),
              "etcd/1": modelDataUnitFactory.build({
                "agent-status": modelDataStatusFactory.build({
                  status: "lost",
                }),
                charm: "ch:etcd",
              }),
            },
          }),
          ceph: modelDataApplicationFactory.build({
            units: {
              "ceph/0": modelDataUnitFactory.build({
                "agent-status": modelDataStatusFactory.build({
                  status: "lost",
                }),
                charm: "ch:ceph",
              }),
            },
          }),
        },
        machines: {
          "0": modelDataMachineFactory.build({
            "agent-status": {
              status: "down",
            },
            id: "0",
          }),
          "1": modelDataMachineFactory.build({
            "agent-status": {
              status: "pending",
            },
            id: "1",
          }),
        },
      }),
    },
    models: {
      abc123: modelListInfoFactory.build({
        uuid: "abc123",
        name: "test-model",
        wsControllerURL: controllerEndpoint,
      }),
    },
    modelWatcherData: {
      abc123: modelWatcherModelDataFactory.build({
        model: modelWatcherModelInfoFactory.build({
          "model-uuid": "abc123",
          name: "test-model",
        }),
        applications: {
          "ceph-mon": applicationInfoFactory.build(),
        },
        machines: {
          "0": machineChangeDeltaFactory.build({ id: "0" }),
          "1": machineChangeDeltaFactory.build({ id: "1" }),
        },
        units: {
          "0": unitChangeDeltaFactory.build({
            "machine-id": "0",
            application: "ceph-mon",
          }),
          "1": unitChangeDeltaFactory.build({
            "machine-id": "0",
            application: "ceph-mon-0",
          }),
          "2": unitChangeDeltaFactory.build({
            "machine-id": "1",
            application: "ceph-mon-1",
          }),
          "3": unitChangeDeltaFactory.build({
            "machine-id": "1",
            application: "ceph-mon-2",
          }),
        },
        charms: {
          "ch:amd64/focal/postgresql-k8s-20": {
            "model-uuid": "test123",
            "charm-url": "ch:amd64/focal/postgresql-k8s-20",
            "charm-version": "",
            life: "alive",
            profile: null,
          },
        },
        relations: {
          "wordpress:db mysql:db": relationChangeDeltaFactory.build(),
        },
      }),
    },
    modelsLoaded: true,
  }),
});

const json = JSON.stringify(state);

try {
  fs.writeFileSync(OUTPUT, json);
  console.log("Mocks created in", OUTPUT);
} catch (error) {
  console.error(error);
}
