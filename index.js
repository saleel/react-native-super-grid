/* eslint react/no-array-index-key: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, ViewPropTypes, FlatList } from 'react-native';
import { chunkArray } from './utils';

class SuperGrid extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.getDimensions = this.getDimensions.bind(this);
    this.state = this.getDimensions();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.itemDimension !== this.props.itemDimension) {
      this.setState({
        ...this.getDimensions(this.state.totalDimension, nextProps.itemDimension),
      });
    }
  }

  onLayout(e) {
    const { staticDimension, horizontal, onLayout } = this.props;
    if (!staticDimension) {
      const { width, height } = e.nativeEvent.layout || {};

      this.setState({
        ...this.getDimensions(horizontal ? height : width),
      });
    }
    if (typeof onLayout === 'function') {
      onLayout(e);
    }
  }

  getDimensions(lvDimension, itemDim) {
    const { itemWidth, spacing, fixed, staticDimension, horizontal } = this.props;
    let itemDimension = itemDim || this.props.itemDimension;
    if (itemWidth) {
      itemDimension = itemWidth;
      console.warn('React Native Super Grid - property "itemWidth" is depreciated. Use "itemDimension" instead.');
    }

    const dimension = horizontal ? 'height' : 'width';
    const totalDimension = lvDimension || staticDimension || Dimensions.get('window')[dimension];
    const itemTotalDimension = itemDimension + spacing;
    const availableDimension = totalDimension - spacing; // One spacing extra
    const itemsPerRow = Math.floor(availableDimension / itemTotalDimension);
    const containerDimension = availableDimension / itemsPerRow;

    return {
      totalDimension,
      itemDimension,
      spacing,
      itemsPerRow,
      containerDimension,
      fixed,
    };
  }

  getHorizontalRowStyles(isLast) {
    const { itemDimension, spacing, containerDimension, fixed } = this.state;
    const rowStyle = {
      flexDirection: 'column',
      paddingTop: spacing,
      paddingRight: spacing,
    };
    if (isLast) {
      rowStyle.marginRight = spacing;
    }
    const itemContainerStyle = {
      justifyContent: 'center',
      height: containerDimension,
      paddingBottom: spacing,
    };
    let itemStyle = {};
    if (fixed) {
      itemStyle = {
        height: itemDimension,
        justifyContent: 'center',
      };
      delete itemContainerStyle.paddingBottom;
    }

    return { rowStyle, itemContainerStyle, itemStyle };
  }

  getVerticalRowStyles(isLast) {
    const { itemDimension, containerDimension, spacing, fixed } = this.state;
    const rowStyle = {
      flexDirection: 'row',
      paddingLeft: spacing,
      paddingBottom: spacing,
    };
    if (isLast) {
      rowStyle.marginBottom = spacing;
    }
    const itemContainerStyle = {
      flexDirection: 'column',
      justifyContent: 'center',
      width: containerDimension,
      paddingRight: spacing,
    };
    const itemStyle = fixed
        ? {
          width: itemDimension,
          alignSelf: 'center',
        }
        : {};
    return { rowStyle, itemContainerStyle, itemStyle };
  }

  getItemKey(chunkKey, item, index) {
    if (item.key) return item.key;
    return typeof this.props.keyExtractor === 'function'
            ? this.props.keyExtractor(item)
            : `${chunkKey}_${index}`;
  }
  getRowKey(chunk, index) {
    return typeof this.props.keyExtractor === 'function'
            ? chunk.map(this.props.keyExtractor).join('-')
            : `row_${index}`;
  }

  // item is array of items which go in one row
  renderRow({ item: chunk, index: rowIndex, separators }) {
    const { horizontal } = this.props;
    const { rowStyle, itemContainerStyle, itemStyle } =
        horizontal
            ? this.getHorizontalRowStyles(chunk.isLast)
            : this.getVerticalRowStyles(chunk.isLast);

    return (
      <View style={rowStyle}>
        {(chunk || []).map((item, index) => {
          const key = this.getItemKey(chunk.key, item, index);
          return (
            <View key={key} style={itemContainerStyle}>
              <View style={itemStyle}>
                {this.props.renderItem({
                  item,
                  index,
                  separators,
                  rowIndex,
                  dimensions: this.state,
                })}
              </View>
            </View>
          );
        },
        )}
      </View>
    );
  }

  render() {
    const {
        fixed, itemDimension, renderItem, keyExtractor, onLayout, // eslint-disable-line
        items, style, spacing, horizontal, ...props
    } = this.props;

    const { itemsPerRow } = this.state;

    const chunked = chunkArray(items, itemsPerRow);
    const rows = chunked.map((r, i) => {
      const keyedRow = [...r];
      keyedRow.key = this.getRowKey(keyedRow, i);
      keyedRow.isLast = (chunked.length - 1 === i);
      return keyedRow;
    });

    const adjustSpacingStyle = horizontal ? { paddingLeft: spacing } : { paddingTop: spacing };

    return (
      <FlatList
        data={rows}
        renderItem={this.renderRow}
        style={[adjustSpacingStyle, style]}
        onLayout={this.onLayout}
        horizontal={horizontal}
        {...props}
      />
    );
  }
}

SuperGrid.propTypes = {
  renderItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  keyExtractor: PropTypes.func,
  onLayout: PropTypes.func,
  itemDimension: PropTypes.number,
  itemWidth: PropTypes.number, // for backward compatibility
  fixed: PropTypes.bool,
  spacing: PropTypes.number,
  style: ViewPropTypes.style,
  staticDimension: PropTypes.number,
  horizontal: PropTypes.bool,
};

SuperGrid.defaultProps = {
  fixed: false,
  itemDimension: 120,
  itemWidth: null,
  spacing: 10,
  style: {},
  staticDimension: undefined,
  horizontal: false,
  keyExtractor: undefined,
  onLayout: undefined,
};

export default SuperGrid;
