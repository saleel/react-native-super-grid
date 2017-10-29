import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { chunkArray } from './utils';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  item: {
    alignSelf: 'stretch'
  }
})

class SuperGrid extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.getDimensions = this.getDimensions.bind(this);

    const dimensions = this.getDimensions();
    this.state = {
      dimensions,
      rows: chunkArray(props.items, dimensions.itemsPerRow)
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.items !== nextProps.items) {
      const itemsPerRow = this.state.dimensions.itemsPerRow;

      this.setState({
        rows: chunkArray(nextProps.items, itemsPerRow)
      });
    }
  }

  onLayout (e) {
    if (!this.props.staticWidth) {
      const { width } = e.nativeEvent.layout || {};

      const dimensions = this.getDimensions(width)
      this.setState({
        dimensions,
        rows: chunkArray(this.props.items, dimensions.itemsPerRow)
      });
    }
  }

  getDimensions (lvWidth) {
    const { items, itemWidth, spacing, fixed, staticWidth } = this.props;
    const totalWidth = lvWidth || staticWidth || Dimensions.get('window').width;
    const itemTotalWidth = itemWidth + spacing;
    const availableWidth = totalWidth - spacing; // One spacing extra
    const itemsPerRow = Math.floor(availableWidth / itemTotalWidth);
    const containerWidth = availableWidth / itemsPerRow;

    return {
      itemWidth,
      spacing,
      itemsPerRow,
      containerWidth,
      fixed
    };
  }

  renderRow(data, sectionId, rowId) {
    const { spacing } = this.props;
    const { itemWidth, containerWidth, fixed } = this.state;

    const rowStyle = {
      paddingLeft: spacing,
      paddingBottom: spacing,
      marginBottom: spacing,
    };
    const columnStyle = {
      width: containerWidth,
      paddingRight: spacing,
    };
    let itemStyle = {};
    if (fixed) {
      itemStyle = {
        width: itemWidth,
      };
    }

    return (
      <View style={[styles.row, rowStyle]}>
        {(data.item || []).map((item, i) => (
          <View key={`${rowId}_${i}`} style={[styles.column, columnStyle]}>
            <View style={[styles.item, itemStyle]}>
              {this.props.renderItem(item, i)}
            </View>
          </View>
        ))}
      </View>
    );
  }

  render() {
    const { props, state } = this

    return (
      <FlatList
        {...props}
        style={[{ paddingTop: props.spacing }, props.style]}
        onLayout={this.onLayout}
        data={state.rows}
        renderItem={this.renderRow}
      />
    )
  }
}

SuperGrid.propTypes = {
  renderItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  itemWidth: PropTypes.number,
  fixed: PropTypes.bool,
  spacing: PropTypes.number,
  style: View.propTypes.style,
  staticWidth: PropTypes.number
};

SuperGrid.defaultProps = {
  fixed: false,
  itemWidth: 120,
  spacing: 10,
  style: {},
  staticWidth: undefined
};

export default SuperGrid;
