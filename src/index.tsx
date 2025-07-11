import { createSignal, Show } from "solid-js";
import { render } from "solid-js/web";
import { css } from "@kuma-ui/core";

render(
  () => {
    const [accessOriginalSrc, setOriginalSrc] = createSignal<string>();
    const [accessSigmaSpace, setSigmaSpace] = createSignal(5);
    const [accessSigmaRange, setSigmaRange] = createSignal(25);
    const [accessScaling, setScaling] = createSignal(2);
    let originalRef: HTMLImageElement | undefined;
    let smoothedRef: HTMLCanvasElement | undefined;
    let detailRef: HTMLCanvasElement | undefined;
    let enhancedRef: HTMLCanvasElement | undefined;

    return (
      <Show
        when={accessOriginalSrc()}
        fallback={
          <div
            class={css`
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
                place-items: center;
              `}
            >
              <label
                class={css`
                  flex: 0 0;
                  white-space: nowrap;
                `}
              >
                Upload a file
              </label>
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
                class={css`
                  flex: 1;
                `}
              />
            </div>
            <button
              type="button"
              onclick={() =>
                setOriginalSrc(
                  "https://uploads.codesandbox.io/uploads/user/user_W9aCYwvnyj5LorvmgDPm9T/15pm-rock.png",
                )}
            >
              Try with a sample image
            </button>
            <a href="https://github.com/harumami/utokyo-FSC-IS4029L1-assignment-i1">
              README / Repository
            </a>
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
              display: grid;
              grid: 1fr 1fr / 1fr 1fr;
              gap: 0.5%;
              place-items: center;
            `}
          >
            <figure
              class={css`
                width: 100%;
                height: 100%;
                display: flex;
                flex-flow: column;
                place-items: center;
                justify-content: center;
              `}
            >
              <img
                src={accessOriginalSrc()}
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

                  const width = originalRef.naturalWidth;
                  const height = originalRef.naturalHeight;
                  smoothedRef.width = width;
                  smoothedRef.height = height;
                  detailRef.width = width;
                  detailRef.height = height;
                  enhancedRef.width = width;
                  enhancedRef.height = height;
                }}
                onerror={(error) => {
                  console.log(error);
                  setOriginalSrc(undefined);
                }}
                class={css`
                  min-width: 0%;
                  min-height: 0%;
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                `}
                ref={originalRef}
              />
              <figcaption
                class={css`
                  flex: 0 0;
                `}
              >
                Original
              </figcaption>
            </figure>
            <figure
              class={css`
                width: 100%;
                height: 100%;
                display: flex;
                flex-flow: column;
                place-items: center;
                justify-content: center;
              `}
            >
              <canvas
                class={css`
                  min-width: 0%;
                  min-height: 0%;
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                `}
                ref={smoothedRef}
              />
              <figcaption
                class={css`
                  flex: 0 0;
                `}
              >
                Smoothed
              </figcaption>
            </figure>
            <figure
              class={css`
                width: 100%;
                height: 100%;
                display: flex;
                flex-flow: column;
                place-items: center;
                justify-content: center;
              `}
            >
              <canvas
                class={css`
                  min-width: 0%;
                  min-height: 0%;
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                `}
                ref={detailRef}
              />
              <figcaption
                class={css`
                  flex: 0 0;
                `}
              >
                Detail
              </figcaption>
            </figure>
            <figure
              class={css`
                width: 100%;
                height: 100%;
                display: flex;
                flex-flow: column;
                place-items: center;
                justify-content: center;
              `}
            >
              <canvas
                class={css`
                  min-width: 0%;
                  min-height: 0%;
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                `}
                ref={enhancedRef}
              />
              <figcaption
                class={css`
                  flex: 0 0;
                `}
              >
                Enhanced
              </figcaption>
            </figure>
          </div>
          <div
            class={css`
              flex: 0 0;
              width: 100%;
              display: grid;
              grid: auto / auto 10% 1fr;
              gap: 0.5%;
            `}
          >
            <label
              class={css`
                display: flex;
                flex-flow: row;
                justify-content: center;
              `}
            >
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
              value={accessSigmaSpace()}
              onInput={(event) =>
                setSigmaSpace(Number(event.currentTarget.value))}
            />
            <input
              type="range"
              min={1}
              max={10}
              value={accessSigmaSpace()}
              oninput={(event) =>
                setSigmaSpace(Number(event.currentTarget.value))}
            />
            <label
              class={css`
                display: flex;
                flex-flow: row;
                justify-content: center;
              `}
            >
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
              value={accessSigmaRange()}
              onInput={(event) =>
                setSigmaRange(Number(event.currentTarget.value))}
            />
            <input
              type="range"
              min={1}
              max={50}
              value={accessSigmaRange()}
              onInput={(event) =>
                setSigmaRange(Number(event.currentTarget.value))}
            />
            <label
              class={css`
                display: flex;
                flex-flow: row;
                justify-content: center;
              `}
            >
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
              value={accessScaling()}
              onInput={(event) => setScaling(Number(event.currentTarget.value))}
            />
            <input
              type="range"
              min={1}
              max={10}
              value={accessScaling()}
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

              const width = originalRef.naturalWidth;
              const height = originalRef.naturalHeight;
              const sigmaSpace = accessSigmaSpace();
              const sigmaRange = accessSigmaRange();
              const scaling = accessScaling();
              smoothedCtx.drawImage(originalRef, 0, 0);

              const { data: originalData } = smoothedCtx.getImageData(
                0,
                0,
                width,
                height,
              );

              const smoothedData = new Uint8ClampedArray(originalData.length);
              const radius = Math.ceil(3 * sigmaSpace);

              for (let row = 0; row < width; ++row) {
                for (let column = 0; column < height; ++column) {
                  const index = 4 * (row + column * width);
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
                        neighborRow < 0 || width <= neighborRow ||
                        neighborColumn < 0 || height <= neighborColumn
                      ) {
                        continue;
                      }

                      const neighborIndex = 4 *
                        (neighborRow + neighborColumn * width);

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
                          (2 * sigmaSpace * sigmaSpace),
                      ) * Math.exp(
                        -(diffRed * diffRed + diffGreen * diffGreen +
                          diffBlue * diffBlue) /
                          (2 * sigmaRange * sigmaRange),
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
                  width,
                  height,
                ),
                0,
                0,
              );

              const detailData = new Uint8ClampedArray(originalData.length);

              for (let row = 0; row < width; ++row) {
                for (let column = 0; column < height; ++column) {
                  const index = 4 * (row + column * width);

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
                  width,
                  height,
                ),
                0,
                0,
              );

              const enhancedData = new Uint8ClampedArray(originalData.length);

              for (let row = 0; row < width; ++row) {
                for (let column = 0; column < height; ++column) {
                  const index = 4 * (row + column * width);

                  for (let color = 0; color < 3; ++color) {
                    enhancedData[index + color] = smoothedData[index + color] +
                      scaling * (detailData[index + color] - 128);
                  }

                  enhancedData[index + 3] = originalData[index + 3];
                }
              }

              enhancedCtx.putImageData(
                new ImageData(
                  enhancedData,
                  width,
                  height,
                ),
                0,
                0,
              );
            }}
            class={css`
              flex: 0;
            `}
          >
            Run
          </button>
          <button
            type="button"
            onclick={() => setOriginalSrc(undefined)}
            class={css`
              flex: 0;
            `}
          >
            Clear
          </button>
        </div>
      </Show>
    );
  },
  document.body,
);
