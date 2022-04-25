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

function getStyleDimensions(
  style,
  horizontal = false,
) {
  let space1 = 0;
  let space2 = 0;
  let maxStyleDimension = undefined;
  if (style) {
    const flatStyle = Array.isArray(style) ? StyleSheet.flatten(style) : style;
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

    if (flatStyle[sMaxDimensionXY] && typeof flatStyle[sMaxDimensionXY] === 'number') {
      maxStyleDimension = flatStyle[sMaxDimensionXY];
    }

    const padding = flatStyle[sPaddingXY] || flatStyle.padding;
    const padding1 = flatStyle[sPadding1] || padding || 0;
    const padding2 = flatStyle[sPadding2] || padding || 0;
    space1 = (typeof padding1 === 'number' ? padding1 : 0);
    space2 = (typeof padding2 === 'number' ? padding2 : 0);
  }
  return { space1, space2, maxStyleDimension };
}

function adjustDimension({
  newTotalDimension,
  maxDimension,
  contentContainerStyle,
  style,
  horizontal = false,
}) {
  const componentDimension = newTotalDimension; // keep track of initial max of component/screen
  let actualMaxDimension = newTotalDimension; // keep track of smallest max dimension

  // adjust for maxDimension prop
  if (maxDimension && newTotalDimension > maxDimension) {
    actualMaxDimension = maxDimension;
    newTotalDimension = maxDimension;
  }

  if (contentContainerStyle) {
    const { space1, space2, maxStyleDimension } = getStyleDimensions(contentContainerStyle, horizontal);
    // adjust for maxWidth or maxHeight in contentContainerStyle
    if (maxStyleDimension && newTotalDimension > maxStyleDimension) {
      actualMaxDimension = maxStyleDimension;
      newTotalDimension = maxStyleDimension;
    }
    // subtract horizontal or vertical padding from newTotalDimension
    if (space1 || space2) {
      newTotalDimension = newTotalDimension - space1 - space2;
    }
  }

  if (style) {
    const edgeSpaceDiff = (componentDimension - actualMaxDimension) / 2; // if content is floating in middle of screen get margin on either side
    const { space1, space2 } = getStyleDimensions(style, horizontal);
    // only subtract if space is greater than the margin on either side
    if (space1 > edgeSpaceDiff) {
      newTotalDimension = newTotalDimension - (space1 - edgeSpaceDiff); // subtract the padding minus any remaining margin
    }
    if (space2 > edgeSpaceDiff) {
      newTotalDimension = newTotalDimension - (space2 - edgeSpaceDiff); // subtract the padding minus any remaining margin
    }
  }

  return newTotalDimension;
}

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
