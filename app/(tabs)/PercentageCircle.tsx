import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PercentageCircleProps {
  percentage: number;
  radius?: number;
  strokeWidth?: number;
  duration?: number;
  color?: string;
  bgColor?: string;
  textColor?: string;
  textSize?: number;
}

 export const PercentageCircle: React.FC<PercentageCircleProps> = ({
  percentage,
  radius = 50,
  strokeWidth = 10,
  duration = 1000,
  color = '#3b82f6',
  bgColor = '#e5e7eb',
  textColor = '#1f2937',
  textSize = 20,
}) => {
  // Ensure percentage is between 0 and 100
  const validPercentage = Math.min(100, Math.max(0, percentage));
  
  // Calculate dimensions
  const size = radius * 2;
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
  const halfCircle = radius;
  
  // Animation value
  const progressValue = useSharedValue(0);
  
  // Update animation when percentage changes
  React.useEffect(() => {
    progressValue.value = withTiming(validPercentage / 100, { duration });
  }, [validPercentage, duration]);
  
  // Animated props for the progress circle
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (circumference * progressValue.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          animatedProps={animatedProps}
          transform={`rotate(-90, ${radius}, ${radius})`}
        />
      </Svg>
      
      {/* Percentage Text */}
      <View style={styles.textContainer}>
        <Text style={[styles.text, { color: textColor, fontSize: textSize }]}>
          {Math.round(validPercentage)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:"1.5%"
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});
