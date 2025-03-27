import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "BaseButton",
  props: {
    type: {
      type: String as PropType<"primary" | "secondary" | "danger">,
      default: "primary",
    },
    size: {
      type: String as PropType<"small" | "medium" | "large">,
      default: "medium",
    },
    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => (
      <button
        class={[
          "base-button",
          `base-button--${props.type}`,
          `base-button--${props.size}`,
        ]}
        onClick={(e: MouseEvent) => props.onClick(e)}
      >
        {slots.default?.()}
      </button>
    );
  },
});

// 内联样式
const styles = `
.base-button {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 按钮类型 */
.base-button--primary {
  background-color: #007bff;
  color: white;
}
.base-button--primary:hover {
  background-color: #0056b3;
}

.base-button--secondary {
  background-color: #6c757d;
  color: white;
}
.base-button--secondary:hover {
  background-color: #5a6268;
}

.base-button--danger {
  background-color: #dc3545;
  color: white;
}
.base-button--danger:hover {
  background-color: #c82333;
}

/* 按钮尺寸 */
.base-button--small {
  padding: 4px 8px;
  font-size: 12px;
}
.base-button--medium {
  padding: 8px 16px;
  font-size: 14px;
}
.base-button--large {
  padding: 12px 24px;
  font-size: 16px;
}
`;

// 动态插入样式
if (typeof window !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerHTML = styles;
  document.head.appendChild(styleSheet);
}
