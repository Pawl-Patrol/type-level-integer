import { type CharSet } from "./charset";

declare const Error: unique symbol;
type Error = typeof Error;

type Character = CharSet[number]["Char"];
type Mapping = { [K in Character]: CharSet[number] & { Char: K } };

type Property<
  Char extends Character,
  Prop extends string
> = Prop extends keyof Mapping[Char] ? Mapping[Char][Prop] : never;

type Inc<Char extends Character> = Property<Char, "Inc">;
type Dec<Char extends Character> = Property<Char, "Dec">;

type Next<Char extends Character> = CharSet[Inc<Char>]["Char"];
type Prev<Char extends Character> = CharSet[Dec<Char>]["Char"];

type ShiftLeft<Array extends Character[]> = Array extends [
  infer Head,
  ...infer Tail
]
  ? [...Tail, Head]
  : Array;

type ShiftRight<Array extends Character[]> = Array extends [
  ...infer Tail,
  infer Head
]
  ? [Head, ...Tail]
  : Array;

type ReplaceHead<
  Array extends Character[],
  NewHead extends Character
> = Array extends [Character, ...infer Rest extends Character[]]
  ? [NewHead, ...Rest]
  : Array;

type JumpRight<Program extends string> =
  Program extends `${infer Char}${infer Rest}`
    ? Char extends "]"
      ? Rest
      : Char extends "["
      ? JumpRight<Rest> extends infer P extends string
        ? JumpRight<P>
        : Error
      : JumpRight<Rest>
    : Error;

type JumpLeft<
  Program extends string,
  Current extends string
> = Program extends `${infer Char}${infer Rest}`
  ? Char extends "["
    ? JumpRight<Rest> extends infer P extends string
      ? P extends Current
        ? Rest
        : JumpLeft<Rest, Current>
      : Error
    : JumpLeft<Rest, Current>
  : Error;

type Buffer<
  Default extends Character,
  Length extends number,
  Result extends Character[] = []
> = Result["length"] extends Length
  ? Result
  : Buffer<Default, Length, [...Result, Default]>;

type Run<
  Program extends string,
  Input extends string,
  Output extends string = "",
  Memory extends Character[] = Buffer<"\x00", 100>,
  Current extends string = Program
> = Current extends `${infer Command extends string}${infer Rest extends string}`
  ? Command extends ">"
    ? Run<Program, Input, Output, ShiftLeft<Memory>, Rest>
    : Command extends "<"
    ? Run<Program, Input, Output, ShiftRight<Memory>, Rest>
    : Command extends "+"
    ? Run<Program, Input, Output, ReplaceHead<Memory, Next<Memory[0]>>, Rest>
    : Command extends "-"
    ? Run<Program, Input, Output, ReplaceHead<Memory, Prev<Memory[0]>>, Rest>
    : Command extends "."
    ? Run<Program, Input, `${Output}${Memory[0]}`, Memory, Rest>
    : Command extends ","
    ? Input extends `${infer Head extends string}${infer Tail}`
      ? Head extends Character
        ? Run<Program, Tail, Output, ReplaceHead<Memory, Head>, Rest>
        : "Input is not a valid character."
      : Run<Program, Input, Output, ReplaceHead<Memory, "\x00">, Rest>
    : Command extends "["
    ? Memory[0] extends "\x00"
      ? JumpRight<Rest> extends infer P extends string
        ? Run<Program, Input, Output, Memory, P>
        : "Missing ] bracket."
      : Run<Program, Input, Output, Memory, Rest>
    : Command extends "]"
    ? Memory[0] extends "\x00"
      ? Run<Program, Input, Output, Memory, Rest>
      : JumpLeft<Program, Rest> extends infer P extends string
      ? Run<Program, Input, Output, Memory, P>
      : "Missing [ bracket."
    : Run<Program, Input, Output, Memory, Rest>
  : Output;

export type Brainfuck<Program extends string, Input extends string = ""> = Run<
  Program,
  Input
>;
