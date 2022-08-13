import { Map } from "../lib/ts-array-utils";
import { Hkt, HKT } from "../lib/ts-hkt";
import {
  Add,
  GetNumber,
  Modulo,
  ParseTsNumber,
  Subtract,
} from "../lib/ts-number-system";
import {
  GetStringLength,
  Join,
  Repeat,
  SplitEmpty,
} from "../lib/ts-string-utils";

type LineWidth = 48;

type MessageA = "index.ts:3:7 - error TS2322: Type";
type MessageB = " '\"\"' is not assignable to type '\"";

type A = GetStringLength<MessageA>;
type B = GetStringLength<MessageB>;
type C = GetNumber<Add<ParseTsNumber<A>, ParseTsNumber<B>>>;
type D = GetNumber<Modulo<ParseTsNumber<C>, ParseTsNumber<LineWidth>>>;
type F = GetNumber<Subtract<ParseTsNumber<LineWidth>, ParseTsNumber<2>>>;

export type FillLeftover<T extends number> = Repeat<
  " ",
  GetNumber<Subtract<ParseTsNumber<LineWidth>, ParseTsNumber<T>>>
>;

type LeftoverSpace = FillLeftover<D>;
type Arrow = `<${Repeat<"-", F>}>`;
export type EmptyLine = Repeat<" ", LineWidth>;

type WriteChar<
  TChar extends keyof Letters,
  Line extends number
> = Letters[TChar][Line];

interface WriteStringHKT<Line extends number>
  extends HKT<keyof Letters, WriteChar<any, Line>> {
  [Hkt.output]: WriteChar<Hkt.Input<this>, Line>;
}

type WriteString<Message extends string, Line extends number> = Join<
  Map<SplitEmpty<Message>, WriteStringHKT<Line>>,
  "  "
>;
type WriteLine<
  Message extends string,
  Line extends number,
  TAgg extends string | null = null
> = TAgg extends null
  ? WriteLine<Message, Line, WriteString<Message, Line>>
  : `${TAgg}${FillLeftover<GetStringLength<TAgg>>}`;

interface WriteTextHKT<Message extends string>
  extends HKT<number, WriteLine<Message, number>> {
  [Hkt.output]: WriteLine<Message, Hkt.Input<this>>;
}

export type Message<Msg extends string> = Join<
  Map<[0, 1, 2, 3, 4], WriteTextHKT<Msg>>,
  ""
>;

export type ConsoleLog<Content extends string> =
  `${LeftoverSpace}${Arrow}${Content}`;

type Letters = {
  // Großbuchstaben
  A: [" AAA ", "A   A", "A   A", "AAAAA", "A   A"];
  B: ["BBBB ", "B   B", "BBBB ", "B   B", "BBBB "];
  C: [" CCCC", "C    ", "C    ", "C    ", " CCCC"];
  D: ["DDDD ", "D   D", "D   D", "D   D", "DDDD "];
  E: ["EEEEE", "E    ", "EEEE ", "E    ", "EEEEE"];
  F: ["FFFFF", "F    ", "FFFF ", "F    ", "F    "];
  G: ["GGGGG", "G    ", "G GGG", "G   G", "GGGGG"];
  H: ["H   H", "H   H", "HHHHH", "H   H", "H   H"];
  I: [" III ", "  I  ", "  I  ", "  I  ", " III "];
  J: ["JJJJJ", "    J", "    J", "J   J", "JJJJJ"];
  L: ["L    ", "L    ", "L    ", "L    ", "LLLLL"];
  M: ["M   M", "MM MM", "M M M", "M   M", "M   M"];
  O: ["OOOOO", "O   O", "O   O", "O   O", "OOOOO"];
  R: ["RRRR ", "R   R", "RRRR ", "R   R", "R   R"];
  S: ["SSSSS", "S    ", "SSSSS", "    S", "SSSSS"];
  V: ["V   V", "V   V", "V   V", " V V ", "  V  "];
  W: ["W   W", "W   W", "W W W", "W W W", " W W "];
  // Sonderzeichen
  "!": [" !!! ", " !!! ", " !!! ", "     ", " !!! "];
};
