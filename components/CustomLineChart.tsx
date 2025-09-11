import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface LineData {
  value: number;
}

interface CustomLineChartProps {
  data: LineData[];
  color?: string;
  height?: number;
  strokeWidth?: number;
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  color = '#28A745',
  height = 60,
  strokeWidth = 2
}) => {
  const [animatedValue] = useState(new Animated.Value(0));

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, []);

  const generatePath = () => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = ((maxValue - point.value) / range) * 100;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <View style={[styles.container, { height }]}>
      {/* Background grid */}
      <View style={styles.grid}>
        {[0, 25, 50, 75, 100].map(y => (
          <View 
            key={y}
            style={[
              styles.gridLine, 
              { top: `${y}%` }
            ]} 
          />
        ))}
      </View>
      
      {/* Data points */}
      <View style={styles.pointsContainer}>
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = ((maxValue - point.value) / range) * 100;
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.point,
                {
                  left: `${x}%`,
                  top: `${y}%`,
                  backgroundColor: color,
                  opacity: animatedValue,
                  transform: [{
                    scale: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    })
                  }]
                }
              ]}
            />
          );
        })}
      </View>
      
      {/* Line segments */}
      <View style={styles.linesContainer}>
        {data.slice(0, -1).map((_, index) => {
          const x1 = (index / (data.length - 1)) * 100;
          const y1 = ((maxValue - data[index].value) / range) * 100;
          const x2 = ((index + 1) / (data.length - 1)) * 100;
          const y2 = ((maxValue - data[index + 1].value) / range) * 100;
          
          const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.line,
                {
                  left: `${x1}%`,
                  top: `${y1}%`,
                  width: `${length}%`,
                  backgroundColor: color,
                  height: strokeWidth,
                  transform: [
                    { rotate: `${angle}deg` },
                    { 
                      scaleX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      })
                    }
                  ],
                }
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  grid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  pointsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  point: {
    position: 'absolute' as const,
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: -3,
    marginTop: -3,
  },
  linesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  line: {
    position: 'absolute' as const,
    transformOrigin: 'left center' as const,
  },
});

export default CustomLineChart;