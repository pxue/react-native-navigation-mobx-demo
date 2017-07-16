import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  addNavigationHelpers,
  StackNavigator,
  NavigationActions
} from "react-navigation";

import { observable, action } from "mobx";
import { observer } from "mobx-react";

class Search extends Component {
  updateHome = params => {
    const { state, dispatch, goBack } = this.props.navigation;
    dispatch(
      NavigationActions.setParams({
        params,
        key: state.params.parentKey
      })
    );

    goBack(null);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Search screen</Text>

        <TouchableOpacity
          onPress={() => this.updateHome({ search: "Cats", title: "Cats" })}
        >
          <Text>Search for Cats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.updateHome({ search: "Dogs", title: "Dogs" })}
        >
          <Text>Search for Dogs</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class Index extends Component {
  render() {
    const { navigate, setParams, state } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text>Index screen</Text>
        <TouchableOpacity
          onPress={() =>
            navigate("Search", { title: "Search", parentKey: state.key })}
        >
          <Text>Go to Search</Text>
        </TouchableOpacity>
        <Text>
          {state.params &&
            state.params.search &&
            `Searched for ${state.params.search}`}
        </Text>
      </View>
    );
  }
}

const AppNavigator = StackNavigator(
  {
    Index: { screen: Index },
    Search: { screen: Search }
  },
  {
    initialRouteName: "Index",
    navigationOptions: ({ navigation: { state } }) => {
      console.log("render state", state);
      return {
        title: state.params && state.params.title
      };
    }
  }
);

class NavigationStore {
  @observable.ref navigationState = {
    index: 0,
    routes: [
      {
        key: "Index",
        routeName: "Index",
        params: { title: "Index" }
      }
    ]
  };

  @action dispatch = (action, stackNavState = true) => {
    const previousNavState = stackNavState ? this.navigationState : null;
    return (this.navigationState = AppNavigator.router.getStateForAction(
      action,
      previousNavState
    ));
  };
}

@observer class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.store = new NavigationStore();
  }

  render() {
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch: this.store.dispatch,
          state: this.store.navigationState
        })}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
