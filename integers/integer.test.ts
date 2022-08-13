import {
  Add,
  ALSH,
  ARSH,
  Atoi,
  Divide,
  I,
  Itoa,
  Multiply,
  Negative,
  O,
  Subtract,
  Trim,
} from "./integer";

// Two's complement integers with variable length
// the first bit is the sign bit
type Int0 = [O, I, O]; // 2
type Int1 = [I, O]; // -2
type Int2 = [O, I, I, O, I, O, O, I, O, I]; // 421

// string to integer
type First = Trim<Atoi<"29">>; // [O, I, I, I, O, I]
type Second = Trim<Atoi<"-13">>; // [I, O, O, I, I]

// integer to string
type Test1 = Itoa<First>; // 29
type Test2 = Itoa<Second>; // -13

// negative of integer
type Test3 = Itoa<Negative<First>>; // -29
type Test4 = Itoa<Negative<Second>>; // 13

// arithmetic right shift
type Test5 = Itoa<ARSH<First>>; // 14
type Test6 = Itoa<ARSH<Second>>; // -7

// arithmetic left shift
type Test7 = Itoa<ALSH<First>>; // 58
type Test8 = Itoa<ALSH<Second>>; // -26

// addition and subtraction
type Test9 = Itoa<Add<First, Second>>; // 16
type Test10 = Itoa<Subtract<First, Second>>; // 42

// multiplication
type Test11 = Itoa<Multiply<First, Second>>; // -377

// division with remainder
type Test12 = Itoa<Trim<Divide<First, Second>[0]>>; // -2
type Test13 = Itoa<Trim<Divide<First, Second>[1]>>; // 3
