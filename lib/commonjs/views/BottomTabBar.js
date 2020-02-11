"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = BottomTabBar;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _native = require("@react-navigation/native");

var _reactNativeSafeAreaContext = require("react-native-safe-area-context");

var _BottomTabItem = _interopRequireDefault(require("./BottomTabItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_TABBAR_HEIGHT = 50;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;
const useNativeDriver = _reactNative.Platform.OS !== 'web';

function BottomTabBar({
  state,
  navigation,
  descriptors,
  activeBackgroundColor,
  activeTintColor,
  adaptive = true,
  allowFontScaling,
  inactiveBackgroundColor,
  inactiveTintColor,
  keyboardHidesTabBar = false,
  labelPosition,
  labelStyle,
  showIcon,
  showLabel,
  style,
  tabStyle
}) {
  const {
    colors
  } = (0, _native.useTheme)();

  const [dimensions, setDimensions] = _react.default.useState(_reactNative.Dimensions.get('window'));

  const [layout, setLayout] = _react.default.useState({
    height: 0,
    width: dimensions.width
  });

  const [keyboardShown, setKeyboardShown] = _react.default.useState(false);

  const [visible] = _react.default.useState(() => new _reactNative.Animated.Value(1));

  const {
    routes
  } = state;

  _react.default.useEffect(() => {
    if (keyboardShown) {
      _reactNative.Animated.timing(visible, {
        toValue: 0,
        duration: 200,
        useNativeDriver
      }).start();
    }
  }, [keyboardShown, visible]);

  _react.default.useEffect(() => {
    const handleOrientationChange = ({
      window
    }) => {
      setDimensions(window);
    };

    const handleKeyboardShow = () => setKeyboardShown(true);

    const handleKeyboardHide = () => _reactNative.Animated.timing(visible, {
      toValue: 1,
      duration: 250,
      useNativeDriver
    }).start(({
      finished
    }) => {
      if (finished) {
        setKeyboardShown(false);
      }
    });

    _reactNative.Dimensions.addEventListener('change', handleOrientationChange);

    if (_reactNative.Platform.OS === 'ios') {
      _reactNative.Keyboard.addListener('keyboardWillShow', handleKeyboardShow);

      _reactNative.Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
    } else {
      _reactNative.Keyboard.addListener('keyboardDidShow', handleKeyboardShow);

      _reactNative.Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
    }

    return () => {
      _reactNative.Dimensions.removeEventListener('change', handleOrientationChange);

      if (_reactNative.Platform.OS === 'ios') {
        _reactNative.Keyboard.removeListener('keyboardWillShow', handleKeyboardShow);

        _reactNative.Keyboard.removeListener('keyboardWillHide', handleKeyboardHide);
      } else {
        _reactNative.Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);

        _reactNative.Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
      }
    };
  }, [visible]);

  const handleLayout = e => {
    const {
      height,
      width
    } = e.nativeEvent.layout;
    setLayout(layout => {
      if (height === layout.height && width === layout.width) {
        return layout;
      } else {
        return {
          height,
          width
        };
      }
    });
  };

  const shouldUseHorizontalLabels = () => {
    if (labelPosition) {
      return labelPosition === 'beside-icon';
    }

    if (!adaptive) {
      return false;
    }

    if (layout.width >= 768) {
      // Screen size matches a tablet
      let maxTabItemWidth = DEFAULT_MAX_TAB_ITEM_WIDTH;

      const flattenedStyle = _reactNative.StyleSheet.flatten(tabStyle);

      if (flattenedStyle) {
        if (typeof flattenedStyle.width === 'number') {
          maxTabItemWidth = flattenedStyle.width;
        } else if (typeof flattenedStyle.maxWidth === 'number') {
          maxTabItemWidth = flattenedStyle.maxWidth;
        }
      }

      return routes.length * maxTabItemWidth <= layout.width;
    } else {
      const isLandscape = dimensions.width > dimensions.height;
      return isLandscape;
    }
  };

  return _react.default.createElement(_reactNativeSafeAreaContext.SafeAreaConsumer, null, insets => _react.default.createElement(_reactNative.Animated.View, {
    style: [styles.tabBar, {
      backgroundColor: colors.card,
      borderTopColor: colors.border
    }, keyboardHidesTabBar ? {
      // When the keyboard is shown, slide down the tab bar
      transform: [{
        translateY: visible.interpolate({
          inputRange: [0, 1],
          outputRange: [layout.height, 0]
        })
      }],
      // Absolutely position the tab bar so that the content is below it
      // This is needed to avoid gap at bottom when the tab bar is hidden
      position: keyboardShown ? 'absolute' : null
    } : null, {
      height: DEFAULT_TABBAR_HEIGHT + (insets ? insets.bottom : 0),
      paddingBottom: insets ? insets.bottom : 0
    }, style],
    pointerEvents: keyboardHidesTabBar && keyboardShown ? 'none' : 'auto'
  }, _react.default.createElement(_reactNative.View, {
    style: styles.content,
    onLayout: handleLayout
  }, routes.map((route, index) => {
    const focused = index === state.index;
    const {
      options
    } = descriptors[route.key];

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true
      });

      if (!focused && !event.defaultPrevented) {
        navigation.dispatch(_objectSpread({}, _native.CommonActions.navigate(route.name), {
          target: state.key
        }));
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key
      });
    };

    const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
    const accessibilityLabel = options.tabBarAccessibilityLabel !== undefined ? options.tabBarAccessibilityLabel : typeof label === 'string' ? "".concat(label, ", tab, ").concat(index + 1, " of ").concat(routes.length) : undefined;
    return _react.default.createElement(_native.NavigationContext.Provider, {
      key: route.key,
      value: descriptors[route.key].navigation
    }, _react.default.createElement(_BottomTabItem.default, {
      route: route,
      focused: focused,
      horizontal: shouldUseHorizontalLabels(),
      onPress: onPress,
      onLongPress: onLongPress,
      accessibilityLabel: accessibilityLabel,
      testID: options.tabBarTestID,
      allowFontScaling: allowFontScaling,
      activeTintColor: activeTintColor,
      inactiveTintColor: inactiveTintColor,
      activeBackgroundColor: activeBackgroundColor,
      inactiveBackgroundColor: inactiveBackgroundColor,
      button: options.tabBarButton,
      icon: options.tabBarIcon,
      label: label,
      showIcon: showIcon,
      showLabel: showLabel,
      labelStyle: labelStyle,
      style: tabStyle
    }));
  }))));
}

const styles = _reactNative.StyleSheet.create({
  tabBar: {
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: _reactNative.StyleSheet.hairlineWidth,
    elevation: 8
  },
  content: {
    flex: 1,
    flexDirection: 'row'
  }
});
//# sourceMappingURL=BottomTabBar.js.map