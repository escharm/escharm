import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactStoryPlugin } from "@escharm/story";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    reactStoryPlugin({
      homeTemplate(componentPath) {
        return `
          import { StrictMode } from "react";
          import { createRoot } from "react-dom/client";
          
          import "/src/index.css";
          import "/src/App.css";

          import Component from '${componentPath}';

          createRoot(document.getElementById("root")!).render(
            <StrictMode>
              <Component />
            </StrictMode>,
          );
      `;
      },
    }),
  ],
});
