/* eslint react/no-array-index-key: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  View, Dimensions, ViewPropTypes, FlatList,
} from 'react-native';
import { chunkArray } from './utils';
import SuperGridSectionList from './SuperGridSectionList';

class SuperGrid extends React.Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.onLayout = this.onLayout.bind(this);

    const { horizontal } = props;
    const dimension = horizontal ? 'height' : 'width';
    const totalDimension = Dimensions.get('window')[dimension];

    this.state = {
      totalDimension,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {
      itemDimension, spacing, fixed, staticDimension,
    } = props;

    const totalDimension = staticDimension || state.totalDimension;
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

  onLayout(e) {
    const { staticDimension, horizontal, onLayout } = this.props;

    if (!staticDimension) {
      const { width, height } = e.nativeEvent.layout || {};

      this.setState({
        totalDimension: horizontal ? height : width,
      });
    }

    // execute onLayout prop if passed
    if (onLayout) {
      onLayout(e);
    }
  }

  renderRow({ item: rowItems }) { // item is array of items which go in one row
    const { horizontal, renderItem } = this.props;

    const {
      itemDimension, containerDimension, spacing, fixed, itemsPerRow,
    } = this.state;

    const { itemContainerStyle } = this.props;

    let rowStyle = {
      flexDirection: 'row',
      paddingLeft: spacing,
      paddingBottom: spacing,
      ...rowItems.isLast && {
        marginBottom: spacing,
      },
    };

    let containerStyle = {
      flexDirection: 'column',
      justifyContent: 'center',
      width: containerDimension,
      paddingRight: spacing,
      ...itemContainerStyle,
    };

    let itemStyle = {
      ...fixed && {
        width: itemDimension,
        alignSelf: 'center',
      },
    };

    if (horizontal) {
      rowStyle = {
        flexDirection: 'column',
        paddingTop: spacing,
        paddingRight: spacing,
        ...rowItems.isLast && {
          marginRight: spacing,
        },
      };

      containerStyle = {
        justifyContent: 'center',
        height: containerDimension,
        ...!fixed && {
          paddingBottom: spacing,
        },
        ...itemContainerStyle,
      };

      itemStyle = {
        ...fixed && {
          height: itemDimension,
          justifyContent: 'center',
        },
      };
    }

    return (
      <View style={rowStyle}>
        {(rowItems || []).map((item, i) => (
          <View key={`${rowItems.key}_${i}`} style={containerStyle}>
            <View style={itemStyle}>
              {renderItem(item, i + (rowItems.rowNumber * itemsPerRow))}
            </View>
          </View>
        ))}
      </View>
    );
  }

  render() {
    const {
      items, style, spacing, fixed, itemDimension, renderItem,
      horizontal, onLayout, ...restProps
    } = this.props;
    const { itemsPerRow } = this.state;

    const chunked = chunkArray(items, itemsPerRow); // Splitting the data into rows

    // Adding metadata to these rows
    const rows = chunked.map((r, i) => {
      const keydRow = [...r];
      keydRow.key = `row_${i}`;
      keydRow.rowNumber = i; // Assigning a row number to each row to allow proper indexing later
      keydRow.isLast = (chunked.length - 1 === i);
      return keydRow;
    });

    return (
      <FlatList
        data={rows}
        renderItem={this.renderRow}
        style={[
          { ...horizontal ? { paddingLeft: spacing } : { paddingTop: spacing } },
          style,
        ]}
        onLayout={this.onLayout}
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
