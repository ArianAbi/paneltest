"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";
import { AnimatePresence } from "framer-motion";

interface Modal {
  title: string;
  description?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
}

export default function Modal({
  open,
  setOpen,
  title,
  description,
  children,
}: Modal) {
  function close() {
    setOpen(false);
  }

  return (
    <>
      {open && (
        <AnimatePresence>
          <div className="absolute w-screen h-screen flex items-center justify-center">
            {/* backdrop */}
            <div className="absolute z-40 size-full bg-black bg-opacity-60 backdrop-blur-sm"></div>
            {/* foreground */}
            <div className="relative z-50 bg-platform p-6 min-w-80 flex flex-col gap-2 items-center border-2 border-edge2 rounded-xl">
              <button className="absolute size-5 right-4 top-6" onClick={close}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h4 className="mt-0 mb-4">{title}</h4>

              {description && <p>{description}</p>}
              {children}
            </div>
          </div>
        </AnimatePresence>
      )}
    </>
  );
}
