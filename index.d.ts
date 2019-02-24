import * as React from "react";
import {
  ViewStyle,
  ListRenderItemInfo,
  SectionListRenderItemInfo,
  SectionListData,
  StyleProp
} from "react-native";

/**
 * React Native Super Grid Properties
 */
export interface FlatGridProps<ItemType = any> {
  /**
   * Function to render each object. Should return a react native component.
   */
  renderItem: (info: ListRenderItemInfo<ItemType>) => JSX.Element;
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
  style?: StyleProp<ViewStyle>;

  /**
   * Specifies the style about content row view
   */
  itemContainerStyle?: StyleProp<ViewStyle>;

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

  /**
   * Optional callback ran by the internal `FlatList` or `SectionList`'s `onLayout` function,
   * thus invoked on mount and layout changes.
   */
  onLayout?: Function;
}

/**
 * Responsive Grid View for React Native.
 */
export class FlatGrid<ItemType = any> extends React.Component<
  FlatGridProps<ItemType>
> {}

export interface SectionGridProps<ItemType = any> {
  renderItem: (info: SectionListRenderItemInfo<ItemType>) => JSX.Element;
  sections: ItemType;
  itemDimension?: number;
  fixed?: boolean;
  spacing?: number;
  style?: StyleProp<ViewStyle>;
  staticDimension?: number;
  renderSectionHeader?: (info: { section: SectionListData<ItemType> }) => JSX.Element;
  onLayout?: Function;
}

export class SuperGridSectionList<ItemType = any> extends React.Component<
  SectionGridProps<ItemType>
> {}
