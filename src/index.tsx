import { createSignal, onMount, Show } from "solid-js";
import { render } from "solid-js/web";
import { css } from "@kuma-ui/core";

const Image = (props: { file: File }) => {
  let element: HTMLImageElement | undefined;

  onMount(async () => {
    if (element === undefined) {
      throw Error("element is undefined");
    }

    const data = await new Promise<string | ArrayBuffer | null>(
      (resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(props.file);
      },
    );

    if (data instanceof ArrayBuffer) {
      throw Error("data is ArrayBuffer");
    }

    if (data === null) {
      return;
    }

    element.src = data;
  });

  return (
    <img
      ref={element}
      class={css`
        width: 100%;
        height: 100%;
        object-fit: contain;
      `}
    />
  );
};

const [file, setFile] = createSignal<File>();

render(
  () => (
    <Show
      when={file()}
      fallback={
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.currentTarget.files?.[0])}
        />
      }
    >
      {(file) => <Image file={file()} />}
    </Show>
  ),
  document.body,
);
