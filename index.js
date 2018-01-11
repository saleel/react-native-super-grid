import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ListView, Dimensions, ViewPropTypes } from 'react-native';
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
    const { staticDimension, horizontal } = this.props;
    if (!staticDimension) {
      const { width, height } = e.nativeEvent.layout || {};

      this.setState({
        ...this.getDimensions(horizontal ? height : width),
      });
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

  renderVerticalRow(data, sectionId, rowId) {
    const { itemDimension, spacing, containerDimension, fixed } = this.state;
    const columnStyle = {
      flexDirection: 'column',
      paddingLeft: spacing,
    };
    const rowStyle = {
      height: containerDimension,
      paddingBottom: spacing,
    };
    let itemStyle = {};
    if (fixed) {
      itemStyle = {
        height: itemDimension,
        alignSelf: 'center',
        paddingBottom: spacing,
      };
    }

    return (
      <View style={columnStyle}>
        {(data || []).map((item, i) => (
          <View key={`${rowId}_${i}`} style={rowStyle}>
            <View style={itemStyle}>
              {this.props.renderItem(item, i)}
            </View>
          </View>
        ))}
      </View>
    );
  }

  renderHorizontalRow(data, sectionId, rowId) {
    const { itemDimension, containerDimension, spacing, fixed } = this.state;
    const rowStyle = {
      flexDirection: 'row',
      paddingLeft: spacing,
      paddingBottom: spacing,
    };
    const columnStyle = {
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
          <View key={`${rowId}_${i}`} style={columnStyle}>
            <View style={itemStyle}>
              {this.props.renderItem(item, i)}
            </View>
          </View>
        ))}
      </View>
    );
  }

  renderRow(data, sectionId, rowId) {
    const { horizontal } = this.props;
    if (horizontal) {
      return this.renderVerticalRow(data, sectionId, rowId);
    }
    return this.renderHorizontalRow(data, sectionId, rowId);
  }

  render() {
    const { items, style, renderItem, spacing, fixed,
      itemDimension, horizontal, ...props } = this.props;
    const { itemsPerRow } = this.state;

    const rows = chunkArray(items, itemsPerRow);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return (
      <ListView
        enableEmptySections
        style={[{ paddingTop: spacing }, style]}
        onLayout={this.onLayout}
        dataSource={ds.cloneWithRows(rows)}
        renderRow={this.renderRow}
        {...props}
        horizontal={horizontal}
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

export default SuperGrid;
