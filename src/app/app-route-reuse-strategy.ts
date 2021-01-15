import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';


interface StoredRoute {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
}


/**
 * The main purpose of this route reuse strategy is that the content of the desktop windows is preserved
 * when navigating between desktop and control center.
 * Additionally, this preserves the contents of the i.e. login and sign-up.
 */
export class AppRouteReuseStrategy implements RouteReuseStrategy {
  pathReuse = ['', 'create-device', 'settings', 'sound', 'changelog', 'desktop'];
  storedPaths: { [path: string]: StoredRoute } = {};

  reset() {
    for (const storedRoute of Object.values(this.storedPaths)) {
      this.destroyHandle(storedRoute.handle);
    }
    this.storedPaths = {};
  }

  destroyHandle(handle: DetachedRouteHandle) {
    handle['componentRef']?.destroy();
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return curr.routeConfig === future.routeConfig;
  }

  /**
   * Returns whether the route should be saved.
   * @param route The currently activated route which is about to be left
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.pathReuse.includes(route.routeConfig?.path);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    this.storedPaths[route.routeConfig.path] = { snapshot: route, handle: handle };
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.shouldAttach(route) ? this.storedPaths[route.routeConfig.path]?.handle : null;
  }

  /**
   * Returns whether the retrieved route should be used instead of a requesting a new one.
   * @param route The requested new route
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (route.routeConfig == null) {
      return false;
    }
    const storedRoute = this.storedPaths[route.routeConfig.path];
    return this.childrenMatch(storedRoute?.snapshot, route);
  }

  /**
   * Checks if two routes have the same children. Apparently, this is important when going from
   * the desktop to some route in the control center, because Angular can't reuse the parent route
   * for a different child route than the one active when it was stored.
   * @param a The first route to compare
   * @param b The second route to compare
   */
  childrenMatch(a: ActivatedRouteSnapshot, b: ActivatedRouteSnapshot): boolean {
    if (!a || !b || (a.children.length !== b.children.length)) {
      return false;
    }

    for (let i = 0; i < a.children.length; i++) {
      if (a.children[i].routeConfig?.path !== b.children[i].routeConfig?.path) {
        return false;
      }
    }

    return true;
  }

}
