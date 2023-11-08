import { Metadata } from "next";

import { Providers } from "../../redux/provider";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "NotePal",
  description: "Note-taking app utilizing the power of AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <body>{children}</body>
        </Providers>
      </body>
    </html>
  );
}
