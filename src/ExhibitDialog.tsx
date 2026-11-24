import { useId, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import "./exhibits.css";

export default function ExhibitDialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useLayoutEffect(() => {
    const node = dialog.current;
    if (!node) return;
    node.showModal();
    return () => {
      if (node.open) node.close();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="exhibit-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="exhibit-dialog-body">
        <header className="exhibit-dialog-title">
          <h3 id={titleId}>{title}</h3>
          <button type="button" className="exhibit-button" onClick={onClose}>
            Cerrar
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
