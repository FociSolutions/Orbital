export default class Json {
  /**
   * Converts maps into objects with properties and values representing
   * the map data. Recurses through an object to apply the change on all levels
   */
  public static mapToObject(o: object): object {
    if (o instanceof Map) {
      const obj = Object.create(null);
      const m: Map<string, any> = o;
      for (const k of m.keys()) {
        obj[k] = m.get(k);
      }
      return obj;
    }
    const keys = Object.keys(o);
    for (const key of keys) {
      if (o[key] instanceof Object) {
        o[key] = Json.mapToObject(o[key]);
      }
    }
    return o;
  }

  /**
   * Function to convert an object back to a map.
   * @param o The object to convert to a map
   */
  public static objectToMap(o: object): Map<string, any> {
    const map = new Map<string, any>();
    for (const key of Object.keys(o)) {
      map.set(key, o[key]);
    }
    return map;
  }
}
