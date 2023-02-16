type UnionToIntersection<U> = (
  U extends never ? never : (_: U) => void
) extends (_: infer I) => void
  ? I
  : never;

type SampleFromUnion<T> = UnionToIntersection<
  T extends never ? never : () => T
> extends () => infer W
  ? W
  : never;

type Switch<A, B> = SampleFromUnion<A | B> extends A ? true : false;

type One = {};
type Two = [];

type Test = Switch<One, Two>;
