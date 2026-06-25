interface BadgeProps {
  text: string;
  variant: "Light" | "Dark";
}

export default function ({ text = "Example", variant = "Light" }: BadgeProps) {
  return (
    <span
      style={{
        backgroundColor: variant === "Light" ? "#eee" : "#000",
        borderRadius: "1em",
        color: variant === "Light" ? "#000" : "#fff",
        display: "inline-block",
        fontSize: "14px",
        lineHeight: 2,
        padding: "0 1em",
      }}
    >
      {text}
    </span>
  );
}
