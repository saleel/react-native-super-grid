import { useState, useCallback, useMemo } from 'react';
import { Dimensions } from 'react-native';
import {
  getAdjustedTotalDimensions,
  calculateDimensions,
} from '../utils';


const useDimensions = (props) => {
  const {
    staticDimension,
    maxDimension,
    horizontal,
    onLayout,
    adjustGridToStyles,
    contentContainerStyle,
    style,
    itemDimension,
    spacing,
    fixed,
    maxItemsPerRow,
  } = props;

  const [totalDimension, setTotalDimension] = useState(() => {
    let defaultTotalDimension = staticDimension;

    if (!staticDimension) {
      const dimension = horizontal ? 'height' : 'width';
      defaultTotalDimension = getAdjustedTotalDimensions({
        totalDimension: Dimensions.get('window')[dimension], maxDimension, contentContainerStyle, style, horizontal, adjustGridToStyles,
      });
    }

    return defaultTotalDimension;
  });

  const onLayoutLocal = useCallback(
    (e) => {
      if (!staticDimension) {
        const { width, height } = e.nativeEvent.layout || {};
        let newTotalDimension = horizontal ? height : width;

        newTotalDimension = getAdjustedTotalDimensions({
          totalDimension: newTotalDimension, maxDimension, contentContainerStyle, style, horizontal, adjustGridToStyles,
        });

        if (totalDimension !== newTotalDimension && newTotalDimension > 0) {
          setTotalDimension(newTotalDimension);
        }
      }

      // call onLayout prop if passed
      if (onLayout) {
        onLayout(e);
      }
    },
    [staticDimension, maxDimension, totalDimension, horizontal, onLayout, adjustGridToStyles],
  );


  const { containerDimension, itemsPerRow, fixedSpacing } = useMemo(
    () => calculateDimensions({
      itemDimension,
      staticDimension,
      totalDimension,
      spacing,
      fixed,
      maxItemsPerRow,
    }),
    [itemDimension, staticDimension, totalDimension, spacing, fixed, maxItemsPerRow],
  );


  return {
    totalDimension,
    onLayout: onLayoutLocal,
    containerDimension,
    itemsPerRow,
    fixedSpacing,
  };
};

export default useDimensions;
