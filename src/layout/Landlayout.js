import { useEffect, useState } from 'react';
import '../assest/css/Landlayout.css';
import axios from 'axios';
import DrawChart from './DrawChart';
import { useFetcher } from 'react-router-dom';
const maximum = 10;
const dataCount = 1;

function Landlayout() {
  const [swapData, setSwapData] = useState([]);
  const [currentState, setCurrentState] = useState("WETH/USDC");
  const [pageIndicator, setPageIndicator] = useState(0);
  const [skips, setSkips] = useState(0); 
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    setSwapData([]);
    for(let i = 0 ; i < dataCount ; i ++)
      fetchSwapData("WETH/USDC", i);
  },[]);

  const fetchSwapData = async (state, index) => {
    setSwapData([]);
    setLoading(true);
    let swap_query = `
      query sample {
        liquidityPools(
          where: {symbol: "${state}"}
          orderBy: totalValueLockedUSD
          ${state=="WETH/USDC"?'':'orderDirection: desc'}
          first: 1
        ) {
          symbol
          swaps(orderBy: timestamp orderDirection: desc first: ${1000} skip: ${index*1000}){
            timestamp
            tokenIn {
              symbol
            }
            amountInUSD
            amountIn
            amountOutUSD
            amountOut
            tick
          }
        }
      }
    `;
    try {
      const response = await axios.post(
        'https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum',
        { query: swap_query }
      );
      setSwapData(response.data.data.liquidityPools[0].swaps.reverse());
      setLoading(false);
    } catch (error) {
    }
  }

  const changeState = (state) => {
    if(state != currentState){
      setPageIndicator(0);
      setCurrentState(state);
      for(let i = 0 ; i < dataCount ; i ++){
        fetchSwapData(state, i);
      }
    }
  }
  console.log(swapData);
  return (
        <div className='land-content flex flex-col text-left px-40 pt-20 justify-center  relative h-full'>
            <div className="back-circle"></div>
            <div className='back-circle1'></div>
            <div className='land-title text-4xl font-bold text-white leading-tight mb-10'>
               <DrawChart data={swapData} token={currentState=="WETH/USDC"?"ETH":"BTC"} indicator={pageIndicator}/>
               <div className='w-full flex justify-center place-items-center'>
                  <div className='select-none cursor-pointer hover:text-red-500' onClick={()=>setPageIndicator(pageIndicator>0?pageIndicator-1:pageIndicator)}>{'<'} &nbsp;</div>
                  <div className='text-2xl text-red-300'>{swapData.length>0 && `${new Date(parseInt(swapData[0].timestamp/3600/24+pageIndicator)*3600*24*1000).getMonth()+1}/${new Date(parseInt(swapData[0].timestamp/3600/24+pageIndicator)*3600*24*1000).getDate()}`}</div>
                  <div className='select-none cursor-pointer hover:text-red-500' onClick={()=>setPageIndicator(pageIndicator+1)}> &nbsp; {'>'}</div>
               </div>
               <button onClick={()=>{changeState("Wrapped BTC/USDC")}} className='pr-10 mt-10'> BTC/USDC </button>    
               <button onClick={()=>{changeState("WETH/USDC")}} className='pr-10 mt-10'> ETH/USDC </button>   
               {loading && <div className='w-[100vw] h-[100vh] bg-black/50 absolute top-0 left-0'> </div>}
            </div>
        </div>
  );
}

/*
INTRODUCTION

TRUST AI is an Ecosystem built on the Binance Blockchain with integrated AI.
Trust AI is focused on helping developers, companies and even individuals with zero knowledge of coding or any other protocol to be able to create smart contracts, security reporting within minutes and also with Storage system Management. To achieve the “code-per-byte” granularity, each software could send out a language every few seconds. 

A very important aspect of the TRUST AI Ecosystem is the establishment and continuous refinement of processes to enable smooth data sharing between different AI systems and further enable smooth interactions.
*/


export default Landlayout;