import { Provider } from '@ethersproject/providers';
import { BaseContract, Signer } from 'ethers';

import { TBasicContractDataConfig } from '~~/models';

export type TConnectorConnectorBase<
  GContract extends BaseContract
  // GContractInterface extends ethers.utils.Interface
> = Readonly<{
  connect: (address: string, signerOrProvider: Signer | Provider) => GContract;
  // createInterface: () => GContractInterface;
  abi: Readonly<Record<string, any>[]>;
}>;

export type TContractConnector<
  GContractNames extends string,
  GContract extends BaseContract
  // GContractInterface extends ethers.utils.Interface
> = Readonly<
  {
    contractName: GContractNames;
    config: TBasicContractDataConfig;
  } & TConnectorConnectorBase<GContract>
>;

export type TBaseContractExtended<GContractNames extends string> = BaseContract & { contractName: GContractNames };

export type TConnectorList<GContractNames extends string, GContracts extends TBaseContractExtended<GContractNames>> = {
  [contractName in GContractNames]: TContractConnector<GContractNames, GContracts>;
};

export type TTypedContract<
  GContractNames extends string,
  GAppContractConnectorList
> = GAppContractConnectorList extends {
  [key in GContractNames]: { connect: (address: any, signerOrProvider: any) => infer TypedContract };
}
  ? TypedContract
  : TBaseContractExtended<GContractNames>;

export type TContractsByName<
  GContractNames extends string,
  GContracts extends TBaseContractExtended<GContractNames>
> = { [contractName in GContractNames]: { [chainId in number]: GContracts | undefined } };

export type TContractsByChainId<
  GContractNames extends string,
  GContracts extends TBaseContractExtended<GContractNames>
> = {
  [chainId in number]: {
    [contractName in GContractNames]: GContracts | undefined;
  };
};

/**
 *
 */
export type TAppContractsContext<
  GContractNames extends string,
  GContracts extends TBaseContractExtended<GContractNames>
> = {
  contractConnectors: TConnectorList<GContractNames, GContracts>;
  contractsByName: TContractsByName<GContractNames, GContracts>;
  contractsByChainId: TContractsByChainId<GContractNames, GContracts>;
};