import { action, observable } from "mobx";

export default class NavigationStore {
  @observable.ref navigationState = {
    index: 0,
    routes: [{ key: "Index", routeName: "Index" }]
  };

  @action dispatch = (action, stackNavState = true) => {
    const previousNavState = stackNavState ? this.navigationState : null;
    return (this.navigationState = AppNavigator.router.getStateForAction(
      action,
      previousNavState
    ));
  };
}
