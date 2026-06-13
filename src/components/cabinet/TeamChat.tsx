import { useCallback } from "react";
import { CHAT_URL, getToken, managerHeaders, getManagerLogin } from "@/lib/api";
import ChatBox, { ChatMessage } from "./ChatBox";

interface Props {
  myId: number;
  myRole: string;
  isManager?: boolean;
}

export default function TeamChat({ myId, myRole, isManager }: Props) {
  const headers = useCallback(() =>
    isManager
      ? managerHeaders()
      : { "Content-Type": "application/json", "X-Auth-Token": getToken() }
  , [isManager]);

  const fetchMessages = useCallback(async (): Promise<ChatMessage[]> => {
    const res = await fetch(`${CHAT_URL}?action=team_messages`, { headers: headers() });
    const data = await res.json();
    return data.messages || [];
  }, [headers]);

  const sendMessage = useCallback(async (text: string) => {
    await fetch(`${CHAT_URL}?action=team_messages`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ text }),
    });
  }, [headers]);

  const displayId = isManager ? 0 : myId;
  const displayRole = isManager ? "manager" : myRole;

  return (
    <ChatBox
      fetchMessages={fetchMessages}
      sendMessage={sendMessage}
      myId={displayId}
      myRole={displayRole}
      placeholder={isManager ? `Написать команде (${getManagerLogin()})...` : "Написать управленцу..."}
    />
  );
}
