/* eslint react/no-array-index-key: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, ViewPropTypes, SectionList } from 'react-native';
import { chunkArray } from './utils';

class SuperGridSectionList extends Component {
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
    const { staticDimension } = this.props;
    if (!staticDimension) {
      const { width, height } = e.nativeEvent.layout || {};

      this.setState({
        ...this.getDimensions(width),
      });
    }
  }

  getDimensions(lvDimension, itemDim) {
    const { itemWidth, spacing, fixed, staticDimension } = this.props;
    let itemDimension = itemDim || this.props.itemDimension;
    if (itemWidth) {
      itemDimension = itemWidth;
      console.warn('React Native Super Grid - property "itemWidth" is depreciated. Use "itemDimension" instead.');
    }

    const dimension = 'width';
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

  renderHorizontalRow(data) {
    const { itemDimension, containerDimension, spacing, fixed } = this.state;
    const rowStyle = {
      flexDirection: 'row',
      paddingLeft: spacing,
      paddingBottom: spacing,
    };
    if (data.isLast) {
      rowStyle.marginBottom = spacing;
    }
    const itemContainerStyle = {
      flexDirection: 'column',
      justifyContent: 'center',
      width: containerDimension,
      paddingRight: spacing,
    };
    let itemStyle = {};
    if (fixed) {
      itemStyle = {
        width: itemDimension,
        alignSelf: 'center',
      };
    }

    return (
      <View style={rowStyle}>
        {(data || []).map((item, i) => (
          <View key={`${data.key}_${i}`} style={itemContainerStyle}>
            <View style={itemStyle}>
              {this.props.renderItem(item, i)}
            </View>
          </View>
        ))}
      </View>
    );
  }

  renderRow({ item }) { // item is array of items which go in one row  
    return this.renderHorizontalRow(item);
  }

  render() {
    const { items, style, spacing, fixed, itemDimension, renderItem, renderSectionHeader, ...props } = this.props;
    const { itemsPerRow } = this.state;

    const chunked = chunkArray(items, itemsPerRow);
    const rows = chunked.map((r, i) => {
      const keydRow = [...r];
      keydRow.key = `row_${i}`;
      keydRow.isLast = (chunked.length - 1 === i);
      return keydRow;
    });

    return (
      <SectionList
        data={rows}
        renderSectionHeader = {renderSectionHeader}
        renderItem={this.renderRow}
        style={[
          {paddingTop: spacing },
          style,
        ]}
        onLayout={this.onLayout}
        {...props}
      />
    );
  }
}

SuperGrid.propTypes = {
  renderItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
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
};

export default SuperGridSectionList;
