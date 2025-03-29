import "./App.css";

import Capture from "./Capture";
import ComponentTemplate from "./ComponentTemplate";
import GroupResizer from "./GroupResizer";
import Sidebar from "./Sidebar";
import StoryProvider from "./StoryProvider";

const App = () => {
  return (
    <StoryProvider>
      <Sidebar />
      <Capture>
        <ComponentTemplate />
      </Capture>
      <GroupResizer />
    </StoryProvider>
  );
};

export default App;
