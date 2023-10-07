import React, { useRef, useEffect, useState } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import Chart from "./chartbuilder/Chart";
import { Card } from "react-bootstrap";

const ReactGridLayout = WidthProvider(RGL);

const generateLayout = (gridChartConf) => {
  return gridChartConf.map((item) => item?.grid);
};

const Dashboard = ({ gridChartConf, onChartResize }) => {
  const chartComponent = useRef(null);
  const [isResized, setIsResized] = useState(false)
    useEffect(()=>{
        console.log(chartComponent)
    },[chartComponent])

  return (
    <div className="App">
      <ReactGridLayout
        className="layout"
        layout={generateLayout(gridChartConf)}
        cols={12}
        rowHeight={60}
        width={1200}
        allowOverlap={false}
        isResizable={true}
        preventCollision={false}
        onResizeStop={(item) => {setIsResized(true)}}
            // onChartResize(item)}
      >
        {gridChartConf.map((item) => {
          return (
            <Card key={item?.grid?.i} className="component-chart-container">
              <Chart chartOptions={item?.chartOptions} innerRef={chartComponent}/>
            </Card>
          );
        })}
      </ReactGridLayout>
    </div>
  );
};

export default Dashboard;
