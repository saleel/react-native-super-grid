import React, {
  forwardRef, memo, useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  View, Dimensions, SectionList,
} from 'react-native';
import PropTypes from 'prop-types';
import { generateStyles, calculateDimensions, chunkArray, getAdjustedTotalDimensions } from './utils';

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
      invertedRow,
      maxItemsPerRow,
      adjustGridToStyles,
      customSectionList: SectionListComponent = SectionList,
      onItemsPerRowChange,
      ...restProps
    } = props;

    const [totalDimension, setTotalDimension] = useState(() => {
      let defaultTotalDimension = staticDimension;

      if (!staticDimension) {
        defaultTotalDimension = getAdjustedTotalDimensions({totalDimension: Dimensions.get('window').width, maxDimension, contentContainerStyle: restProps.contentContainerStyle, style, adjustGridToStyles});
      }

      return defaultTotalDimension;
    });

    const onLocalLayout = useCallback(
      (e) => {
        if (!staticDimension) {
          let { width: newTotalDimension } = e.nativeEvent.layout || {};

          newTotalDimension = getAdjustedTotalDimensions({totalDimension: newTotalDimension, maxDimension, contentContainerStyle: restProps.contentContainerStyle, style, adjustGridToStyles});

          if (totalDimension !== newTotalDimension && newTotalDimension > 0) {
            setTotalDimension(newTotalDimension);
          }
        }

        // call onLayout prop if passed
        if (onLayout) {
          onLayout(e);
        }
      },
      [staticDimension, maxDimension, totalDimension, onLayout, adjustGridToStyles],
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
                    section,
                    separators,
                    rowIndex,
                  })}
                </View>
              );
            })}
          </View>
        );
      },
      [spacing, keyExtractor, externalRowStyle, itemContainerStyle, invertedRow],
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
        let chunkedData = chunkArray(section.data, itemsPerRow);

        if (invertedRow) {
          chunkedData = chunkedData.map($0 => $0.reverse());
        }

        const renderItem = section.renderItem || originalRenderItem;

        return {
          ...section,
          renderItem: ({ item, index, section: s }) => renderRow({
            renderItem,
            rowItems: item,
            rowIndex: index,
            section: s,
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

    useEffect(() => {
      if (onItemsPerRowChange) {
        onItemsPerRowChange(itemsPerRow);
      }
    }, [itemsPerRow]);

    return (
      <SectionListComponent
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
  renderItem: PropTypes.func.isRequired,
  sections: PropTypes.arrayOf(PropTypes.any).isRequired,
  itemDimension: PropTypes.number,
  fixed: PropTypes.bool,
  spacing: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  additionalRowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  itemContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  staticDimension: PropTypes.number,
  onLayout: PropTypes.func,
  maxDimension: PropTypes.number,
  listKey: PropTypes.string,
  keyExtractor: PropTypes.func,
  invertedRow: PropTypes.bool,
  maxItemsPerRow: PropTypes.number,
  adjustGridToStyles: PropTypes.bool,
  customSectionList: PropTypes.elementType
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
  maxDimension: undefined,
  invertedRow: false,
  keyExtractor: null,
  maxItemsPerRow: undefined,
  adjustGridToStyles: false,
  customSectionList: undefined
};


export default SectionGrid;
