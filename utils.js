import { StyleSheet } from 'react-native';

function chunkArray(array = [], size) {
  if (array === []) return [];
  return array.reduce((acc, val) => {
    if (acc.length === 0) acc.push([]);
    const last = acc[acc.length - 1];
    if (last.length < size) {
      last.push(val);
    } else {
      acc.push([val]);
    }
    return acc;
  }, []);
}

function calculateDimensions({
  itemDimension,
  staticDimension,
  totalDimension,
  fixed,
  spacing,
  maxItemsPerRow,
}) {
  const usableTotalDimension = staticDimension || totalDimension;
  const availableDimension = usableTotalDimension - spacing; // One spacing extra
  const itemTotalDimension = Math.min(itemDimension + spacing, availableDimension); // itemTotalDimension should not exceed availableDimension
  const itemsPerRow = Math.min(Math.floor(availableDimension / itemTotalDimension), maxItemsPerRow || Infinity);
  const containerDimension = availableDimension / itemsPerRow;

  let fixedSpacing;
  if (fixed) {
    fixedSpacing = (totalDimension - (itemDimension * itemsPerRow)) / (itemsPerRow + 1);
  }

  return {
    itemTotalDimension,
    availableDimension,
    itemsPerRow,
    containerDimension,
    fixedSpacing,
  };
}

function adjustDimension({
  newTotalDimension,
  maxDimension,
  contentContainerStyle,
  horizontal = false,
}) {
  let sMaxDimensionXY = 'maxWidth';
  let sPaddingXY = 'paddingHorizontal';
  let sPadding1 = 'paddingLeft';
  let sPadding2 = 'paddingRight';
  if (horizontal) {
    sMaxDimensionXY = 'maxHeight';
    sPaddingXY = 'paddingVertical';
    sPadding1 = 'paddingTop';
    sPadding2 = 'paddingBottom';
  }

  // adjust for maxDimension prop
  if (maxDimension && newTotalDimension > maxDimension) {
    newTotalDimension = maxDimension;
  }

  if (contentContainerStyle) {
    contentContainerStyle = Array.isArray(contentContainerStyle) ? StyleSheet.flatten(contentContainerStyle) : contentContainerStyle;

    // adjust for maxWidth or maxHeight in contentContainerStyle
    if (contentContainerStyle[sMaxDimensionXY] && typeof contentContainerStyle[sMaxDimensionXY] === 'number' && newTotalDimension > contentContainerStyle[sMaxDimensionXY]) {
      newTotalDimension = contentContainerStyle[sMaxDimensionXY];
    }

    // subtract horizontal or vertical padding from newTotalDimension
    const padding = contentContainerStyle[sPaddingXY] || contentContainerStyle.padding;
    const padding1 = contentContainerStyle[sPadding1] || padding || 0;
    const padding2 = contentContainerStyle[sPadding2] || padding || 0;
    const space1 = (typeof padding1 === 'number' ? padding1 : 0);
    const space2 = (typeof padding2 === 'number' ? padding2 : 0);
    if (space1 || space2) {
      newTotalDimension = newTotalDimension - space1 - space2;
    }
  }

  return newTotalDimension;
};

function generateStyles({
  itemDimension,
  containerDimension,
  spacing,
  fixed,
  horizontal,
  fixedSpacing,
}) {
  let rowStyle = {
    flexDirection: 'row',
    paddingLeft: fixed ? fixedSpacing : spacing,
    paddingBottom: spacing,
  };

  let containerStyle = {
    flexDirection: 'column',
    justifyContent: 'center',
    width: fixed ? itemDimension : (containerDimension - spacing),
    marginRight: fixed ? fixedSpacing : spacing,
  };

  if (horizontal) {
    rowStyle = {
      flexDirection: 'column',
      paddingTop: fixed ? fixedSpacing : spacing,
      paddingRight: spacing,
    };

    containerStyle = {
      flexDirection: 'row',
      justifyContent: 'center',
      height: fixed ? itemDimension : (containerDimension - spacing),
      marginBottom: fixed ? fixedSpacing : spacing,
    };
  }

  return {
    containerStyle,
    rowStyle,
  };
}

export { chunkArray, calculateDimensions, generateStyles, adjustDimension };
