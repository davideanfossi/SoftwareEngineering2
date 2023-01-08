import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

export const SimpleBarChart = ({ data, yKey, xKey }) => {
  const max = data
    .map((elem) => elem.value)
    .reduce((max, elem) => (elem > max ? elem : max), 0);
  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const lenght = value.toString().length;
    const fireOffset = value === max;
    const offset = fireOffset ? 1 * lenght : -9 * lenght;
    return (
      <text
        x={x + width - offset}
        y={y + height - 5}
        fill={fireOffset ? "#fff" : "#000"}
        textAnchor="end"
      >
        {value}
      </text>
    );
  };
  return (
    <ResponsiveContainer width={"100%"} height={50 * data.length} debounce={50}>
      <BarChart data={data} layout="vertical">
        <XAxis hide axisLine={false} type="number" />
        <YAxis
          yAxisId={0}
          dataKey={xKey}
          type="category"
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Bar dataKey={yKey} minPointSize={2} barSize={32}>
          <LabelList
            dataKey={yKey}
            content={renderCustomizedLabel}
            position="insideRight"
            style={{ fill: "white" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
