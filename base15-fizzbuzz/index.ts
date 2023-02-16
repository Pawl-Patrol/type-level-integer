export type DND = never;

type Base15 = [string[], number];
type GetBase15<T extends Base15> = T[0];
type GetBase10<T extends Base15> = T[1];
type MaxDigit = "00000000000000";
type DivisibleByFive = "" | "00000" | "0000000000";
type DivisibleByThree = "" | "000" | "000000" | "000000000" | "000000000000";

type IncrementBase15<T extends string[]> = T extends [
  infer T0 extends string,
  ...infer Rest extends string[]
]
  ? T0 extends MaxDigit
    ? ["", ...IncrementBase15<Rest>]
    : [`${T0}0`, ...Rest]
  : ["0"];

type Base10ToBase15Range<
  T extends number,
  TAgg extends any[] = [],
  Result extends string[] = [""]
> = TAgg["length"] extends T
  ? TAgg
  : Base10ToBase15Range<
      T,
      [...TAgg, [Result, TAgg["length"]]],
      IncrementBase15<Result>
    >;

type FizzBuzz<
  T extends Base15[],
  TAgg extends (string | number)[] = []
> = T extends [infer Value extends Base15, ...infer Rest extends Base15[]]
  ? GetBase15<Value>[0] extends DivisibleByFive
    ? GetBase15<Value>[0] extends DivisibleByThree
      ? FizzBuzz<Rest, [...TAgg, "FizzBuzz"]>
      : FizzBuzz<Rest, [...TAgg, "Buzz"]>
    : GetBase15<Value>[0] extends DivisibleByThree
    ? FizzBuzz<Rest, [...TAgg, "Fizz"]>
    : FizzBuzz<Rest, [...TAgg, GetBase10<Value>]>
  : TAgg;

type Range = Base10ToBase15Range<100>;
type Result = FizzBuzz<Range>;
