import React, {
  forwardRef, memo, useState, useCallback, useMemo,
} from 'react';
import {
  View, Dimensions, FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { chunkArray, calculateDimensions, generateStyles } from './utils';


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
      onLayout,
      staticDimension,
      maxDimension,
      additionalRowStyle: externalRowStyle,
      itemContainerStyle,
      keyExtractor,
      ...restProps
    } = props;

    if (props.items && !props.data) {
      // eslint-disable-next-line no-console
      throw new Error('React Native Super Grid - Prop "items" has been renamed to "data" in version 4');
    }

    const [totalDimension, setTotalDimension] = useState(() => {
      let defaultTotalDimension = staticDimension;

      if (!staticDimension) {
        const dimension = horizontal ? 'height' : 'width';
        defaultTotalDimension = maxDimension || Dimensions.get('window')[dimension];
      }

      return defaultTotalDimension;
    });

    const onLayoutLocal = useCallback(
      (e) => {
        if (!staticDimension) {
          const { width, height } = e.nativeEvent.layout || {};
          let newTotalDimension = horizontal ? height : width;

          if (maxDimension && newTotalDimension > maxDimension) {
            newTotalDimension = maxDimension;
          }

          if (totalDimension !== newTotalDimension) {
            setTotalDimension(newTotalDimension);
          }
        }

        // call onLayout prop if passed
        if (onLayout) {
          onLayout(e);
        }
      },
      [staticDimension, maxDimension, totalDimension, horizontal, onLayout],
    );

    const renderRow = useCallback(
      ({
        rowItems,
        rowIndex,
        separators,
        isLastRow,
        itemsPerRow,
        rowStyle,
        containerStyle,
      }) => {
        // To make up for the top padding
        let additionalRowStyle = {};
        if (isLastRow) {
          additionalRowStyle = {
            ...(!horizontal ? { marginBottom: spacing } : {}),
            ...(horizontal ? { marginRight: spacing } : {}),
          };
        }

        return (
          <View style={[rowStyle, additionalRowStyle, externalRowStyle]}>
            {rowItems.map((item, i) => (
              <View
                key={
                  keyExtractor
                    ? keyExtractor(item, i)
                    : `item_${rowIndex * itemsPerRow + i}`
                }
                style={[containerStyle, itemContainerStyle]}
              >
                {renderItem({
                  item,
                  index: rowIndex * itemsPerRow + i,
                  separators,
                  rowIndex,
                })}
              </View>
            ))}
          </View>
        );
      },
      [renderItem, spacing, keyExtractor, externalRowStyle, itemContainerStyle, horizontal],
    );

    const { containerDimension, itemsPerRow, fixedSpacing } = useMemo(
      () => calculateDimensions({
        itemDimension,
        staticDimension,
        totalDimension,
        spacing,
        fixed,
      }),
      [itemDimension, staticDimension, totalDimension, spacing, fixed],
    );

    const { containerStyle, rowStyle } = useMemo(
      () => generateStyles({
        horizontal,
        itemDimension,
        containerDimension,
        spacing,
        fixedSpacing,
        fixed,
      }),
      [horizontal, itemDimension, containerDimension, spacing, fixedSpacing, fixed],
    );

    const rows = chunkArray(data, itemsPerRow); // Splitting the data into rows


    const localKeyExtractor = useCallback(
      (rowItems, index) => {
        if (keyExtractor) {
          return rowItems
            .map((rowItem, rowItemIndex) => keyExtractor(rowItem, rowItemIndex))
            .join('_');
        }
        return `row_${index}`;
      },
      [keyExtractor],
    );


    return (
      <FlatList
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
        onLayout={onLayoutLocal}
        keyExtractor={localKeyExtractor}
        {...restProps}
        horizontal={horizontal}
      />
    );
  }),
);


FlatGrid.displayName = 'FlatGrid';

FlatGrid.propTypes = {
  renderItem: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  itemDimension: PropTypes.number,
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
};


export default FlatGrid;
