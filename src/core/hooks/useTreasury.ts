import { useQuery } from 'react-query';

import { apolloClient } from '../apollo/client';
import { rebaseDataQuery, treasuryDataQuery } from '../data/query';

export const useTreasuryRebase = options => {
  return useQuery(
    'treasury_rebases',
    async () => {
      const response = await apolloClient(rebaseDataQuery);
      return response.data.rebases;
    },
    options,
  );
};

export const useTreasuryMetrics = options => {
  return useQuery(
    'treasury_metrics',
    async () => {
      const response = await apolloClient(treasuryDataQuery);
      // Transform string values to floats
      return response.data.protocolMetrics.map(metric =>
        Object
          .entries(metric)
          .reduce(
            (obj, [key, value]) => {
              (obj[key] = parseFloat(value.toString()));
              return obj;
            }, {})
      );
    },
    options,
  );
};
