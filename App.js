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

class Login extends Component {
  componentDidMount() {
    const { navigation: { dispatch } } = this.props;

    /* ... add your own login logic here ... */

    let opt = {
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "App",
          params: { title: "Index" }
        })
      ]
    };

    // redirect to the main application
    dispatch(NavigationActions.reset(opt));
  }

  render() {
    return null;
  }
}

const AppNavigator = StackNavigator(
  {
    Index: { screen: Index },
    Search: { screen: Search }
  },
  {
    initialRouteName: "Index",
    navigationOptions: ({ navigation: { state } }) => ({
      title: state.params && state.params.title
    })
  }
);

const RootNavigator = StackNavigator(
  {
    Login: { screen: Login },
    App: { screen: AppNavigator }
  },
  {
    headerMode: "none"
  }
);

class NavigationStore {
  @observable.ref navigationState = {
    index: 0,
    routes: [
      {
        key: "Login",
        routeName: "Login",
        params: { title: "Login" }
      }
    ]
  };

  @action dispatch = (action, stackNavState = true) => {
    const previousNavState = stackNavState ? this.navigationState : null;
    return (this.navigationState = RootNavigator.router.getStateForAction(
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
      <RootNavigator
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
