import equal from 'deep-equal';

type SwitchCallback<T> = (value: T) => boolean;
type MatchingType<T> = T | ((value: T) => boolean);
type SwitchHandler<K> = () => K | undefined;
type HandlerType<K> = K | SwitchHandler<K>;

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

  private _run(value: T, index: number = 0): [boolean, K | undefined] {
    let result: K | undefined = undefined;
    let matched = false;

    for (let i = index; i < this._Nodes.length; i++) {
      const node = this._Nodes[i];
      if( node.type === 'break') {
        if (matched) {
          break;
        }
        continue;
      }

      if (node.type === 'default') continue;
      
      if (!matched){
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
      const node = this._Nodes[this._default];
      if (node.type === 'default') {
        if (typeof node.handler === 'function') {
          result = (node.handler as SwitchHandler<K>)();
        } else {
          result = node.handler;
        }
      }

      if (!this._autoBreak && result === undefined) {
        [matched, result] = this._run(value, this._default + 1);
      }

    }

    return result;  
  }

}

export default SMSwitcher;