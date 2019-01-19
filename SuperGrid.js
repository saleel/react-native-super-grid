import React from 'react';
import {
  View, Dimensions, ViewPropTypes, FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { chunkArray, generateStyles } from './utils';
import SuperGridSectionList from './SuperGridSectionList';


class SuperGrid extends React.Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.onLayout = this.onLayout.bind(this);

    // Calculate total dimensions and set to state
    const { horizontal } = props;
    const dimension = horizontal ? 'height' : 'width';
    const totalDimension = Dimensions.get('window')[dimension];

    this.state = {
      totalDimension,
    };
  }

  onLayout(e) {
    const { staticDimension, horizontal, onLayout } = this.props;
    const { totalDimension } = this.state;

    if (!staticDimension) {
      const { width, height } = e.nativeEvent.layout || {};
      const newTotalDimension = horizontal ? height : width;

      if (totalDimension !== newTotalDimension) {
        this.setState({
          totalDimension: newTotalDimension,
        });
      }
    }

    // call onLayout prop if passed
    if (onLayout) {
      onLayout(e);
    }
  }

  renderRow({
    rowItems,
    rowIndex,
    isLastRow,
    itemsPerRow,
    rowStyle,
    containerStyle,
  }) {
    const {
      spacing, horizontal, itemContainerStyle, renderItem,
    } = this.props;

    // To make up for the top padding
    let additionalRowStyle = {};
    if (isLastRow) {
      additionalRowStyle = {
        ...(!horizontal ? { marginBottom: spacing } : {}),
        ...(horizontal ? { marginRight: spacing } : {}),
      };
    }

    return (
      <View style={[rowStyle, additionalRowStyle]}>
        {rowItems.map((item, i) => (
          <View
            key={`item _${(rowIndex * itemsPerRow) + i}`}
            style={[containerStyle, itemContainerStyle]}
          >
            {renderItem({
              item,
              index: (rowIndex * itemsPerRow) + i,
            })}
          </View>
        ))}
      </View>
    );
  }

  render() {
    const {
      items,
      style,
      spacing,
      fixed,
      itemDimension,
      renderItem,
      horizontal,
      onLayout,
      staticDimension,
      itemContainerStyle,
      ...restProps
    } = this.props;

    const totalDimension = staticDimension || this.state.totalDimension;
    const itemTotalDimension = itemDimension + spacing;
    const availableDimension = totalDimension - spacing; // One spacing extra
    const itemsPerRow = Math.floor(availableDimension / itemTotalDimension);
    const containerDimension = availableDimension / itemsPerRow;

    const { containerStyle, rowStyle } = generateStyles({
      totalDimension,
      horizontal,
      itemDimension,
      itemTotalDimension,
      availableDimension,
      containerDimension,
      spacing,
      fixed,
      itemsPerRow,
    });

    const rows = chunkArray(items, itemsPerRow); // Splitting the data into rows

    return (
      <FlatList
        data={rows}
        renderItem={({ item, index }) => this.renderRow({
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
            ...(horizontal ? { paddingLeft: spacing } : { paddingTop: spacing }),
          },
          style,
        ]}
        onLayout={this.onLayout}
        keyExtractor={(_, index) => `row_${index}`}
        {...restProps}
        horizontal={horizontal}
      />
    );
  }
}

SuperGrid.propTypes = {
  renderItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  itemDimension: PropTypes.number,
  fixed: PropTypes.bool,
  spacing: PropTypes.number,
  style: ViewPropTypes.style,
  itemContainerStyle: ViewPropTypes.style,
  staticDimension: PropTypes.number,
  horizontal: PropTypes.bool,
  onLayout: PropTypes.func,
};

SuperGrid.defaultProps = {
  fixed: false,
  itemDimension: 120,
  spacing: 10,
  style: {},
  itemContainerStyle: undefined,
  staticDimension: undefined,
  horizontal: false,
  onLayout: null,
};

export default SuperGrid;
export { SuperGridSectionList };
