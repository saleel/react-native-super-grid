/* eslint react/no-array-index-key: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, ViewPropTypes, SectionList } from 'react-native';
import { chunkArray } from './utils';

/**
 * This class is a modification on the main super grid class. It renders a vertical scrolling grid SectionList
 */
class SuperGridSectionList extends Component {
  constructor(props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);
    this.renderHorizontalRow = this.renderHorizontalRow.bind(this);
    this.getDimensions = this.getDimensions.bind(this);
    this.state = this.getDimensions();
  }

  //Resetting the dimensions if the decice has changed orientation
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

  renderHorizontalRow({item, index, section, separators}) {
    const { itemDimension, containerDimension, spacing, fixed, sections, itemsPerRow } = this.state;
    const rowStyle = {
      flexDirection: 'row',
      paddingLeft: spacing,
      paddingBottom: spacing,
    };
    if (item.isLast) {
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
        {(item || []).map((itemObject, i) => (
          <View key={`${item.key}_${i}`} style={itemContainerStyle}>
            <View style={itemStyle}>
              {this.props.renderItem({item: itemObject, index: i + (item.rowNumber * itemsPerRow), separators: separators, section: section })}
            </View>
          </View>
        ))}
      </View>
    );
  }

  render() {
    const { sections, style, spacing, fixed, itemDimension, renderItem, renderSectionHeader, ...props } = this.props;
    const { itemsPerRow } = this.state;

    //Deep copy, so that re-renders and chunkArray functions don't affect the actual items object
    let sectionsCopy = JSON.parse(JSON.stringify(sections)); 

    //Going through all the sections in sectionsCopy, and dividing their 'data' fields into smaller 'chunked' arrays to represent rows
    for (sectionsPair of sectionsCopy){
      const chunked = chunkArray(sectionsPair.data, itemsPerRow);
      const rows = chunked.map((r, i) => {
        const keydRow = [...r];
        keydRow.key = `row_${i}`;
        keydRow.rowNumber = i;
        keydRow.isLast = (chunked.length - 1 === i);
        return keydRow;
      });
      sectionsPair.data = rows;
    }
    console.log(sectionsCopy);

    return (
      <SectionList
        sections={sectionsCopy}
        renderSectionHeader = {renderSectionHeader}
        renderItem={this.renderHorizontalRow}
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

SuperGridSectionList.propTypes = {
  renderItem: PropTypes.func.isRequired,
  sections: PropTypes.arrayOf(PropTypes.any).isRequired,
  itemDimension: PropTypes.number,
  itemWidth: PropTypes.number, // for backward compatibility
  fixed: PropTypes.bool,
  spacing: PropTypes.number,
  style: ViewPropTypes.style,
  staticDimension: PropTypes.number,
};

SuperGridSectionList.defaultProps = {
  fixed: false,
  itemDimension: 120,
  itemWidth: null,
  spacing: 10,
  style: {},
  staticDimension: undefined,
};

export default SuperGridSectionList;
