import React from "react";

const ForumHome: React.FC = () => (
  <div className="flex h-full items-center justify-center bg-background">
    <div className="text-center">
      <h2 className="text-xl font-semibold">Select a Note</h2>
      <p className="mt-1 text-muted-foreground">
        Choose a purchased note from the sidebar to view its content.
      </p>
    </div>
  </div>
);

export default ForumHome;