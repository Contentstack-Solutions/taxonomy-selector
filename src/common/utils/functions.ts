/* eslint-disable @typescript-eslint/no-explicit-any */
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { get, isEmpty, keys } from "lodash";

export function getAppLocation(sdk: UiLocation): string {
  const locations = keys(sdk?.location);
  let locationName = "";
  for (let i = 0; i <= locations.length; i++) {
    if (!isEmpty(get(sdk, `location.${locations[i]}`, undefined))) {
      locationName = locations[i];
      break;
    }
  }
  return locationName;
}

export function buildNestedStructure(taxonomies: any[]) {
  const map = new Map();
  const roots: any[] = [];

  // First, create a map of all items
  taxonomies.forEach((item: { uid: any; }) => {
    map.set(item.uid, { ...item, terms: [] });
  });

  taxonomies.forEach(item => {
    if (item.parent_uid) {
      const parent = map.get(item.parent_uid);
      if (parent) {
        parent.terms.push(map.get(item.uid));
        parent.terms.sort((a: {name: string}, b: {name: string}) => a.name.localeCompare(b.name)); // sort terms alphabetically
      }
    } else {
      roots.push(map.get(item.uid));
    }
    roots.sort((a: {name: string}, b: {name: string}) => a.name.localeCompare(b.name)); // sort parents alphabetically
  });

  return roots;
}