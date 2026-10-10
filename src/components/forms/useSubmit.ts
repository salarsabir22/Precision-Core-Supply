"use client";

import { useEffect, useRef, useState } from "react";
import type { SubmitResponse } from "@/lib/api";
import { validateFileList } from "@/lib/uploadRules";

type State =
  | { status: "idle" | "sending" }
  | { status: "success"; reference: string }
  | { status: "error"; message: string; errors: Record<string, string> };

/** POSTs a <form> (including files) to an API route and tracks the result. */
export function useSubmit(endpoint: string) {
  const [state, setState] = useState<State>({ status: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  // After a validation error, move focus to the first invalid field.
  useEffect(() => {
    if (state.status !== "error") return;
    const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    first?.focus();
  }, [state]);

  async function submit(form: HTMLFormElement, extra: Record<string, string> = {}) {
    const fd = new FormData(form);
    for (const [k, v] of Object.entries(extra)) fd.set(k, v);

    const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    const fileProblem = validateFileList(files);
    if (fileProblem) {
      setState({ status: "error", message: "Please check the highlighted fields.", errors: { files: fileProblem } });
      return false;
    }

    setState({ status: "sending" });
    try {
      const res = await fetch(endpoint, { method: "POST", body: fd });
      const data = (await res.json()) as SubmitResponse;
      if (data.ok) {
        setState({ status: "success", reference: data.reference });
        return true;
      }
      setState({ status: "error", message: data.message, errors: data.errors ?? {} });
    } catch {
      setState({
        status: "error",
        message: "Network problem. Please check your connection and try again.",
        errors: {},
      });
    }
    return false;
  }

  return {
    state,
    formRef,
    sending: state.status === "sending",
    errors: state.status === "error" ? state.errors : {},
    submit,
    reset: () => setState({ status: "idle" }),
  };
}
