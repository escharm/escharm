/* eslint-disable react/display-name */
"use client";
import {
  CMPTFactory,
  createAddPanelAction,
  findNodeByRules,
  LAYOUT_DIRECTION,
  LayoutNode,
  LayoutNodeActionType,
  layoutNodeToJSON,
  MASK_PART,
  PanelNode,
  ROOTID,
} from "@escharm/layout-react";

import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";

import Layout from "./components/Layout";
import Counter, { CounterProvider } from "./Counter";
import dynamic from "next/dynamic";

const GrapeLayout = dynamic(
  async () => {
    return (await import("@escharm/layout-react")).GrapeLayout;
  },
  {
    ssr: false,
  },
);

const ROOT = new LayoutNode({
  id: ROOTID,
  direction: LAYOUT_DIRECTION.ROOT,
});

ROOT.doAction(
  createAddPanelAction({
    panelNode: new PanelNode({
      id: "P_A_A",
      page: "test2",
    }),
    mask: MASK_PART.CENTER,
    target: ROOT,
  }),
);

ROOT.doAction(
  createAddPanelAction({
    panelNode: new PanelNode({
      id: "P_A_B",
      page: "test",
    }),
    mask: MASK_PART.CENTER,
    target: "P_A_A",
  }),
);

ROOT.doAction(
  createAddPanelAction({
    panelNode: new PanelNode({
      id: "P_B_A_A",
      page: "test4",
    }),
    mask: MASK_PART.BOTTOM,
    target: ROOT,
  }),
);

ROOT.doAction(
  createAddPanelAction({
    panelNode: new PanelNode({
      id: "P_B_A_B",
      page: "test",
      data: "abc",
    }),
    mask: MASK_PART.CENTER,
    target: "P_B_A_A",
  }),
);

ROOT.doAction(
  createAddPanelAction({
    panelNode: new PanelNode({
      id: "P_B_B_A",
      page: "test3",
    }),
    mask: MASK_PART.RIGHT,
    target: "P_B_A_A",
  }),
);

ROOT.doAction(
  createAddPanelAction({
    panelNode: new PanelNode({
      id: "P_B_B_B",
      page: "test",
    }),
    mask: MASK_PART.CENTER,
    target: "P_B_B_A",
  }),
);

const rules = [
  { part: MASK_PART.BOTTOM, max: 2 },
  { part: MASK_PART.RIGHT, max: 2 },
  { part: MASK_PART.TOP, max: 3, limitLevel: 1 },
  { part: MASK_PART.CENTER, max: 3 },
];

const factory: CMPTFactory = (page: string) => {
  switch (page) {
    case "test":
      return (props) => {
        const { nodeData } = props;
        const [counter, setCounter] = useState(0);
        const [radom] = useState(Math.random());
        useEffect(() => {
          const handler = setInterval(() => {
            setCounter((c) => c + 1);
          }, 1000);
          return () => {
            clearInterval(handler);
          };
        }, []);
        return (
          <div>
            {nodeData}:{counter}---{radom}
          </div>
        );
      };
    case "test2":
      return (props) => {
        const { nodeData } = props;
        const [counter, setCounter] = useState(0);
        useEffect(() => {
          const handler = setInterval(() => {
            setCounter((c) => c + 1);
          }, 1000);
          return () => {
            clearInterval(handler);
          };
        }, []);

        const onClick = useCallback(async () => {
          try {
            const target = findNodeByRules(ROOT, rules);
            console.debug("[Debug] target is", target);
            if (target) {
              const test = new PanelNode({
                id: nanoid(),
                page: "test",
              });
              ROOT.doAction({
                type: LayoutNodeActionType.ADD_PANEL,
                payload: {
                  panelNode: test,
                  mask: target.rule.part,
                  target: target.layoutNode,
                },
              });
            }
          } catch (error) {
            console.error(error);
          }
        }, []);

        const onShow = useCallback(() => {
          console.log(JSON.stringify(layoutNodeToJSON(ROOT), null, 2));
        }, []);

        return (
          <div>
            <button onClick={onClick}>add panel</button>
            <button onClick={onShow}>show layout obj</button>

            {nodeData}
            {counter}
          </div>
        );
      };
    case "test3":
      return (props) => {
        return <Counter />;
      };
    case "test4":
      return (props) => {
        return (
          <div>
            <div>with new scope</div>
            <CounterProvider>
              <Counter />
            </CounterProvider>
          </div>
        );
      };
    default:
      return () => {
        return <div>page {page} not found</div>;
      };
  }
};

const page = () => {
  return (
    <div className="App" style={{ height: "100vh", width: "100vw" }}>
      <GrapeLayout factory={factory} layout={ROOT}>
        <Layout />
      </GrapeLayout>
    </div>
  );
};

export default page;
