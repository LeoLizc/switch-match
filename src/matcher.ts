import equal from 'deep-equal';


type MatchOptions = {
  autoBreak: boolean;
};

type CaseHandler<K> = () => K | undefined;
export class SMMatcher<T, K = any> {
  private _matcher: T;
  private _value?: K;

  private _autoBreak: boolean;

  private _break: boolean = false;
  private _matched: boolean = false;

  private _default?: CaseHandler<K>;
  private _defaultValue?: K;

  constructor(value: T, { autoBreak }: MatchOptions) {
    this._matcher = value;
    this._value = undefined;

    this._autoBreak = autoBreak;

  }

  case(condition: T, handler: CaseHandler<K>){

    if (this._value !== undefined || this._break) {
      return this;
    }

    let matched = false;

    if (!this._matched)
    if (typeof this._matcher === 'object') {
      matched = equal(this._matcher, condition);
    } else {
      matched = this._matcher === condition;
    }

    if (matched || this._matched) {
      this._value = handler();
      this._matched = true;
      if (this._autoBreak) {
        this._break = true;
      }
    }

    return this;
  }

  break() {
    if (this._matched) {
      this._break = true;
    }

    return this;
  }

  default(handler: CaseHandler<K>) {
    if (!this._matched) {
      this._default = handler;
    }

    return this;
  }

  defaultTo(value: K) {
    if (this._value === undefined) {
      this._defaultValue = value;
    }

    return this;
  }

  value() {
    if (this._value !== undefined) {
      return this._value;
    }

    if (!this._matched && this._default) {
      this._value = this._default();
    }

    if (this._value === undefined) {
      this._value = this._defaultValue;
    }

    return this._value;
  }

}

export function match<T, K>(value: T, { autoBreak }: MatchOptions = {autoBreak: true}): SMMatcher<T, K> {
  return new SMMatcher(
    value,
    { autoBreak }
  );
}

export default match;