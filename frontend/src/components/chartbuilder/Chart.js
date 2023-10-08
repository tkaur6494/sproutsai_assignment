import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import axios from "axios";

const chartConfig = {
  title: {
    text: "",
  },
  credits: { enabled: false },
  legend: { enabled: true },
  xAxis: {
    labels: {
      enabled: true,
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
      },
      showInLegend: true,
    },
  },
};
const Chart = ({query_data}) => {
  const [chartOptions, setChartOptions] = useState({})
  useEffect(() => {
    if (query_data?.dimensions.length !== 0 && query_data?.measures.length !== 0) {
      axios
        .post(`${process.env.REACT_APP_API_BASE_PATH}/data`, query_data)
        .then((response) => {
          setChartOptions({ ...chartConfig, ...response?.data });
        });
    }
  }, [query_data]);

  return (
    <>
      {chartOptions.series?.length!=0 ? <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        
      />:<div className="component-no-data-found">No data found</div>}
    </>
  );
};

export default Chart;
