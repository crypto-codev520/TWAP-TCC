import { useEffect, useState } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';

ChartJS.register(
     CategoryScale,
     LinearScale,
     PointElement,
     LineElement,
     Title,
     Tooltip,
     Legend
);

const decimalsTwap={
  BTC: 2,
  ETH: 12
};

const decimalsPrice={
  BTC: 8,
  ETH: 18
};

function DrawChart ({data, token, indicator}) {
     const [startDate, setStartDate] = useState(undefined);
     const [content, setContent] = useState({
          labels: [],
          datasets: [
               {
                    label: 'Swap Price',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
               },
               {
                    label: 'TWAP Price',
                    data: [],
                    backgroundColor: 'rgba(255, 255, 132, 0.2)',
                    borderColor: 'rgba(255, 255, 132, 1)',
                    borderWidth: 2,
               },
          ],
     });
     console.log(indicator);
     useEffect(()=>{
          if(data.length > 0){
               setStartDate(parseInt(data[0].timestamp/3600/24+indicator)*3600*24);
               fetchDayData();
          }
     }, [data, indicator])
     // set start of date for visulaize.

     const indexOfLimit = (timestamp) => {
          for(var i = 0 ; i < data.length ; i ++)
               if(parseInt(data[i].timestamp) >= parseInt(timestamp)) return i;
          return data.length;
     }

     const getTokenPrice = (curda) => {
          if (curda.tokenIn.symbol.indexOf(token) >= 0)
               return parseFloat(curda.amountInUSD) / parseFloat(curda.amountIn) * (10 ** decimalsPrice[token]);
          return parseFloat(curda.amountOutUSD) / parseFloat(curda.amountOut) * (10 ** decimalsPrice[token]);
     }

     const getGraphLabelFromDate = (timestamp) => 
     {
          const date = new Date(timestamp*1000);
          return `${date.getHours()}:${date.getMinutes()}:0`;
     }
    // console.log(data);
     const fetchDayData = () => {
          let startDate = parseInt(data[0].timestamp/3600/24+indicator)*3600*24;
          let graph_Data = {
               labels: [],
               datasets: [
                    {
                         label: `${new Date(startDate*1000).getMonth()+1}/${new Date(startDate*1000).getDate()} Swap Price`,
                         data: [],
                         backgroundColor: 'rgba(255, 99, 132, 0.2)',
                         borderColor: 'rgba(255, 99, 132, 1)',
                         borderWidth: 1,
                    },
                    {
                         label: 'TWAP Price',
                         data: [],
                         backgroundColor: 'rgba(255, 255, 132, 0.2)',
                         borderColor: 'rgba(255, 255, 132, 1)',
                         borderWidth: 2,
                    }
               ],
          };

          const from = indexOfLimit(startDate);
          const last = indexOfLimit(startDate + 24*3600);
          let prevPrice = 0, normal = 0;

          for(let moment = parseInt(startDate) ; moment < startDate + 3600*24 ; moment += 3600){
               let dayCumulators = 0, cnt = 0, ticks = 0;
               for(let index = from ; index < last ; index ++){
                    if(parseInt(data[index].timestamp) > moment + 3600)
                         break;
                    if(parseInt(data[index].timestamp) > moment) { 
                         cnt ++;
                         dayCumulators += getTokenPrice(data[index]);
                         ticks += parseInt(data[index].tick);
                    }
               }
               graph_Data.labels.push(getGraphLabelFromDate(moment));
               if(dayCumulators > 0 ){
                    graph_Data.datasets[0].data.push(normal = prevPrice = dayCumulators / cnt);
                    graph_Data.datasets[1].data.push((1.0001**(ticks / cnt)) * (10 ** decimalsTwap[token]));
               }
               else{
                    graph_Data.datasets[0].data.push(prevPrice);
                    graph_Data.datasets[1].data.push(prevPrice);
               }
          }

          for(let index = 0 ; index < graph_Data.datasets[0].data.length; index++)
               graph_Data.datasets[0].data[index] == 0 
                                   &&   (graph_Data.datasets[1].data[index] = graph_Data.datasets[0].data[index] = normal);
          setContent(graph_Data);
     }

     return (
          <Line data={content}/>
     );
}

export default DrawChart;