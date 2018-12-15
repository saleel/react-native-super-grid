# React Native Super Grid
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
![npm](https://img.shields.io/npm/dt/react-native-super-grid.svg?style=flat-square)




Responsive Grid View for React Native.



## Getting Started

This component renders a Grid View that adapts itself to various screen resolutions.

Instead of passing an itemPerRow argument, you pass ```itemDimension``` and each item will be rendered with a dimension size equal to or more than (to fill the screen) the given dimension.

Internally, these components use the native [FlatList](https://facebook.github.io/react-native/docs/flatlist.html) or [SectionList](https://facebook.github.io/react-native/docs/sectionlist.html).


### Installing

You can install the package via npm.

```
npm install react-native-super-grid
```

If your react native is below v0.49, install version 1.0.4 - npm install react-native-super-grid@1.0.4


### Usage (GridView)
This is a FlatList modified to have a grid layout.
```
import GridView from 'react-native-super-grid';
```
```
<GridView
  itemDimension={130}
  items={[1,2,3,4,5,6]}
  renderItem={item => (<Text>{item}</Text>)}
/>
```

### Usage (SuperGridSectionList)
This is a SectionList modified to have a grid layout.
`sections` and `renderItem` prop has same signature as of SectionList.

```
import { SuperGridSectionList } from 'react-native-super-grid';
```
```
<SuperGridSectionList
  itemDimension={130}
  sections={[
    {
      title: 'Title1',
      data: [
        { name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' },
        { name: 'PETER RIVER', code: '#3498db' }, { name: 'AMETHYST', code: '#9b59b6' },
        { name: 'WET ASPHALT', code: '#34495e' }, { name: 'GREEN SEA', code: '#16a085' },
        { name: 'NEPHRITIS', code: '#27ae60' },
      ]
    },
    {
      title: 'Title2',
      data: [
        { name: 'WISTERIA', code: '#8e44ad' }, { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
        { name: 'SUN FLOWER', code: '#f1c40f' }, { name: 'CARROT', code: '#e67e22' },
        { name: 'ALIZARIN', code: '#e74c3c' }, { name: 'CLOUDS', code: '#ecf0f1' },
      ]
    },
    {
      title: 'Title3',
      data: [
        { name: 'BELIZE HOLE', code: '#2980b9' }, { name: 'CONCRETE', code: '#95a5a6' }, { name: 'ORANGE', code: '#f39c12' },
        { name: 'PUMPKIN', code: '#d35400' }, { name: 'POMEGRANATE', code: '#c0392b' },
        { name: 'SILVER', code: '#bdc3c7' }, { name: 'ASBESTOS', code: '#7f8c8d' }
      ]
    }
  ]}
  style={styles.gridView}
  renderItem={({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemCode}>{item.code}</Text>
    </View>
  )}
  renderSectionHeader={({ section }) => (
    <Text style={{ color: 'green' }}>{section.title}</Text>
  )}
/>
```


#### Properties

| Property | Type | Default Value | Description |
|---|---|---|---|
| renderItem | Function |  | Function to render each object. Should return a react native component.  |
| items (or `sections` for SuperGridSectionList)  | Array |  | Items to be rendered. renderItem will be called with each item in this array.  |  |
| itemDimension (itemWidth if version 1.x.x) | Number | 120  | Minimum width or height for each item in pixels (virtual). |
| fixed | Boolean | false  | If true, the exact ```itemDimension``` will be used and won't be adjusted to fit the screen. |
| spacing | Number | 10 | Spacing between each item. |
| style | [FlatList](https://facebook.github.io/react-native/docs/flatlist.html) styles (Object) |  | Styles for the container. Styles for an item should be applied inside ```renderItem```. |
| itemContainerStyle | styles (Object) | | Style for the view child of the row
| staticDimension | Number | undefined | Specifies a static width or height for the GridView container. If your container dimension is known or can be calculated at runtime (via ```Dimensions.get('window')```, for example), passing this prop will force the grid container to that dimension size and avoid the reflow associated with dynamically calculating it|
| horizontal | boolean | false | If true, the grid will be scrolling horizontally **(this prop doesn't affect the SuperGridSectionList, which only scrolls vertically)** |
| onLayout | Function |  | Optional callback ran by the internal `FlatList` or `SectionList`'s `onLayout` function, thus invoked on mount and layout changes. |

Note: If you want your item to fill the height when using a horizontal grid, you should give it a height of '100%'


## Example
```
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import GridView from 'react-native-super-grid';

export default class Example extends Component {
  render() {
    // Taken from https://flatuicolors.com/
    const items = [
      { name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' },
      { name: 'PETER RIVER', code: '#3498db' }, { name: 'AMETHYST', code: '#9b59b6' },
      { name: 'WET ASPHALT', code: '#34495e' }, { name: 'GREEN SEA', code: '#16a085' },
      { name: 'NEPHRITIS', code: '#27ae60' }, { name: 'BELIZE HOLE', code: '#2980b9' },
      { name: 'WISTERIA', code: '#8e44ad' }, { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
      { name: 'SUN FLOWER', code: '#f1c40f' }, { name: 'CARROT', code: '#e67e22' },
      { name: 'ALIZARIN', code: '#e74c3c' }, { name: 'CLOUDS', code: '#ecf0f1' },
      { name: 'CONCRETE', code: '#95a5a6' }, { name: 'ORANGE', code: '#f39c12' },
      { name: 'PUMPKIN', code: '#d35400' }, { name: 'POMEGRANATE', code: '#c0392b' },
      { name: 'SILVER', code: '#bdc3c7' }, { name: 'ASBESTOS', code: '#7f8c8d' },
    ];

    return (
      <GridView
        itemDimension={130}
        items={items}
        style={styles.gridView}
        renderItem={item => (
          <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCode}>{item.code}</Text>
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  gridView: {
    paddingTop: 25,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});
```

| ![iPhone6 Portrait](/screenshots/iphone6_portrait.png?raw=true "iPhone6 Portrait")| ![iPhone6 Landscape](/screenshots/iphone6_landscape.png?raw=true "iPhone6 Landscape") |
|:---:|:---:|
| iPhone6 Portrait | iPhone6 Landscape  |

| ![iPad Air 2 Portrait](/screenshots/ipadair2_portrait.png?raw=true "iPad Air 2 Portrait") | ![iPad Air 2 Landscape](/screenshots/ipadair2_landscape.png?raw=true "iPad Air 2 Landscape") |
|:---:|:---:|
| iPad Air 2 Portrait | iPad Air 2 Landscape  |

| ![Android Portrait](/screenshots/android_portrait.png?raw=true "Android Portrait") | ![Android Landscape](/screenshots/android_landscape.png?raw=true "Android Landscape") |
|:---:|:---:|
| Android Portrait | Android Landscape  |

| ![Android Horizontal Portrait](/screenshots/android_horizontal_portrait.png?raw=true "Android Horizontal Portrait") | ![Android Horizontal Landscape](/screenshots/android_horizontal_landscape.png?raw=true "Android Horizontal Landscape") |
|:---:|:---:|
| Android Horizontal Portrait | Android Horizontal Landscape  |

| ![iPhone Horizontal Portrait](/screenshots/iphone_horizontal_portrait.png?raw=true "iPhone Horizontal Portrait")| ![iPhone Horizontal Landscape](/screenshots/iphone_horizontal_landscape.png?raw=true "iPhone Horizontal Landscape") |
|:---:|:---:|
| iPhone Horizontal Portrait | iPhone Horizontal Landscape  |

## Example Nested Grid (itemContainerStyle)

If you try to use nested grid with different number of items, you could use itemContainerStyle to change the style.
Please take a look on the follow example.

```
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import GridView from 'react-native-super-grid';

const styles = StyleSheet.create({
  gridView: {
    paddingTop: 25,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});

export default class Example extends Component {
  render() {
    // Taken from https://flatuicolors.com/
    const groupedItems = {
        'left': [
            { name: 'TURQUOISE', code: '#1abc9c' },
            { name: 'EMERALD', code: '#2ecc71' },
            { name: 'PETER RIVER', code: '#3498db' },
            { name: 'AMETHYST', code: '#9b59b6' },
            { name: 'WET ASPHALT', code: '#34495e' }
        ],
        'center': [
            { name: 'TURQUOISE', code: '#1abc9c' }
        ],
        'rigth': [
            { name: 'TURQUOISE', code: '#1abc9c' },
            { name: 'EMERALD', code: '#2ecc71' },
            { name: 'PETER RIVER', code: '#3498db' }
        ]
    }

    return (
      <GridView
          itemContainerStyle={{ justifyContent: 'flex-start' }}
          itemDimension={300}
          items={['left', 'middle', 'rigth']}
          style={styles.gridView}
          renderItem={title =>
              (
                  <GridView
                      listKey={title}
                      itemDimension={100}
                      items={groupedItems[title]}
                      style={styles.gridView}
                      renderItem={item => (
                          <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
                              <Text style={styles.itemName}>{item.name}</Text>
                              <Text style={styles.itemCode}>{item.code}</Text>
                          </View>
                      )}
                  />
              )
          }
      />
    );
  }
}
```

| ![iPad Air 2 Landscape - Nested grid](/screenshots/ipadair2_nestedgrid_itemContainerStyle.png?raw=true "iPad Air 2 Landscape - Nested grid (itemContainerStyle customization") | ![iPad Air 2 Landscape](/screenshots/ipadair2_nestedgrid.png?raw=true "iPad Air 2 Landscape - Nested grid") |
|:---:|:---:|
| iPad Air 2 Landscape - Nested grid (itemContainerStyle customization) | iPad Air 2 Landscape - Nested grid  |

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.



## Changelog

### [2.4.4] - 2018-12-15
- Added reference to the internal flatlist @acollazomayer

### [2.4.3] - 2018-07-22
- Fix deep copying issue in SectionGrid @andersonaddo

### [2.4.2] - 2018-07-21
- Add itemContainerStyle prop @KseniaSecurity

### [2.4.1] - 2018-07-07
- Add onLayout prop @ataillefer

### [2.4] - 2018-05-11
- renderItem index fix @andersonaddo

### [2.3.2] - 2018-05-23
- Typescript support for SuperGridSectionList @Anccerson

### [2.3.0] - 2018-03-17
#### Added
- Add SuperGridSectionList @andersonaddo

### [2.1.0] - 2018-03-17
#### Added
- Use FlastList instead of ListView
- Fix spacing issues

### [2.0.2] - 2018-01-11
#### Added
- Allow dynamic update of itemDimension

### [2.0.1] - 2017-12-13
#### Added
- Fixed render empty section headers Warning. @mannycolon

### [2.0.0] - 2017-12-02
#### Added
- Add ability to have a horizontal grid. @Sh3rawi


### [1.1.0] - 2017-11-03 (Target React Native 0.49+)
#### Added
- Replace view.propTypes to ViewPropTypes for 0.49+. @caudaganesh


### [1.0.4] - 2017-10-09
#### Added
- Optional staticWidth prop @thejettdurham.
- Use prop-types package instead of deprecated react's PropTypes.


### [1.0.3] - 2017-06-06
#### Added
- Pass row index to renderItem @heaversm.



## Acknowledgments

Colors in the example from https://flatuicolors.com/.

Screenshot Mockup generated from https://mockuphone.com.
