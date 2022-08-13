// https://github.com/PhilippDehler/ts-utils
type WhitspaceChars = " " | "\n" | "\t";
type ToString<T> = T extends string ? `${T}` : never;
type TrimLeftChar<T, TChar extends string> = T extends `${TChar}${infer Tail}`
  ? ToString<TrimLeftChar<Tail, TChar>>
  : ToString<T>;

type TrimRightChar<T, TChar extends string> = T extends `${infer Tail}${TChar}`
  ? ToString<TrimRightChar<Tail, TChar>>
  : ToString<T>;
type Trim<T> = TrimLeftChar<TrimRightChar<T, WhitspaceChars>, WhitspaceChars>;
// -------------------------------------------------------------------------------------

type GetTagName<T extends string> = Trim<
  T extends `${infer Name} ${infer _}` ? Name : T
>;

type Token<Tag extends string = string, Inner extends string = string> = [
  Tag,
  Inner
];

type Tokenize<
  T extends string,
  TAgg extends Token[] = [],
  EmitTAgg extends boolean = false,
  Input = Trim<T>
> = Input extends `<${infer Name}>${infer Other}`
  ? Input extends `<${Name}>${infer Inner}</${GetTagName<Name>}>${infer Rest}`
    ? Rest extends ""
      ? [...TAgg, Token<GetTagName<Name>, Inner>]
      : Tokenize<Rest, [...TAgg, Token<GetTagName<Name>, Inner>], true>
    : Tokenize<Other, [...TAgg, Token<GetTagName<Name>, never>], true>
  : EmitTAgg extends true
  ? TAgg
  : Input;

type TokenTuple<T extends Token> = T extends Token<infer Name, infer Inner>
  ? [Name, Tokenize<Inner> extends Token[] ? Parse<Tokenize<Inner>> : string]
  : never;

type Parse<T extends Token[]> = T extends [infer Head, ...infer Tail]
  ? Tail extends []
    ? Head extends Token
      ? [TokenTuple<Head>]
      : never
    : Tail extends Token[]
    ? Head extends Token<infer Name, infer Inner>
      ? [TokenTuple<Head>, ...Parse<Tail>]
      : never
    : never
  : never;

type GroupValuesByKey<
  T,
  Key extends string,
  TAgg extends any[] = []
> = T extends [infer Head, ...infer Tail]
  ? Head extends [infer Name, infer Value]
    ? Name extends Key
      ? GroupValuesByKey<
          Tail,
          Key,
          [
            ...TAgg,
            Value extends [string, any][]
              ? {
                  [K in Value[number][0]]: GroupValuesByKey<Value, K>;
                }
              : Value
          ]
        >
      : GroupValuesByKey<Tail, Key, TAgg>
    : never
  : TAgg extends [infer Single]
  ? Single
  : TAgg;

type GroupKeys<T extends [string, any][]> = {
  [K in T[number][0]]: GroupValuesByKey<T, K>;
};

export type XMLParser<
  Input extends string,
  Tokens = Tokenize<Input>
> = Tokens extends Token[] ? GroupKeys<Parse<Tokens>> : "Unable to parse XML";
