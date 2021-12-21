/**
 * Access `process.env` in an environment helper
 * Usage: `EnvHelper.env`
 * - Other static methods can be added as needed per
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
 */
export class EnvironmentHelper {
  /**
   * @returns `process.env`
   */
  static env = process.env;
  static alchemyTestnetURI = `https://eth-rinkeby.alchemyapi.io/v2/${EnvironmentHelper.env.REACT_APP_TESTNET_ALCHEMY}`;
  static whitespaceRegex = /\s+/;

  /**
   * Returns env contingent segment api key
   * @returns segment
   */
  static getSegmentKey() {
    return EnvironmentHelper.env.REACT_APP_SEGMENT_API_KEY;
  }

  static isNotEmpty(envVariable: string) {
    return envVariable.length > 10;
  }

  /**
   * in development environment will return the `ethers` community api key so that devs don't need to add elements to their .env
   * @returns Array of Alchemy API URIs or empty set
   */
  static getAlchemyAPIKeyList() {
    let ALCHEMY_ID_LIST: string[];

    // split the provided API keys on whitespace
    if (EnvironmentHelper.env.REACT_APP_ALCHEMY_IDS && EnvironmentHelper.isNotEmpty(EnvironmentHelper.env.REACT_APP_ALCHEMY_IDS)) {
      ALCHEMY_ID_LIST = EnvironmentHelper.env.REACT_APP_ALCHEMY_IDS.split(EnvironmentHelper.whitespaceRegex);
    } else {
      ALCHEMY_ID_LIST = [];
    }

    // now add the uri path
    if (ALCHEMY_ID_LIST.length > 0) {
      ALCHEMY_ID_LIST = ALCHEMY_ID_LIST.map(alchemyID => `https://eth-mainnet.alchemyapi.io/v2/${alchemyID}`);
    } else {
      ALCHEMY_ID_LIST = [];
    }
    return ALCHEMY_ID_LIST;
  }

  /**
   * NOTE(appleseed): Infura IDs are only used as Fallbacks & are not Mandatory
   * @returns {Array} Array of Infura API Ids
   */
  static getInfuraIdList() {
    let INFURA_ID_LIST: string[];

    // split the provided API keys on whitespace
    if (EnvironmentHelper.env.REACT_APP_INFURA_IDS && EnvironmentHelper.isNotEmpty(EnvironmentHelper.env.REACT_APP_INFURA_IDS)) {
      INFURA_ID_LIST = EnvironmentHelper.env.REACT_APP_INFURA_IDS.split(new RegExp(EnvironmentHelper.whitespaceRegex));
    } else {
      INFURA_ID_LIST = [];
    }

    // now add the uri path
    if (INFURA_ID_LIST.length > 0) {
      INFURA_ID_LIST = INFURA_ID_LIST.map(infuraID => `https://mainnet.infura.io/v3/${infuraID}`);
    } else {
      INFURA_ID_LIST = [];
    }
    return INFURA_ID_LIST;
  }

  /**
   * @returns {Array} Array of node url addresses or empty set
   * node url addresses can be whitespace-separated string of "https" addresses
   * - functionality for Websocket addresses has been deprecated due to issues with WalletConnect
   *     - WalletConnect Issue: https://github.com/WalletConnect/walletconnect-monorepo/issues/193
   */
  static getSelfHostedNode() {
    let URI_LIST: string[];
    if (EnvironmentHelper.env.REACT_APP_SELF_HOSTED_NODE && EnvironmentHelper.isNotEmpty(EnvironmentHelper.env.REACT_APP_SELF_HOSTED_NODE)) {
      URI_LIST = EnvironmentHelper.env.REACT_APP_SELF_HOSTED_NODE.split(new RegExp(EnvironmentHelper.whitespaceRegex));
    } else {
      URI_LIST = [];
    }
    return URI_LIST;
  }

  /**
   * in development will always return the `ethers` community key url even if .env is blank
   * in prod if .env is blank API connections will fail
   * @returns array of API urls
   */
  static getAPIUris() {
    let allNodeUris = EnvironmentHelper.getSelfHostedNode();
    if (EnvironmentHelper.env.NODE_ENV === 'development' && allNodeUris.length === 0) {
      // push in the common ethers key in development
      allNodeUris.push('https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC');
    }
    if (allNodeUris.length === 0) console.error('API keys must be set in the .env');
    return allNodeUris;
  }

  static getFallbackURIs() {
    return [...EnvironmentHelper.getAlchemyAPIKeyList(), ...EnvironmentHelper.getInfuraIdList()];
  }

  static getGeoapifyAPIKey() {
    const apiKey = EnvironmentHelper.env.REACT_APP_GEOAPIFY_API_KEY;
    if (!apiKey) {
      console.warn('Missing REACT_APP_GEOAPIFY_API_KEY environment variable');
      return null;
    }

    return apiKey;
  }
}


