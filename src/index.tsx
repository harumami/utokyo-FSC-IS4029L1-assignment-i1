import { createSignal, Show } from "solid-js";
import { render } from "solid-js/web";
import { css } from "@kuma-ui/core";

render(
  () => {
    const [originalSrc, setOriginalSrc] = createSignal<string>();
    const [sigmaSpace, setSigmaSpace] = createSignal(5);
    const [sigmaRange, setSigmaRange] = createSignal(25);
    const [scaling, setScaling] = createSignal(2);
    let originalRef: HTMLImageElement | undefined;
    let smoothedRef: HTMLCanvasElement | undefined;
    let detailRef: HTMLCanvasElement | undefined;
    let enhancedRef: HTMLCanvasElement | undefined;

    return (
      <Show
        when={originalSrc()}
        fallback={
          <div
            class={css`
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              padding: 0.5%;
              display: flex;
              flex-flow: column;
              gap: 0.5%;
            `}
          >
            <div
              class={css`
                width: 100%;
                display: flex;
                flex-flow: row;
                gap: 0.5%;
              `}
            >
              <label>Upload an image</label>
              <input
                type="file"
                accept="image/*"
                onchange={async (event) => {
                  const file = event.currentTarget.files?.[0];

                  if (file === undefined) {
                    return;
                  }

                  const url = await new Promise<string | ArrayBuffer | null>(
                    (resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result);
                      reader.onerror = () => reject(reader.error);
                      reader.readAsDataURL(file);
                    },
                  );

                  if (url instanceof ArrayBuffer) {
                    throw Error("url is ArrayBuffer");
                  }

                  if (url === null) {
                    return;
                  }

                  setOriginalSrc(url);
                }}
              />
            </div>
            <div
              class={css`
                width: 100%;
                display: flex;
                flex-flow: row;
                gap: 0.5%;
              `}
            >
              <label>Or use</label>
              <button
                type="button"
                onclick={() =>
                  setOriginalSrc(
                    "https://uploads.codesandbox.io/uploads/user/user_W9aCYwvnyj5LorvmgDPm9T/15pm-rock.png",
                  )}
              >
                Default image
              </button>
            </div>
          </div>
        }
      >
        <div
          class={css`
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 0.5%;
            display: flex;
            flex-flow: column;
            gap: 0.5%;
          `}
        >
          <div
            class={css`
              flex: 1;
              width: 100%;
              min-height: 0%;
              display: grid;
              grid: 1fr 1fr / 1fr 1fr;
              gap: 0.5%;
              place-items: center;
            `}
          >
            <figure>
              <img
                src={originalSrc()}
                crossorigin="anonymous"
                onload={() => {
                  if (originalRef === undefined) {
                    throw Error("imageRef is undefined");
                  }

                  if (smoothedRef === undefined) {
                    throw Error("canvasRef is undefined");
                  }

                  if (detailRef === undefined) {
                    throw Error("detailRef is undefined");
                  }

                  if (enhancedRef === undefined) {
                    throw Error("enhancedRef is undefined");
                  }

                  smoothedRef.width = originalRef.naturalWidth;
                  smoothedRef.height = originalRef.naturalHeight;
                  detailRef.width = originalRef.naturalWidth;
                  detailRef.height = originalRef.naturalHeight;
                  enhancedRef.width = originalRef.naturalWidth;
                  enhancedRef.height = originalRef.naturalHeight;
                }}
                onerror={(error) => {
                  console.log(error);
                  setOriginalSrc(undefined);
                }}
                class={css`
                  width: 100%;
                  height: 100%;
                  min-width: 0%;
                  min-height: 0%;
                  object-fit: contain;
                `}
                ref={originalRef}
              />
              <figcaption>Original</figcaption>
            </figure>
            <figure>
              <canvas
                class={css`
                  width: 100%;
                  height: 100%;
                  min-width: 0%;
                  min-height: 0%;
                  object-fit: contain;
                `}
                ref={smoothedRef}
              />
              <figcaption>Smoothed</figcaption>
            </figure>
            <figure>
              <canvas
                class={css`
                  width: 100%;
                  height: 100%;
                  min-width: 0%;
                  min-height: 0%;
                  object-fit: contain;
                `}
                ref={detailRef}
              />
              <figcaption>Detail</figcaption>
            </figure>
            <figure>
              <canvas
                class={css`
                  width: 100%;
                  height: 100%;
                  min-width: 0%;
                  min-height: 0%;
                  object-fit: contain;
                `}
                ref={enhancedRef}
              />
              <figcaption>Enhanced</figcaption>
            </figure>
          </div>
          <div
            class={css`
              flex: 0 0;
              width: 100%;
              display: grid;
              grid: auto / auto 10% 1fr;
              gap: 0.5%;
              align-items: center;
            `}
          >
            <label>
              <math
                innerHTML={`
                    <msub>
                      <mi>
                        &sigma;
                      </mi>
                      <mi>
                        s
                      </mi>
                    </msub>
                `}
              />
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={sigmaSpace()}
              onInput={(event) =>
                setSigmaSpace(Number(event.currentTarget.value))}
            />
            <input
              type="range"
              min={1}
              max={10}
              value={sigmaSpace()}
              oninput={(event) =>
                setSigmaSpace(Number(event.currentTarget.value))}
            />
            <label>
              <math
                innerHTML={`
                    <msub>
                      <mi>
                        &sigma;
                      </mi>
                      <mi>
                        r
                      </mi>
                    </msub>
                `}
              />
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={sigmaRange()}
              onInput={(event) =>
                setSigmaRange(Number(event.currentTarget.value))}
            />
            <input
              type="range"
              min={1}
              max={50}
              value={sigmaRange()}
              onInput={(event) =>
                setSigmaRange(Number(event.currentTarget.value))}
            />
            <label>
              <math
                innerHTML={`
                    <mi>
                      s
                    </mi>
                `}
              />
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={scaling()}
              onInput={(event) => setScaling(Number(event.currentTarget.value))}
            />
            <input
              type="range"
              min={1}
              max={10}
              value={scaling()}
              onInput={(event) => setScaling(Number(event.currentTarget.value))}
            />
          </div>
          <button
            type="button"
            onclick={() => {
              if (originalRef === undefined) {
                throw Error("imageRef is undefined");
              }

              if (smoothedRef === undefined) {
                throw Error("canvasRef is undefined");
              }

              if (detailRef === undefined) {
                throw Error("detailRef is undefined");
              }

              if (enhancedRef === undefined) {
                throw Error("enhancedRef is undefined");
              }

              const smoothedCtx = smoothedRef.getContext("2d");

              if (smoothedCtx === null) {
                throw Error("smoothedCtx is null");
              }

              const detailCtx = detailRef.getContext("2d");

              if (detailCtx === null) {
                throw Error("detailCtx is null");
              }

              const enhancedCtx = enhancedRef.getContext("2d");

              if (enhancedCtx === null) {
                throw Error("enhancedCtx is null");
              }

              smoothedCtx.drawImage(originalRef, 0, 0);

              const { data: originalData } = smoothedCtx.getImageData(
                0,
                0,
                smoothedRef.width,
                smoothedRef.height,
              );

              const smoothedData = new Uint8ClampedArray(originalData.length);
              const radius = Math.ceil(3 * sigmaSpace());

              for (let row = 0; row < smoothedRef.width; ++row) {
                for (let column = 0; column < smoothedRef.height; ++column) {
                  const index = 4 * (row + column * smoothedRef.width);
                  let sumWeight = 0;
                  let sumRed = 0;
                  let sumGreen = 0;
                  let sumBlue = 0;

                  for (let diffRow = -radius; diffRow <= radius; ++diffRow) {
                    for (
                      let diffColumn = -radius;
                      diffColumn <= radius;
                      ++diffColumn
                    ) {
                      const neighborRow = row + diffRow;
                      const neighborColumn = column + diffColumn;

                      if (
                        neighborRow < 0 || smoothedRef.width <= neighborRow ||
                        neighborColumn < 0 ||
                        smoothedRef.height <= neighborColumn
                      ) {
                        continue;
                      }

                      const neighborIndex = 4 *
                        (neighborRow + neighborColumn * smoothedRef.width);

                      const neighborRed = originalData[neighborIndex + 0];
                      const neighborGreen = originalData[neighborIndex + 1];
                      const neighborBlue = originalData[neighborIndex + 2];

                      const diffRed = neighborRed -
                        originalData[index + 0];

                      const diffGreen = neighborGreen -
                        originalData[index + 1];

                      const diffBlue = neighborBlue -
                        originalData[index + 2];

                      const weight = Math.exp(
                        -(diffRow * diffRow + diffColumn * diffColumn) /
                          (2 * sigmaSpace() * sigmaSpace()),
                      ) * Math.exp(
                        -(diffRed * diffRed + diffGreen * diffGreen +
                          diffBlue * diffBlue) /
                          (2 * sigmaRange() * sigmaRange()),
                      );

                      sumWeight += weight;
                      sumRed += weight * neighborRed;
                      sumGreen += weight * neighborGreen;
                      sumBlue += weight * neighborBlue;
                    }
                  }

                  smoothedData[index + 0] = sumRed / sumWeight;
                  smoothedData[index + 1] = sumGreen / sumWeight;
                  smoothedData[index + 2] = sumBlue / sumWeight;
                  smoothedData[index + 3] = originalData[index + 3];
                }
              }

              smoothedCtx.putImageData(
                new ImageData(
                  smoothedData,
                  smoothedRef.width,
                  smoothedRef.height,
                ),
                0,
                0,
              );

              const detailData = new Uint8ClampedArray(originalData.length);

              for (let row = 0; row < detailRef.width; ++row) {
                for (let column = 0; column < detailRef.height; ++column) {
                  const index = 4 * (row + column * detailRef.width);

                  for (let color = 0; color < 3; ++color) {
                    detailData[index + color] = 128 +
                      originalData[index + color] -
                      smoothedData[index + color];
                  }

                  detailData[index + 3] = originalData[index + 3];
                }
              }

              detailCtx.putImageData(
                new ImageData(
                  detailData,
                  detailRef.width,
                  detailRef.height,
                ),
                0,
                0,
              );

              const enhancedData = new Uint8ClampedArray(originalData.length);

              for (let row = 0; row < enhancedRef.width; ++row) {
                for (let column = 0; column < enhancedRef.height; ++column) {
                  const index = 4 * (row + column * enhancedRef.width);

                  for (let color = 0; color < 3; ++color) {
                    enhancedData[index + color] = smoothedData[index + color] +
                      scaling() * (detailData[index + color] - 128);
                  }

                  enhancedData[index + 3] = originalData[index + 3];
                }
              }

              enhancedCtx.putImageData(
                new ImageData(
                  enhancedData,
                  enhancedRef.width,
                  enhancedRef.height,
                ),
                0,
                0,
              );
            }}
          >
            Run
          </button>
          <button type="button" onclick={() => setOriginalSrc(undefined)}>
            Clear
          </button>
        </div>
      </Show>
    );
  },
  document.body,
);
