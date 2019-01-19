import React, { Component } from 'react';
import {
  View, Dimensions, ViewPropTypes, SectionList,
} from 'react-native';
import PropTypes from 'prop-types';
import { generateStyles, chunkArray } from './utils';

class SuperGridSectionList extends Component {
  constructor(props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);
    this.renderRow = this.renderRow.bind(this);

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
    section,
    itemsPerRow,
    rowStyle,
    separators,
    isFirstRow,
    containerStyle,
  }) {
    const { spacing, itemContainerStyle, renderItem } = this.props;

    // Add spacing below section header
    let additionalRowStyle = {};
    if (isFirstRow) {
      additionalRowStyle = {
        marginTop: spacing,
      };
    }

    return (
      <View style={[rowStyle, additionalRowStyle]}>
        {rowItems.map((item, i) => (
          <View
            key={`item _${rowIndex * itemsPerRow + i}`}
            style={[containerStyle, itemContainerStyle]}
          >
            {renderItem({
              item,
              index: rowIndex * itemsPerRow + i,
              section,
              separators,
            })}
          </View>
        ))}
      </View>
    );
  }

  render() {
    const {
      sections,
      style,
      spacing,
      fixed,
      itemDimension,
      staticDimension,
      renderItem,
      renderSectionHeader,
      onLayout,
      ...props
    } = this.props;

    const totalDimension = staticDimension || this.state.totalDimension;
    const itemTotalDimension = itemDimension + spacing;
    const availableDimension = totalDimension - spacing; // One spacing extra
    const itemsPerRow = Math.floor(availableDimension / itemTotalDimension);
    const containerDimension = availableDimension / itemsPerRow;

    const { containerStyle, rowStyle } = generateStyles({
      totalDimension,
      itemDimension,
      itemTotalDimension,
      availableDimension,
      containerDimension,
      spacing,
      fixed,
      itemsPerRow,
    });

    const groupedSections = sections.map(({ title, data }) => {
      const chunkedData = chunkArray(data, itemsPerRow);

      return {
        title,
        data: chunkedData,
      };
    });

    return (
      <SectionList
        sections={groupedSections}
        renderSectionHeader={renderSectionHeader}
        renderItem={({ item, index, section }) => this.renderRow({
          rowItems: item,
          rowIndex: index,
          section,
          isFirstRow: index === 0,
          itemsPerRow,
          rowStyle,
          containerStyle,
        })
        }
        keyExtractor={(_, index) => `row_${index}`}
        style={style}
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
  fixed: PropTypes.bool,
  spacing: PropTypes.number,
  style: ViewPropTypes.style,
  itemContainerStyle: ViewPropTypes.style,
  staticDimension: PropTypes.number,
  onLayout: PropTypes.func,
};

SuperGridSectionList.defaultProps = {
  fixed: false,
  itemDimension: 120,
  spacing: 10,
  style: {},
  itemContainerStyle: undefined,
  staticDimension: undefined,
  onLayout: null,
};

export default SuperGridSectionList;
