
export type I = true;
export type O = false;

export type Bin = I | O;

export type Integer = Bin[];

export type Fill<L extends number, T extends Bin, TAgg extends Integer = []> = TAgg["length"] extends L ? TAgg : Fill<L, T, [T, ...TAgg]>;

export type Cast<T extends Integer, L extends number, TAgg extends Integer = []> =
    TAgg["length"] extends L
    ? TAgg
    : T extends [...infer Rest extends Integer, infer Bit extends Bin]
    ? Cast<Rest, L, [Bit, ...TAgg]>
    : TAgg extends [infer Bit extends Bin, ...Integer]
    ? Cast<T, L, [Bit, ...TAgg]>
    : Cast<T, L, [O, ...TAgg]>

type Mapping = {
    "0": [];
    "1": [I];
    "2": [I, O];
    "3": [I, I];
    "4": [I, O, O];
    "5": [I, O, I];
    "6": [I, I, O];
    "7": [I, I, I];
    "8": [I, O, O, O];
    "9": [I, O, O, I];
    "10": [I, O, I, O];
}

type ToNumber<K extends keyof Mapping> = [O, ...Mapping[K]];
type ToString<V extends Integer> = {
    [K in keyof Mapping]: V extends [...O[] ,...Mapping[K]] ? K : never;
}[keyof Mapping];

type AND<A extends Bin, B extends Bin> = A | B extends I ? I : O;
type NAND<A extends Bin, B extends Bin> = A | B extends I ? O : I;
type OR<A extends Bin, B extends Bin> = A | B extends O ? O : I;
type NOT<A extends Bin> = A extends I ? O : I;
type XOR<A extends Bin, B extends Bin> = A extends B ? O : I;

export type LeftBit<T extends Integer> = T extends [infer Bit, ...Integer] ? Bit : O;
export type RightBit<T extends Integer> = T extends [...Integer, infer Bit] ? Bit : O;

export type LSH<T extends Integer> = T extends [Bin, ...infer Rest] ? [...Rest, O] : never;
export type RSH<T extends Integer> = T extends [...infer Rest, Bin] ? [O, ...Rest] : never;

export type ALSH<T extends Integer> = T extends [infer Bit0, infer Bit1,  ...infer Rest] ? Bit0 extends Bit1 ? [Bit1, ...Rest, O] : [Bit0, Bit1, ...Rest, O] : never;
export type ARSH<T extends Integer> = T extends [infer Sign, ...infer Rest, Bin] ? [Sign, Sign, ...Rest] : never;

export type Truthy<T extends Integer> = T extends [...infer Rest extends Integer, infer Bit] ? Bit extends I ? I : Truthy<Rest> : O;

type Negate<T extends Integer> = T extends [...infer Rest extends Integer, infer Bit extends Bin] ? [...Negate<Rest>, NOT<Bit>] : [];
export type Negative<T extends Integer> = Add<Negate<T>, Fill<T["length"], O, [I]>>;

type _Add<
  A extends Integer,
  B extends Integer,
  C extends Bin,
  LA0 extends Bin = O,
  LB0 extends Bin = O,
> =
  A extends [...infer ARS extends Integer, infer A0 extends Bin]
    ? B extends [...infer BRS extends Integer, infer B0 extends Bin]
        ? [..._Add<ARS, BRS, OR<AND<XOR<A0, B0>, C>, AND<A0, B0>>, A0, B0>, XOR<XOR<A0, B0>, C>]
        : _Add<A, [LB0], C> // retry with widened B
    : B extends []
        ? [C]
        : _Add<[LA0], B, C> // retry with widened A;

export type Add<A extends Integer, B extends Integer> = _Add<A, B, O> extends [Bin, ...infer Result extends Integer] ? Result : never;
export type AddWithCarry<A extends Integer, B extends Integer> = _Add<A, B, O>;
export type Subtract<A extends Integer, B extends Integer> = _Add<A, Negate<B>, I>;

type Booth<A extends Integer, S extends Integer, P extends Integer, Times extends number, TAgg extends number[] = []> =
    TAgg["length"] extends Times
        ? P extends [...infer Result, Bin] ? Result : never
        : Booth<
            A, S,
            ARSH<
                P extends [...Integer, infer P1, infer P0]
                    ? P0 extends P1
                    ? P
                    : P0 extends I
                    ? Add<P, A>
                    : Add<P, S>
                    : never
            > extends infer NP extends Integer ? NP : never,
            Times,
            [...TAgg, 0]
        >;

export type Multiply<M extends Integer, R extends Integer, N extends Integer = Negative<M>> = Booth<
    [M[0], ...M, ...Fill<R["length"], O>, O] extends infer A extends Integer ? A : never,
    [N[0], ...N, ...Fill<R["length"], O>, O] extends infer S extends Integer ? S : never,
    [O, ...Fill<M["length"], O>, ...R, O] extends infer P extends Integer ? P : never,
    R["length"]
>;

type Inc<T extends Integer> = Add<[O, ...T], [...Fill<T["length"], O>, I] extends infer One extends Integer ? One : never>

// A is positive
// B is negative
type RSub<A extends Integer, B extends Integer, Q extends Integer = ToNumber<"0">> =
    Add<A, B> extends infer NewA extends Integer
    ? LeftBit<NewA> extends I
    ? [Q, A]
    : Truthy<NewA> extends O
    ? [Inc<Q>, O]
    : RSub<NewA, B, Inc<Q>>
    : never

export type Divide<A extends Integer, B extends Integer, AN = LeftBit<A>, BN = LeftBit<B>> =
    AN extends I
    ? BN extends I
        ? RSub<Negative<A>, B> extends [infer Q, infer R extends Integer] ? [Q, Negative<R>] : never
        : RSub<Negative<A>, Negative<B>> extends [infer Q extends Integer, infer R extends Integer] ? [Negative<Q>, Negative<R>] : never
    : BN extends I
        ? RSub<A, B> extends [infer Q extends Integer, infer R] ? [Negative<Q>, R] : never
        : RSub<A, Negative<B>>

type ParsePositive<T extends string, TAgg extends Integer = ToNumber<"0">> =
    T extends `${infer X extends keyof Mapping}${infer Rest}`
    ? ParsePositive<
        Rest,
        Multiply<TAgg, ToNumber<"10">> extends infer M extends Integer ?
        Add<
            M,
            Fill<M["length"], O, ToNumber<X>>
        > : never
    >
    : TAgg;

export type Atoi<T extends string> = T extends `-${infer X}` ? Negative<ParsePositive<X>> : ParsePositive<T>;

type _Itoa<T extends Integer> =
    Divide<T, ToNumber<"10"> extends infer D extends Integer ? D : never> extends [infer Quotient extends Integer, infer Remainder extends Integer]
        ? Truthy<Quotient> extends I
            ? `${Itoa<Quotient>}${ToString<Remainder>}`
            : ToString<Remainder>
        : never
export type Itoa<T extends Integer> = LeftBit<T> extends I ? `-${_Itoa<Negative<T>>}` : _Itoa<T>;

export type Trim<T extends Integer> =
    T extends [infer Bit extends Bin, ...Integer]
    ? T extends [Bit, Bit, ...infer Rest extends Integer]
    ? Trim<[Bit, ...Rest]>
    : T
    : T;