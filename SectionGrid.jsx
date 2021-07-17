import React, {
  forwardRef, memo, useCallback, useMemo, useState,
} from 'react';
import {
  View, Dimensions, SectionList,
} from 'react-native';
import PropTypes from 'prop-types';
import { generateStyles, calculateDimensions, chunkArray } from './utils';


const SectionGrid = memo(
  forwardRef((props, ref) => {
    const {
      sections,
      style,
      spacing,
      fixed,
      itemDimension,
      staticDimension,
      maxDimension,
      renderItem: originalRenderItem,
      keyExtractor,
      onLayout,
      additionalRowStyle: externalRowStyle,
      itemContainerStyle,
      ...restProps
    } = props;

    const [totalDimension, setTotalDimension] = useState(() => {
      let defaultTotalDimension = staticDimension;

      if (!staticDimension) {
        defaultTotalDimension = maxDimension || Dimensions.get('window').width;
      }

      return defaultTotalDimension;
    });

    const onLocalLayout = useCallback(
      (e) => {
        if (!staticDimension) {
          let { width: newTotalDimension } = e.nativeEvent.layout || {};

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
      [staticDimension, maxDimension, totalDimension, onLayout],
    );

    const renderRow = useCallback(
      ({
        renderItem,
        rowItems,
        rowIndex,
        section,
        itemsPerRow,
        rowStyle,
        separators,
        isFirstRow,
        containerStyle,
      }) => {
        // Add spacing below section header
        let additionalRowStyle = {};
        if (isFirstRow) {
          additionalRowStyle = {
            marginTop: spacing,
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
                  section,
                  separators,
                  rowIndex,
                })}
              </View>
            ))}
          </View>
        );
      },
      [spacing, keyExtractor, externalRowStyle, itemContainerStyle],
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
        itemDimension,
        containerDimension,
        spacing,
        fixedSpacing,
        fixed,
      }),
      [itemDimension, containerDimension, spacing, fixedSpacing, fixed],
    );

    const groupSectionsFunc = useCallback(
      (section) => {
        const chunkedData = chunkArray(section.data, itemsPerRow);
        const renderItem = section.renderItem || originalRenderItem;

        return {
          ...section,
          renderItem: ({ item, index, section }) => renderRow({
            renderItem,
            rowItems: item,
            rowIndex: index,
            section,
            isFirstRow: index === 0,
            itemsPerRow,
            rowStyle,
            containerStyle,
          }),
          data: chunkedData,
          originalData: section.data,
        };
      },
      [
        itemsPerRow,
        originalRenderItem,
        renderRow,
        rowStyle,
        containerStyle,
      ],
    );

    const groupedSections = sections.map(groupSectionsFunc);

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
      <SectionList
        onLayout={onLocalLayout}
        extraData={totalDimension}
        sections={groupedSections}
        keyExtractor={localKeyExtractor}
        style={style}
        ref={ref}
        {...restProps}
      />
    );
  }),
);


SectionGrid.displayName = 'SectionGrid';

SectionGrid.propTypes = {
  renderItem: PropTypes.func,
  sections: PropTypes.arrayOf(PropTypes.any).isRequired,
  itemDimension: PropTypes.number,
  fixed: PropTypes.bool,
  spacing: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  additionalRowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  itemContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  staticDimension: PropTypes.number,
  onLayout: PropTypes.func,
  listKey: PropTypes.string,
};

SectionGrid.defaultProps = {
  fixed: false,
  itemDimension: 120,
  spacing: 10,
  style: {},
  additionalRowStyle: undefined,
  itemContainerStyle: undefined,
  staticDimension: undefined,
  onLayout: null,
  listKey: undefined,
};


export default SectionGrid;
