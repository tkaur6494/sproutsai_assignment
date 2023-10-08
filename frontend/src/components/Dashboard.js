import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import Chart from "./chartbuilder/Chart";
import { Card } from "react-bootstrap";

const ReactGridLayout = WidthProvider(Responsive);

const Dashboard = ({ gridChartConf, onChartResize }) => {
  return (
    <div>
      <ReactGridLayout
        className="layout"
        layout={gridChartConf.map((item) => item?.grid)}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        containerPadding={[10, 10]}
        margin={[10, 10]}
        rowHeight={150}
        isDraggable={true}
        resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
        allowOverlap={false}
        isResizable={true}
        preventCollision={false}
        onResizeStop={(item) => {onChartResize(item)}}
        onDragStop={(item=>{onChartResize(item)})}
      >
        {gridChartConf.map((item) => {
          return (
            <Card
              key={item?.grid?.i}
              data-grid={{
                h: item?.grid?.h,
                x: item?.grid?.x,
                y: item?.grid?.y,
                w: item?.grid?.w,
              }}
            >
              <Chart
                query_data={item?.query_data}
                chartColor={item?.chartColor}
              />
            </Card>
          );
        })}
      </ReactGridLayout>
    </div>
  );
};

export default Dashboard;
