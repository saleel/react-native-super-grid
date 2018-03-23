/* eslint react/no-array-index-key: 0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Dimensions, ViewPropTypes, FlatList} from 'react-native';
import {chunkArray, omit} from './utils';

class SuperGrid extends Component {
    _keyExtractor = (item, index) => {
        return this.state.itemsPerRow === 1 ? this.getItemKey(item, index) : this.getRowKey(item, index);
    };

    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.getDimensions = this.getDimensions.bind(this);
        this.state = this.getDimensions();
        this.state.rows = this.createDataset(props.items);
    }

    componentWillReceiveProps(nextProps) {
        let updates = {};
        if (nextProps.itemDimension !== this.props.itemDimension) {
            updates = Object.assign({}, updates, this.getDimensions(this.state.window, nextProps.itemDimension));
        }
        if (nextProps.items !== this.props.items) {
            updates = Object.assign({}, updates, {rows: this.createDataset(nextProps.items)});
        }
        this.setState(updates);
    }

    onLayout(e) {
        const {staticDimension, onLayout} = this.props;
        if (!staticDimension) {
            const {width, height} = e.nativeEvent.layout || {};
            const dimensions = this.getDimensions({width, height});
            this.setState({
                ...dimensions,
                rows: this.createDataset(this.props.items, dimensions.itemsPerRow),
            });
        }
        if (typeof onLayout === 'function') {
            onLayout(e);
        }
    }

    getDimensions(lvDimension, itemDim) {
        const {itemWidth, spacing, fixed, staticDimension, horizontal} = this.props;
        let itemDimension = itemDim || this.props.itemDimension;
        if (itemWidth) {
            itemDimension = itemWidth;
            console.warn('React Native Super Grid - property "itemWidth" is depreciated. Use "itemDimension" instead.');
        }
        const dimensionSet = ['Width', 'Height'];
        if (horizontal) dimensionSet.reverse();
        let window = lvDimension;
        if (!window && staticDimension) {
            window = {[dimensionSet[0].toLowerCase()]: staticDimension, [dimensionSet[1].toLowerCase()]: '100%'};
        } else {
            const {width, height} = Dimensions.get('window');
            window = {width, height};
        }
        const availableDimension = window[dimensionSet[0].toLowerCase()] - spacing; // One spacing extra
        const itemSecondaryDimension = this.getAspectRatioDimension(itemDimension);
        const item = {
            [`inner${dimensionSet[0]}`]: itemDimension,
            [`inner${dimensionSet[1]}`]: itemSecondaryDimension,
            [`outer${dimensionSet[0]}`]: itemDimension + spacing,
            [`outer${dimensionSet[1]}`]: itemSecondaryDimension ? itemSecondaryDimension + spacing : undefined,
        };

        const itemsPerRow = Math.floor(availableDimension / item[`outer${dimensionSet[0]}`]);
        const containerDimension = availableDimension / itemsPerRow;
        const containerSecondaryDimension = this.getAspectRatioDimension(containerDimension) - spacing;
        const container = {
            [`inner${dimensionSet[0]}`]: containerDimension,
            [`inner${dimensionSet[1]}`]: containerSecondaryDimension,
            [`outer${dimensionSet[0]}`]: containerDimension,
            [`outer${dimensionSet[1]}`]: containerSecondaryDimension,
        };

        return {
            window,
            container,
            item,
            spacing,
            itemsPerRow,
            fixed,
        };
    }

    getAspectRatioDimension(val) {
        const {aspectRatio, horizontal} = this.props;
        if (typeof aspectRatio === 'number') {
            return horizontal ? val * aspectRatio : val / aspectRatio;
        }
    }

    getHorizontalRowStyles(isLast) {
        const {item, container, window, spacing, fixed} = this.state;
        const {outerWidth, outerHeight} = container;
        const rowStyle = {
            flexDirection: 'column',
            paddingTop: spacing,
            paddingRight: spacing,
            width: outerWidth,
        };
        if (rowStyle.width == null && !this.props.disableSafetyWidth) rowStyle.width = window.width - spacing; //fallback to some known width when items don't have explicit width

        if (isLast) rowStyle.marginRight = spacing;

        const itemContainerStyle = {
            justifyContent: 'center',
            height: outerHeight,
            paddingBottom: spacing,
        };

        let itemStyle = {flex: 1};

        if (fixed) {
            itemStyle = {
                height: item.innerHeight,
                justifyContent: 'center',
            };
            if (item.innerWidth) {
                itemStyle.width = item.innerWidth;
                delete rowStyle.width;
            }

            delete itemContainerStyle.paddingBottom;
        }

        return {rowStyle, itemContainerStyle, itemStyle};
    }

    getVerticalRowStyles(isLast) {
        const {item, container, spacing, fixed} = this.state;
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
            width: container.outerWidth,
            paddingRight: spacing,
        };
        const fixedStyle = {
            width: item.innerWidth,
            alignSelf: 'center',
        };
        if (item.innerHeight) fixedStyle.height = item.innerHeight;
        const itemStyle = fixed ? fixedStyle : {};
        if (container.outerHeight && !fixed) {
            itemContainerStyle.height = container.outerHeight;
            itemStyle.flex = 1;
        }
        return {rowStyle, itemContainerStyle, itemStyle};
    }

    getItemKey(item, index, chunkKey) {
        if (item.key) return item.key;
        return typeof this.props.keyExtractor === 'function'
            ? this.props.keyExtractor(item)
            : `${chunkKey ? chunkKey : ''}_${index}`;
    }

    getRowKey(chunk, index) {
        return typeof this.props.keyExtractor === 'function' && Array.isArray(chunk)
            ? chunk.map(this.props.keyExtractor).join('-')
            : `row_${index}`;
    }

    // item: chunk is an array of items which go in one row unless itemsPerRow===1,

    createDataset(items = this.props.items, itemsPerRow = this.state.itemsPerRow) {
        if (itemsPerRow === 1) return items;

        const chunked = chunkArray(items, itemsPerRow);
        return chunked.map((r, i) => {
            const keyedRow = [...r];
            keyedRow.isLast = chunked.length - 1 === i;
            return keyedRow;
        });
    }

    // otherwise it's an object in an original items array, automatically last in its row
    renderRow({item: chunk, index: rowIndex, separators}) {
        const {horizontal} = this.props;
        const chunkIsArray = this.state.itemsPerRow > 1 && Array.isArray(chunk);
        const isLast = chunkIsArray ? chunk.isLast : rowIndex === this.state.rows.length - 1;

        const {rowStyle, itemContainerStyle, itemStyle} = horizontal
            ? this.getHorizontalRowStyles(isLast)
            : this.getVerticalRowStyles(isLast);
        const {rows: _, ...dimensions} = this.state;
        return (
            <View style={rowStyle}>
                {chunkIsArray
                    ? chunk.map((item, index) =>
                        this.renderItem({
                            key: this.getItemKey(item, index, chunk.key),
                            item,
                            index,
                            rowIndex,
                            separators,
                            itemContainerStyle,
                            itemStyle,
                            dimensions,
                        })
                    )
                    : this.renderItem({
                        key: this.getItemKey(chunk, rowIndex),
                        item: chunk,
                        index: rowIndex,
                        rowIndex,
                        separators,
                        itemContainerStyle,
                        itemStyle,
                        dimensions,
                    })}
            </View>
        );
    }

    renderItem({key, item, index, rowIndex, separators, itemContainerStyle, itemStyle, dimensions}) {
        return (
            <View key={key} style={itemContainerStyle}>
                <View style={itemStyle}>
                    {this.props.renderItem({
                        item,
                        index,
                        separators,
                        rowIndex,
                        dimensions,
                    })}
                </View>
            </View>
        );
    }

    render() {
        const {style, spacing, horizontal, ...props} = omit(
            this.props,
            'fixed',
            'itemDimension',
            'aspectRatio',
            'renderItem',
            'keyExtractor',
            'onLayout',
            'items'
        );

        const adjustSpacingStyle = horizontal ? {paddingLeft: spacing} : {paddingTop: spacing};

        return (
            <FlatList
                data={this.state.rows}
                renderItem={this.renderRow}
                style={[adjustSpacingStyle, style]}
                onLayout={this.onLayout}
                horizontal={horizontal}
                keyExtractor={this._keyExtractor}
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
    aspectRatio: PropTypes.number,
    disableSafetyWidth: PropTypes.bool,
};

SuperGrid.defaultProps = {
    fixed: false,
    itemDimension: 120,
    itemWidth: null,
    spacing: 10,
    style: {},
    aspectRatio: undefined,
    staticDimension: undefined,
    horizontal: false,
    keyExtractor: undefined,
    onLayout: undefined,
    disableSafetyWidth: false,
};

export default SuperGrid;
