import equal from 'deep-equal';

type SwitchCallback<T> = (value: T) => boolean;
type MatchingType<T> = T | ((value: T) => boolean);
type SwitchHandler<K> = () => K | undefined;
type HandlerType<K> = K | SwitchHandler<K>;

type ElseType<K> = K extends Function ?
      () => K
      : K | (() => K);

type Node<T, K> = { 
  type: 'break'; // TODO: Separate this type into a new file
} | {
  type: 'case'; // TODO: Separate this type into a new file
  condition: MatchingType<T>;
  handler: HandlerType<K>;
} | {
  type: 'default'; // TODO: Separate this type into a new file
  handler: HandlerType<K>;
};

export class SMSwitcher<T, K = any> {
  
  private _Nodes: Node<T, K>[] = [];
  private _default?: number;
  private _else?: ElseType<K>;

  private _autoBreak: boolean = true;

  constructor({ autoBreak }: { autoBreak?: boolean } = {}) {
    this._autoBreak = autoBreak || true;
  }

  case(callback: SwitchCallback<T>, handler: SwitchHandler<K>): this
  case(callback: T, handler: SwitchHandler<K>): this
  case(callback: SwitchCallback<T>, handler: K): this
  case(callback: T, handler: K): this
  case(callback: MatchingType<T>, handler: HandlerType<K>) {
    this._Nodes.push({
      type: 'case',
      condition: callback,
      handler,
    });

    return this;
  }

  default(handler: HandlerType<K>) {

    if (this._default !== undefined) {
      throw new Error('Default already defined');
    }

    this._default = this._Nodes.length;
    this._Nodes.push({
      type: 'default',
      handler,
    });

    return this;
  }

  break() {
    if(this._autoBreak) return this;

    this._Nodes.push({
      type: 'break',
    });

    return this;
  }

  elseValue(handler: ElseType<K>): this {

    if (this._else !== undefined) {
      throw new Error('Else already defined');
    }

    this._else = handler;

    return this;
  }

  private _run(value: T, index: number = 0, matched = false): [boolean, K | undefined] {
    let result: K | undefined = undefined;

    for (let i = index; i < this._Nodes.length; i++) {
      const node = this._Nodes[i];
      if( node.type === 'break') {
        if (matched) {
          break;
        }
        continue;
      }
      
      if (!matched){
        if (node.type === 'default') continue;
        if (typeof node.condition === 'function') {
          if ((node.condition as SwitchCallback<T>)(value)) {
            matched = true;
          }
        } else {
          if (equal(value, node.condition)) {
            matched = true;
          }
        }
      }

      if (matched) {
        if (typeof node.handler === 'function') {
          result = (node.handler as SwitchHandler<K>)();
        } else {
          result = node.handler;
        }

        if (this._autoBreak || result !== undefined) {
          break;
        }
      }
    }

    return [matched, result];
  }

  async evaluate(value: T): Promise<K | undefined> {

    let [matched, result] = this._run(value);

    if (!matched && this._default !== undefined) {
      if (this._Nodes[this._default].type !== 'default') {
        throw new Error('Invalid default node');
      }

      [matched, result] = this._run(value, this._default, true);
    }

    if (result === undefined && this._else !== undefined) {
      if (typeof this._else === 'function') {
        result = this._else();
      } else {
        result = this._else as K;
      }
    }

    return result;  
  }

}

export default SMSwitcher;