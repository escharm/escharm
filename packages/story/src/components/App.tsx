import "./App.css";

import Capture from "./Capture";
import ComponentTemplate from "./ComponentTemplate";
import GroupResizer from "./GroupResizer";
import Sidebar from "./Sidebar";
import StoryProvider from "./StoryProvider";
import StorySelector from "./StorySelector";

const App = () => {
  return (
    <StoryProvider>
      <Sidebar />
      <StorySelector />
      <Capture>
        <ComponentTemplate />
      </Capture>
      <GroupResizer />
    </StoryProvider>
  );
};

export default App;
