export default class Yaml {
  /**
   * Converts an object into a YAML safe format for dumping
   * i.e it converts Maps and Sets into arrays and recursively
   * digs throught the object applying this change
   * Does not address functions, regex, and undefined
   * @param o Object to convert to a YAML safe format for dumping
   */
  public static collectionToArray(o: object): object {
    if (o instanceof Map || o instanceof Set) {
      return Array.from(o);
    }
    const keys = Object.keys(o);
    for (const key of keys) {
      if (o[key] instanceof Object) {
        o[key] = Yaml.collectionToArray(o[key]);
      }
    }
    return o;
  }
}
