import React from "react";
import { useChatStore } from "./../../../store/useChatStore";
import NoChatSelected from "@/components/chat/NoChatSelected";
import ChatPageContainer from "@/components/chat/ChatPagecontainer";
import SideBar from "@/components/chat/SideBar";

const ChatPage = () => {
  const { selectedUser } = useChatStore();
  return (
    <>
      <div className="flex items-center bg-white justify-center ">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SideBar />

            {!selectedUser ? <NoChatSelected /> : <ChatPageContainer />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
