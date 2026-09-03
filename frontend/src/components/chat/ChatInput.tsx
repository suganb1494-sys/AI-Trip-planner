export function ChatInput({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="chat-composer">
      <input
        className="chat-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder="Ask how to use the app…"
      />
      <button className="chat-send" onClick={onSend} disabled={!value.trim()}>
        Send
      </button>
    </div>
  );
}
