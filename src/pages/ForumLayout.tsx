// src/components/ForumPageLayout.tsx
import { Outlet, useParams } from "react-router-dom";
import ForumSidebar from "@/components/forum/ForumSideBar";

const ForumPageLayout: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  console.log({ noteId });
  return (
    <div className="flex h-dvh ">
      <ForumSidebar selectedId={noteId} />
      <main className="flex flex-col justify-center h-full items-center flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default ForumPageLayout;
