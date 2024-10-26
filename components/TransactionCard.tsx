import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  Skia,
  Text as SkiaText,
  useFont,
} from '@shopify/react-native-skia';

interface TransactionCardProps {
  data: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  isEarnings: boolean;
  toggleEarnings: () => void;
}

const { width } = Dimensions.get('window');
const CARD_HORIZONTAL_MARGIN = 24; // Total horizontal margin 
const CARD_HORIZONTAL_PADDING = 16; // Padding inside the card 
const CHART_WIDTH = width - CARD_HORIZONTAL_MARGIN - 2 * CARD_HORIZONTAL_PADDING; // width to match card width minus padding
const GRAPH_PADDING = 16; // Padding to inset data points from edges

const TransactionCard: React.FC<TransactionCardProps> = ({
  data,
  isEarnings,
  toggleEarnings,
}) => {
  const chartHeight = 180;
  const fontLarge = useFont(require('../assets/fonts/sf-pro-regular.ttf'), 14); // For value labels
  const fontSmall = useFont(require('../assets/fonts/sf-pro-regular.ttf'), 8); // For decimal values
  const fontXAxis = useFont(require('../assets/fonts/sf-pro-regular.ttf'), 14); // For X-axis labels


  if (!fontLarge || !fontSmall || !fontXAxis) {
    return null; 
  }

  const values = data.datasets[0].data;
  const labels = data.labels;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);


  const scaleFactor = 0.8; // Adjust between 0 and 1 to reduce variance
  const yPadding = 30; // Padding at the top and bottom of the chart

  // Calculate points for the graph
  const numDataPoints = values.length;
  const xStep = (CHART_WIDTH - 2 * GRAPH_PADDING) / (numDataPoints - 1);
  const points = values.map((value, index) => {
    const x = GRAPH_PADDING + index * xStep;
    const y =
      yPadding +
      ((maxValue - value) / (maxValue - minValue)) *
        (chartHeight - 2 * yPadding) *
        scaleFactor;
    return { x, y };
  });


  const leftEdgePoint = {
    x: 0,
    y: points[0].y,
  };
  const rightEdgePoint = {
    x: CHART_WIDTH,
    y: points[points.length - 1].y,
  };
  const extendedPoints = [leftEdgePoint, ...points, rightEdgePoint];

  //  path
  const path = Skia.Path.Make();
  const gradientPath = Skia.Path.Make();

  if (extendedPoints.length > 0) {
    path.moveTo(extendedPoints[0].x, extendedPoints[0].y);
    gradientPath.moveTo(extendedPoints[0].x, extendedPoints[0].y);

    for (let i = 0; i < extendedPoints.length - 1; i++) {
      const curr = extendedPoints[i];
      const next = extendedPoints[i + 1];

      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = next.x - (next.x - curr.x) / 2;
      const cp2y = next.y;

      path.cubicTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
      gradientPath.cubicTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
    }

    // the gradient path
    gradientPath.lineTo(CHART_WIDTH, chartHeight);
    gradientPath.lineTo(0, chartHeight);
    gradientPath.close();
  }

  return (
    <View className="bg-white rounded-3xl p-4 border border-gray-300">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-2xl font-sf-medium">Transaction</Text>
        <TouchableOpacity
          className="bg-gray-100 py-1 px-3 rounded-full"
          onPress={toggleEarnings}
        >
          <Text className="font-sf-regular text-sm text-black">
            {isEarnings ? 'Earnings' : 'Spending'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Canvas */}
      <Canvas style={{ height: chartHeight + 40, width: CHART_WIDTH, alignSelf: 'center' }}>
        <Group>
          {/* the gradient under the line */}
          <Group>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: chartHeight }}
              colors={['#87DCFB80', '#87DCFB00']}
            />
            <Path path={gradientPath} style="fill" />
          </Group>

          {/* the blue line path */}
          <Path path={path} style="stroke" strokeWidth={4} color="#87DCFB" />

          {/* vertical lines from x-axis to each point */}
          {points.map((point, index) => (
            <Group key={`line-${index}`}>
              <Path
                path={(() => {
                  const linePath = Skia.Path.Make();
                  linePath.moveTo(point.x, chartHeight - yPadding + 10);
                  linePath.lineTo(point.x, point.y);
                  return linePath;
                })()}
                style="stroke"
                strokeWidth={0.5}
                color="#cccccc"
              />
            </Group>
          ))}

          {/* circles and labels at data points */}
          {points.map((point, index) => {
            const value = values[index];
            const integerPart = Math.floor(value).toString();
            const decimalPart = (value % 1).toFixed(2).substring(1); 

            // the widths of the integer and decimal parts
            const integerWidth = fontLarge.getTextWidth(`$${integerPart}`);
            const decimalWidth = fontSmall.getTextWidth(decimalPart);
            const totalWidth = integerWidth + decimalWidth;

            // x position to center the label over the point
            let labelX = point.x - totalWidth / 2;

            // labelX is within the Canvas boundaries
            if (labelX < 0) {
              labelX = 0;
            } else if (labelX + totalWidth > CHART_WIDTH) {
              labelX = CHART_WIDTH - totalWidth;
            }

            return (
              <Group key={index}>
                {/* Blue filled circle */}
                <Circle cx={point.x} cy={point.y} r={6} color="#87DCFB" />
                {/* White outlined circle */}
                <Circle
                  cx={point.x}
                  cy={point.y}
                  r={6}
                  color="white"
                  style="stroke"
                  strokeWidth={2}
                />

                {/* integer part of the value */}
                <SkiaText
                  x={labelX}
                  y={point.y - 8}
                  text={`$${integerPart}`}
                  font={fontLarge}
                  color="#000"
                />
                {/* decimal part of the value */}
                <SkiaText
                  x={labelX + integerWidth}
                  y={point.y - 8}
                  text={decimalPart}
                  font={fontSmall}
                  color="#000"
                />
              </Group>
            );
          })}

          {/* X-axis labels */}
          {labels.map((label, index) => {
            const labelWidth = fontXAxis.getTextWidth(label);
            let labelX = points[index].x - labelWidth / 2;

            // labelX is within the Canvas boundaries
            if (labelX < 0) {
              labelX = 0;
            } else if (labelX + labelWidth > CHART_WIDTH) {
              labelX = CHART_WIDTH - labelWidth;
            }

            return (
              <SkiaText
                key={index}
                x={labelX}
                y={chartHeight + 20}
                text={label}
                font={fontXAxis}
                color="#000"
              />
            );
          })}
        </Group>
      </Canvas>
    </View>
  );
};

export default TransactionCard;
