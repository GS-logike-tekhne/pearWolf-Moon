import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface BarData {
  value: number;
  label?: string;
}

interface CustomBarChartProps {
  data: BarData[];
  maxValue?: number;
  color?: string;
  height?: number;
  showLabels?: boolean;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  maxValue,
  color = '#28A745',
  height = 80,
  showLabels = false
}) => {
  const { theme } = useTheme();
  const [animatedValues] = useState(
    data.map(() => new Animated.Value(0))
  );

  const max = maxValue || Math.max(...data.map(d => d.value));

  useEffect(() => {
    const animations = animatedValues.map((animVal, index) =>
      Animated.timing(animVal, {
        toValue: data[index].value / max,
        duration: 1000,
        delay: index * 100,
        useNativeDriver: false,
      })
    );

    Animated.stagger(100, animations).start();
  }, [data, max]);

  return (
    <View style={[styles.container, { height: height + 30 }]}>
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={[styles.barBackground, { height }]}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    height: animatedValues[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, height],
                    }),
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
            {showLabels && item.label && (
              <Text style={[styles.label, { color: theme.secondaryText }]}>
                {item.label}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  barBackground: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    width: '80%',
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 4,
    width: '100%' as const,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default CustomBarChart;