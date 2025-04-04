import "./App.css";

import Capture from "./features/Capture";
import ComponentTemplate from "./features/ComponentTemplate";
import GroupResizer from "./features/GroupResizer";
import Sidebar from "./features/Sidebar";
import StoryProvider from "./StoryProvider";
import StorySelector from "./features/StorySelector";
import StylePanel from "./features/StylePanel";

const App = () => {
  return (
    <StoryProvider>
      <Sidebar />
      <StorySelector />
      <StylePanel />
      <Capture>
        <ComponentTemplate />
      </Capture>
      <GroupResizer />
    </StoryProvider>
  );
};

export default App;
