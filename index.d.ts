import * as React from "react";
import { ScrollViewStyle, SectionListData, StyleProp } from "react-native";

/**
 * React Native Super Grid Properties
 */
export interface SuperGridProps<ItemType = any> {
  /**
   * Function to render each object. Should return a react native component.
   */
  renderItem: (item: ItemType) => JSX.Element;

  /**
   * Items to be rendered. renderItem will be called with each item in this array.
   */
  items: ItemType[];

  /**
   * Minimum width or height for each item in pixels (virtual).
   */
  itemDimension?: number;

  /**
   * If true, the exact itemDimension will be used and won't be adjusted to fit the screen.
   */
  fixed?: boolean;

  /**
   * Spacing between each item.
   */
  spacing?: number;

  /**
   * Style
   */
  style?: StyleProp<ScrollViewStyle>;

  /**
   * Specifies a static width or height for the GridView container.
   * If your container dimension is known or can be calculated at runtime
   * (via Dimensions.get('window'), for example), passing this prop will force the grid container
   * to that dimension size and avoid the reflow associated with dynamically calculating it
   */
  staticDimension?: number;

  /**
   * If true, the grid will be scrolling horizontally
   */
  horizontal?: boolean;
}

/**
 * Responsive Grid View for React Native.
 */
export default class SuperGrid<ItemType = any> extends React.Component<
  SuperGridProps<ItemType>
> {}

export interface SuperGridSectionListProps<ItemType = any> {
  renderItem: (info: { item: SectionListData<ItemType> }) => JSX.Element;
  sections: ItemType,
  itemDimension?: number,
  itemWidth?: number, // for backward compatibility
  fixed?: boolean,
  spacing?: number,
  style?: StyleProp<ScrollViewStyle>,
  staticDimension?: number,
  renderSectionHeader?: (info: { section: SectionListData<ItemType> }) => JSX.Element;
}

export class SuperGridSectionList<ItemType = any> extends React.Component<
  SuperGridSectionListProps<ItemType>
> {}
