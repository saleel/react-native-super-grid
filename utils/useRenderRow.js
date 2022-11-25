import React, { useCallback } from 'react';
import { View } from 'react-native';

const useRenderRow = ({
  renderItem,
  spacing,
  keyExtractor,
  externalRowStyle,
  itemContainerStyle,
  horizontal,
  invertedRow,
}) => useCallback(
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
        {rowItems.map((item, index) => {
          const i = invertedRow ? -index + itemsPerRow - 1 : index;

          return (
            <View
              key={
                keyExtractor
                  ? keyExtractor(item, rowIndex * itemsPerRow + i)
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
          );
        })}
      </View>
    );
  },
  [renderItem, spacing, keyExtractor, externalRowStyle, itemContainerStyle, horizontal, invertedRow],
);


export default useRenderRow;
