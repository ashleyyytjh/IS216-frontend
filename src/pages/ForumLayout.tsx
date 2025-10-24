// src/components/ForumPageLayout.tsx
import { Outlet, useParams } from "react-router-dom";
import ForumSidebar from "@/components/forum/ForumSideBar";

const ForumPageLayout = () => {
  const { noteId } = useParams<{ noteId: string }>();
  console.log({ noteId });
  return (
    <div className="flex relative ">
      <ForumSidebar selectedId={noteId} />
      <main className="flex flex-col justify-center h-full items-center w-full ">
        <Outlet />
      </main>
    </div>
  );
};

export default ForumPageLayout;
