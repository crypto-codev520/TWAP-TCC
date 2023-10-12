export const queries = {
     GET_POOL_DATA_USD_BTC : `
          query GetPoolData {
               liquidityPools(
                    where: { symbol: "Wrapped BTC/USDC" }
                    orderBy: totalValueLockedUSD
                    orderDirection: desc
                    first: 1
               ) {
                    id
                    symbol
                    tick
               }
               ticks(
                    where: { pool_: { symbol: "Wrapped BTC/USDC" } }
                    orderBy: lastUpdateTimestamp
                    orderDirection: desc
                    first: 1000
               ) {
                    index
                    liquidityGross
                    lastUpdateTimestamp
                    prices
                    pool {
                    symbol
                    inputTokens {
                         lastPriceUSD
                    }
                    }
               }
          }
     `,
     GET_POOL_DATA_USD_ETH : `
          query GetPoolData {
               liquidityPools(
                    where: { symbol: "WETH/USDC" }
                    orderBy: totalValueLockedUSD
                    orderDirection: desc
                    first: 1
               ) {
                    id
                    symbol
                    tick
               }
               ticks(
                    where: { pool_: { symbol: "WETH/USDC" } }
                    orderBy: lastUpdateTimestamp
                    orderDirection: desc
                    first: 1000
               ) {
                    index
                    liquidityGross
                    lastUpdateTimestamp
                    prices
                    pool {
                    symbol
                    inputTokens {
                         lastPriceUSD
                    }
                    }
               }
          }
     `,
     GET_POOL_DATA_ETH_BTC : `
          query GetPoolData {
               liquidityPools(
                    where: { symbol: "Wrapped BTC/WETH" }
                    orderBy: totalValueLockedUSD
                    orderDirection: desc
                    first: 1
               ) {
                    id
                    symbol
                    tick
               }
               ticks(
                    where: { pool_: { symbol: "Wrapped BTC/WETH" } }
                    orderBy: lastUpdateTimestamp
                    orderDirection: desc
                    first: 1000
               ) {
                    index
                    liquidityGross
                    lastUpdateTimestamp
                    prices
                    pool {
                    symbol
                    inputTokens {
                         lastPriceUSD
                    }
                    }
               }
          }
     `,

}