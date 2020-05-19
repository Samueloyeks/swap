// @flow
import React, { Component, type ComponentType } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Button,
    Input,
    StatusBar,
    Platform,
    Dimensions,
    Animated,
    ScrollView
} from 'react-native';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import ListItemButton from '../components/ListItemButton';
import StickyItemButton from '../components/StickyItemButton';
// import AppIntroSlider from 'react-native-app-intro-slider';
// import {  } from 'react-native-gesture-handler';


type Props = {|
    filters: Filter[]
        |};

const FILTERS_ICON_WIDTH = 44;
const FILTERS_BUTTON_WIDTH = 130;
const SCREEN_WIDTH = Dimensions.get("screen").width;



export default class Filters extends Component {


    animatedWidth = new Animated.Value(0);

    scrollViewRef = React.createRef();

    onFiltersScroll = (event) => {
        const eventX = event.nativeEvent.contentOffset.x;
        const direction = eventX > 0 ? 1 : -1;

        const offsetX = Math.min(
            Math.abs(eventX),
            FILTERS_BUTTON_WIDTH - FILTERS_ICON_WIDTH
        );

        this.animatedWidth.setValue(FILTERS_BUTTON_WIDTH - offsetX * direction);
    };

    onScrollEndSnapToEdge = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const maxOffset = FILTERS_BUTTON_WIDTH - FILTERS_ICON_WIDTH;
        const velocityFactor = Math.abs(event.nativeEvent.velocity.x * 30);

        if (offsetX > 0 && offsetX < maxOffset / 2 - velocityFactor) {
            this.scrollViewRef.scrollTo({ x: 0 });
        } else if (
            maxOffset / 2 + velocityFactor <= offsetX &&
            offsetX < maxOffset
        ) {
            this.scrollViewRef.scrollTo({
                x: FILTERS_BUTTON_WIDTH
            });
        }
    };



    render() {
        const { filters, activeFiltersCount, activeFiltersMap,updateCategoryFilters } = this.props;
        const scrollViewPaddingLeft = FILTERS_BUTTON_WIDTH - 18;
        return (
            <View style={styles.container}>
                <View style={styles.stickyItem}>
                    <Animated.View
                        style={[
                            styles.stickyItemMask,
                            { width: this.animatedWidth, maxWidth: FILTERS_BUTTON_WIDTH }
                        ]}
                    >
                        <StickyItemButton activeFiltersCount={activeFiltersCount} />

                    </Animated.View>
                </View>
                <ScrollView
                    horizontal
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.scrollViewContent,
                        { paddingLeft: scrollViewPaddingLeft }
                    ]}
                    showsHorizontalScrollIndicator={false}
                    onScroll={this.onFiltersScroll}
                    onScrollEndDrag={this.onScrollEndSnapToEdge}
                    scrollEventThrottle={16}
                    ref={this.scrollViewRef}
                > 
                    {filters.map(filter => (  
                        <ListItemButton 
                            style={this.props.active ? styles.activeButton : styles.button}
                            onPress={() => updateCategoryFilters(filter.id)}
                            key={filter.id}
                            active={activeFiltersMap[filter.id]}
                            text={filter.category}  
                        />
                    ))}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        marginLeft: 8,
        borderRadius: 50,
        backgroundColor: "#FFF"
    },
    activeButton: {
        marginLeft: 8,
        borderRadius: 50,
        backgroundColor: "#000"
    },
    container: {
        width: SCREEN_WIDTH,
        flexDirection: "row",
        paddingLeft: 10,
        backgroundColor: "#FFF",
        paddingTop: 5,
    },
    stickyItem: {
        position: "absolute",
        zIndex: 1,
        left: 10,
        paddingRight: 8,
        backgroundColor: "transparent"
    },
    stickyItemMask: {
        minWidth: FILTERS_ICON_WIDTH,
        marginLeft: -8,
        borderRadius: 8,
        overflow: "hidden",
        paddingTop: 5
    },
    scrollView: {
        marginLeft: 10,
        backgroundColor:'#FFF',
        height:45
    },
    scrollViewContent: {
        paddingLeft: 100,
        paddingRight: 10,
        paddingBottom: 13
    },
    dropDownIcon: {
        marginRight: 6
    }
});