import { ConsoleLog, Message } from "./cli";

// compile with tsc to see the output
let a: ConsoleLog<Message<"HELLO">> = "";
let b: ConsoleLog<Message<"WORLD">> = "";
let c: ConsoleLog<Message<"FROM">> = "";
let d: ConsoleLog<Message<"ESVEO!">> = "";
