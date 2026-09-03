export function ChatMessage({ role, text }: { role: "user" | "assistant"; text: string }) { return <p className={`chat-message ${role}`}>{text}</p>; }
