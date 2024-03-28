import React, { forwardRef, memo, useMemo } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { generateStyles } from './utils';
import useRenderRow from './hooks/useRenderRow';
import useDimensions from './hooks/useDimensions';
import useRows from './hooks/useRows';


const FlatGrid = memo(
  forwardRef((props, ref) => {
    const {
      style,
      spacing,
      fixed,
      data,
      itemDimension,
      renderItem,
      horizontal,
      onLayout: _,
      staticDimension,
      maxDimension,
      additionalRowStyle: externalRowStyle,
      itemContainerStyle,
      keyExtractor: customKeyExtractor,
      invertedRow,
      maxItemsPerRow,
      adjustGridToStyles,
      customFlatList: FlatListComponent = FlatList,
      onItemsPerRowChange,
      ...restProps
    } = props;

    // eslint-disable-next-line react/prop-types
    if (props.items && !props.data) {
      // eslint-disable-next-line no-console
      throw new Error('React Native Super Grid - Prop "items" has been renamed to "data" in version 4');
    }

    const {
      onLayout,
      totalDimension,
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
      <FlatListComponent
        data={rows}
        ref={ref}
        extraData={totalDimension}
        renderItem={({ item, index }) => renderRow({
          rowItems: item,
          rowIndex: index,
          isLastRow: index === rows.length - 1,
          itemsPerRow,
          rowStyle,
          containerStyle,
          containerFullWidthStyle,
        })
        }
        style={[
          {
            ...(horizontal
              ? { paddingLeft: spacing }
              : { paddingTop: spacing }),
          },
          style,
        ]}
        onLayout={onLayout}
        keyExtractor={keyExtractor}
        {...restProps}
        horizontal={horizontal}
      />
    );
  }),
);


FlatGrid.displayName = 'FlatGrid';

FlatGrid.propTypes = {
  renderItem: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  itemDimension: PropTypes.number,
  maxDimension: PropTypes.number,
  fixed: PropTypes.bool,
  spacing: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  additionalRowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  itemContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  staticDimension: PropTypes.number,
  horizontal: PropTypes.bool,
  onLayout: PropTypes.func,
  keyExtractor: PropTypes.func,
  listKey: PropTypes.string,
  invertedRow: PropTypes.bool,
  maxItemsPerRow: PropTypes.number,
  adjustGridToStyles: PropTypes.bool,
  onItemsPerRowChange: PropTypes.func,
  customFlatList: PropTypes.elementType,
};

FlatGrid.defaultProps = {
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
  customFlatList: undefined,
};


export default FlatGrid;
