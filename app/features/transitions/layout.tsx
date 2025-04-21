import "./transitions.css";

export default function TransitionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="transition-container">{children}</div>;
}
