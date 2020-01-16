/**
 * Model representation of a rule, in key:value format
 */

export class KeyValueIndexSig {
  [key: string]: string;

  /**
   *  Gets the key for the corresponding KeyValue Index Signature
   * @param kvIndex The KeyValue Index Signature to get the key from
   */

  public static getKey(kvIndex: KeyValueIndexSig): string {
    return Object.keys(kvIndex)[0];
  }

  /**
   *  Gets the value for the corresponding KeyValue Index Signature
   * @param kvIndex The KeyValue Index Signature to get the value from
   */

  public static getValue(kvIndex: KeyValueIndexSig): string {
    return kvIndex[this.getKey(kvIndex)];
  }

  /**
   * Sets the key for the corresponding KeyValue Index Signature
   * @param key The new key to be set
   * @param kvIndex The KeyValue index signature to set the new key for
   */

  public static setKey(
    key: string,
    kvIndex: KeyValueIndexSig
  ): KeyValueIndexSig {
    const newkvIndex = {};
    newkvIndex[key] = this.getValue(kvIndex);
    return newkvIndex as KeyValueIndexSig;
  }

  /**
   * Sets the value for the corresponding KeyValue Index Signature
   * @param value The new value to be set
   * @param kvIndex The KeyValue index signature to set the new value for
   */

  public static setValue(
    value: string,
    kvIndex: KeyValueIndexSig
  ): KeyValueIndexSig {
    const newkvIndex = {};
    newkvIndex[this.getKey(kvIndex)] = value;
    return newkvIndex as KeyValueIndexSig;
  }
}
