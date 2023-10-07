import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect } from "react";

const Chart = ({ chartOptions, innerRef, isResized }) => {
  useEffect(() => {
    let chart = innerRef?.current.chart;
    if(chart){
      chart.reflow(false)
    }
  }, [isResized]);
  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        ref={innerRef}
      />
    </>
  );
};

export default Chart;
