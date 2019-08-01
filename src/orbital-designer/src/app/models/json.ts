import { stringify } from 'querystring';

export default class Json {
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

  public static objectToMap<T>(o: object, map: Map<string, T>): Map<string, T> {
    for (const key of Object.keys(o)) {
      map.set(key, o[key]);
    }
    return map;
  }
}
