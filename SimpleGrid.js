import React, { forwardRef, memo, useMemo } from 'react';
import { View } from 'react-native';
import { generateStyles } from './utils';
import useRenderRow from './hooks/useRenderRow';
import useDimensions from './hooks/useDimensions';
import useRows from './hooks/useRows';


const SimpleGrid = memo(
  forwardRef((props, ref) => {
    const defaultProps = {
      itemDimension: 120,
      spacing: 10,
      fixed: false,
      horizontal: false,
      invertedRow: false,
      adjustGridToStyles: false,
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
    } = { ...defaultProps, ...props };

    const {
      onLayout,
      itemsPerRow,
      containerDimension,
      fixedSpacing,
    } = useDimensions(props);

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
