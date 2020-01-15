/**
 * Model representation of a rule, in key:value format
 */

export class KeyValueIndexSig {
  [key: string]: string;

  public static getKey(kvIndex: KeyValueIndexSig): string {
    return Object.keys(kvIndex)[0];
  }

  public static getValue(kvIndex: KeyValueIndexSig): string {
    return kvIndex[this.getKey(kvIndex)];
  }

  public static setKey(
    key: string,
    kvIndex: KeyValueIndexSig
  ): KeyValueIndexSig {
    let newkvIndex = {};
    newkvIndex[key] = this.getValue(kvIndex);
    return newkvIndex as KeyValueIndexSig;
  }

  public static setValue(
    value: string,
    kvIndex: KeyValueIndexSig
  ): KeyValueIndexSig {
    let newkvIndex = {};
    newkvIndex[this.getKey(kvIndex)] = value;
    return newkvIndex as KeyValueIndexSig;
  }

  public static stringify(kvIndex: KeyValueIndexSig) {
    return kvIndex as object;
  }
}
