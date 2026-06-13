import { useCallback } from "react";
import { CHAT_URL, getToken, managerHeaders } from "@/lib/api";
import ChatBox, { ChatMessage } from "./ChatBox";

interface Props {
  objectId: number;
  myId: number;
  myRole: string;
  isManager?: boolean;
}

export default function ObjectChat({ objectId, myId, myRole, isManager }: Props) {
  const fetchMessages = useCallback(async (): Promise<ChatMessage[]> => {
    const headers = isManager
      ? managerHeaders()
      : { "Content-Type": "application/json", "X-Auth-Token": getToken() };
    const res = await fetch(`${CHAT_URL}?action=object_messages&object_id=${objectId}`, { headers });
    const data = await res.json();
    return data.messages || [];
  }, [objectId, isManager]);

  const sendMessage = useCallback(async (text: string) => {
    const headers = isManager
      ? managerHeaders()
      : { "Content-Type": "application/json", "X-Auth-Token": getToken() };
    await fetch(`${CHAT_URL}?action=object_messages&object_id=${objectId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ text }),
    });
  }, [objectId, isManager]);

  return (
    <ChatBox
      fetchMessages={fetchMessages}
      sendMessage={sendMessage}
      myId={myId}
      myRole={myRole}
      placeholder="Написать заказчику..."
    />
  );
}
