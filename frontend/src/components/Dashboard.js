import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import Chart from "./chartbuilder/Chart";
import { Card } from "react-bootstrap";


const ReactGridLayout = WidthProvider(Responsive);

const generateLayout = (gridChartConf) => {
  return gridChartConf.map((item) => item?.grid);
};

const Dashboard = ({ gridChartConf }) => {
  return (
    <div className="App">
      <ReactGridLayout
        className="layout"
        layout={generateLayout(gridChartConf)}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        containerPadding={[10, 10]}
        margin={[10, 10]}
        rowHeight={330}
        isDraggable={true}
        resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
        allowOverlap={false}
        isResizable={true}
        preventCollision={true}
      >
        {gridChartConf.map((item) => {
          return (
            <Card key={item?.grid?.i} className="component-chart-container">
              <Chart chartOptions={item?.chartOptions}/>
            </Card>
          );
        })}
      </ReactGridLayout>
    </div>
  );
};

export default Dashboard;
