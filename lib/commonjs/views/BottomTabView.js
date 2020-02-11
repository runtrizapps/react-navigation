"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _native = require("@react-navigation/native");

var _reactNativeScreens = require("react-native-screens");

var _SafeAreaProviderCompat = _interopRequireDefault(require("./SafeAreaProviderCompat"));

var _ResourceSavingScene = _interopRequireDefault(require("./ResourceSavingScene"));

var _BottomTabBar = _interopRequireDefault(require("./BottomTabBar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function SceneContent({
  isFocused,
  children
}) {
  const {
    colors
  } = (0, _native.useTheme)();
  return React.createElement(_reactNative.View, {
    accessibilityElementsHidden: !isFocused,
    importantForAccessibility: isFocused ? 'auto' : 'no-hide-descendants',
    style: [styles.content, {
      backgroundColor: colors.background
    }]
  }, children);
}

class BottomTabView extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      loaded: [this.props.state.index]
    });

    _defineProperty(this, "renderTabBar", () => {
      const {
        tabBar = props => React.createElement(_BottomTabBar.default, props),
        tabBarOptions,
        state,
        navigation
      } = this.props;
      const {
        descriptors
      } = this.props;
      const route = state.routes[state.index];
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      if (options.tabBarVisible === false) {
        return null;
      }

      return tabBar(_objectSpread({}, tabBarOptions, {
        state: state,
        descriptors: descriptors,
        navigation: navigation
      }));
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      index
    } = nextProps.state;
    return {
      // Set the current tab to be loaded if it was not loaded before
      loaded: prevState.loaded.includes(index) ? prevState.loaded : [...prevState.loaded, index]
    };
  }

  render() {
    const {
      state,
      descriptors,
      lazy
    } = this.props;
    const {
      routes
    } = state;
    const {
      loaded
    } = this.state;
    return React.createElement(_SafeAreaProviderCompat.default, null, React.createElement(_reactNative.View, {
      style: styles.container
    }, React.createElement(_reactNativeScreens.ScreenContainer, {
      style: styles.pages
    }, routes.map((route, index) => {
      const descriptor = descriptors[route.key];
      const {
        unmountOnBlur
      } = descriptor.options;
      const isFocused = state.index === index;

      if (unmountOnBlur && !isFocused) {
        return null;
      }

      if (lazy && !loaded.includes(index) && !isFocused) {
        // Don't render a screen if we've never navigated to it
        return null;
      }

      return React.createElement(_ResourceSavingScene.default, {
        key: route.key,
        style: _reactNative.StyleSheet.absoluteFill,
        isVisible: isFocused
      }, React.createElement(SceneContent, {
        isFocused: isFocused
      }, descriptor.render()));
    })), this.renderTabBar()));
  }

}

exports.default = BottomTabView;

_defineProperty(BottomTabView, "defaultProps", {
  lazy: true
});

const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  pages: {
    flex: 1
  },
  content: {
    flex: 1
  }
});
//# sourceMappingURL=BottomTabView.js.map