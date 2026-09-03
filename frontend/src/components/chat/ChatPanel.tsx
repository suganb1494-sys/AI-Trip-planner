import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
export interface HelpMessage {
  role: "user" | "assistant";
  text: string;
}
export function ChatPanel({
  messages,
  value,
  onChange,
  onSend,
}: {
  messages: HelpMessage[];
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <aside className="chat-drawer open">
      <div className="chat-drawer-header">
        <div>
          <p>ROAMWISE HELP</p>
          <b>How can I help?</b>
        </div>
      </div>
      <div className="chat-history">
        {messages.map((m, i) => (
          <ChatMessage key={i} {...m} />
        ))}
      </div>
      <ChatInput value={value} onChange={onChange} onSend={onSend} />
    </aside>
  );
}
