import { Sns } from "@escharm/sns-core";
import { createContext } from "react";

export const sns = new Sns();

const snsContext = createContext<Sns>(sns);

export default snsContext;
