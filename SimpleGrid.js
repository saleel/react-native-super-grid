import React, { forwardRef, memo, useMemo } from 'react';
import { View } from 'react-native';
import { generateStyles } from './utils';
import useRenderRow from './hooks/useRenderRow';
import useDimensions from './hooks/useDimensions';
import useRows from './hooks/useRows';

const defaultProps = {
  fixed: false,
  itemDimension: 120,
  spacing: 10,
  style: {},
  additionalRowStyle: undefined,
  itemContainerStyle: undefined,
  staticDimension: undefined,
  horizontal: false,
  onLayout: null,
  keyExtractor: null,
  listKey: undefined,
  maxDimension: undefined,
  invertedRow: false,
  maxItemsPerRow: undefined,
  adjustGridToStyles: false,
  onItemsPerRowChange: undefined,
};

const SimpleGrid = memo(
  forwardRef((props, ref) => {
    const options = {
      ...defaultProps,
      ...props,
    };

    const {
      style,
      spacing,
      fixed,
      data,
      itemDimension,
      renderItem,
      horizontal,
      additionalRowStyle: externalRowStyle,
      itemContainerStyle,
      keyExtractor: customKeyExtractor,
      invertedRow,
      onItemsPerRowChange,
      ...restProps
    } = options;

    const {
      onLayout,
      itemsPerRow,
      containerDimension,
      fixedSpacing,
    } = useDimensions(options);

    const { containerStyle, containerFullWidthStyle, rowStyle } = useMemo(
      () => generateStyles({
        horizontal,
        itemDimension,
        containerDimension,
        spacing,
        fixedSpacing,
        fixed,
        itemsPerRow,
      }),
      [horizontal, itemDimension, containerDimension, itemsPerRow, spacing, fixedSpacing, fixed],
    );

    const { rows, keyExtractor } = useRows({
      data,
      invertedRow,
      itemsPerRow,
      keyExtractor: customKeyExtractor,
      onItemsPerRowChange,
    });
    const renderRow = useRenderRow({
      renderItem,
      spacing,
      keyExtractor: customKeyExtractor,
      externalRowStyle,
      itemContainerStyle,
      horizontal,
      invertedRow,
    });

    return (
      <View
        style={[
          {
            ...(horizontal ? { paddingLeft: spacing } : { paddingTop: spacing }),
          },
          style,
        ]}
        ref={ref}
        {...restProps}
      >
        {rows.map((row, index) => (
          <View key={keyExtractor(row, index)} onLayout={onLayout}>
            {renderRow({
              rowItems: row,
              rowIndex: index,
              isLastRow: index === rows.length - 1,
              itemsPerRow,
              rowStyle,
              containerStyle,
              containerFullWidthStyle,
              separators: null,
            })}
          </View>
        ))}
      </View>
    );
  }),
);

SimpleGrid.displayName = 'SimpleGrid';

export default SimpleGrid;
