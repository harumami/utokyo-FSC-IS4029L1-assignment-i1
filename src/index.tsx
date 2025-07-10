import { createSignal, Show } from "solid-js";
import { render } from "solid-js/web";
import { css } from "@kuma-ui/core";

render(
  () => {
    const [imageSrc, setImageSrc] = createSignal<string>();
    const [sigmaSpace, setSigmaSpace] = createSignal(5);
    const [sigmaColor, setSigmaColor] = createSignal(50);
    let imageRef: HTMLImageElement | undefined;
    let canvasRef: HTMLCanvasElement | undefined;

    return (
      <Show
        when={imageSrc()}
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

                  setImageSrc(url);
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
              <label>Or use a default image</label>
              <button
                type="button"
                onclick={() =>
                  setImageSrc(
                    "https://cdn.pixabay.com/photo/2025/06/11/22/12/kackar-mountains-9655201_960_720.jpg",
                  )}
              >
                https://pixabay.com/ja/photos/%E3%82%AB%E3%83%81%E3%82%AB%E3%83%AB%E5%B1%B1%E8%84%88-%E4%B8%83%E9%9D%A2%E9%B3%A5-%E8%87%AA%E7%84%B6-9655201/
              </button>
            </div>
          </div>
        }
      >
        {(imageSrc) => (
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
            <img
              src={imageSrc()}
              crossorigin="anonymous"
              onerror={(error) => {
                console.log(error);
                setImageSrc(undefined);
              }}
              class={css`
                flex: 1;
                width: 100%;
                height: 100%;
                object-fit: contain;
              `}
              ref={imageRef}
            />
            <canvas
              class={css`
                flex: 1;
                width: 100%;
                height: 100%;
                object-fit: contain;
              `}
              ref={canvasRef}
            />
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
              <label>Sigma for space</label>
              <input
                type="number"
                min={1}
                max={50}
                value={sigmaSpace()}
                onInput={(event) =>
                  setSigmaSpace(Number(event.currentTarget.value))}
              />
              <input
                type="range"
                min={1}
                max={50}
                value={sigmaSpace()}
                oninput={(event) =>
                  setSigmaSpace(Number(event.currentTarget.value))}
              />
              <label>
                Sigma for color
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={sigmaColor()}
                onInput={(event) =>
                  setSigmaColor(Number(event.currentTarget.value))}
              />
              <input
                type="range"
                min={1}
                max={50}
                value={sigmaColor()}
                onInput={(event) =>
                  setSigmaColor(Number(event.currentTarget.value))}
              />
            </div>
            <button
              type="button"
              onclick={() => {
                if (imageRef === undefined) {
                  throw Error("imageRef is undefined");
                }

                if (canvasRef === undefined) {
                  throw Error("canvasRef is undefined");
                }

                canvasRef.width = imageRef.naturalWidth;
                canvasRef.height = imageRef.naturalHeight;
                const canvasCtx = canvasRef.getContext("2d");

                if (canvasCtx === null) {
                  throw Error("canvasCtx is null");
                }

                canvasCtx.drawImage(imageRef, 0, 0);

                const { data: inputData } = canvasCtx.getImageData(
                  0,
                  0,
                  canvasRef.width,
                  canvasRef.height,
                );

                const outputData = new Uint8ClampedArray(inputData.length);
                const radius = Math.ceil(3 * sigmaSpace());

                for (let row = 0; row < canvasRef.width; ++row) {
                  for (let column = 0; column < canvasRef.height; ++column) {
                    const index = 4 * (row + column * canvasRef.width);
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
                          neighborRow < 0 || canvasRef.width <= neighborRow ||
                          neighborColumn < 0 ||
                          canvasRef.height <= neighborColumn
                        ) {
                          continue;
                        }

                        const neighborIndex = 4 *
                          (neighborRow + neighborColumn * canvasRef.width);

                        const neighborRed = inputData[neighborIndex + 0];
                        const neighborGreen = inputData[neighborIndex + 1];
                        const neighborBlue = inputData[neighborIndex + 2];

                        const diffRed = neighborRed -
                          inputData[index + 0];

                        const diffGreen = neighborGreen -
                          inputData[index + 1];

                        const diffBlue = neighborBlue -
                          inputData[index + 2];

                        const weight = Math.exp(
                          -(diffRow * diffRow + diffColumn * diffColumn) /
                            (2 * sigmaSpace() * sigmaSpace()),
                        ) * Math.exp(
                          -(diffRed * diffRed + diffGreen * diffGreen +
                            diffBlue * diffBlue) /
                            (2 * sigmaColor() * sigmaColor()),
                        );

                        sumWeight += weight;
                        sumRed += weight * neighborRed;
                        sumGreen += weight * neighborGreen;
                        sumBlue += weight * neighborBlue;
                      }
                    }

                    outputData[index + 0] = sumRed / sumWeight;
                    outputData[index + 1] = sumGreen / sumWeight;
                    outputData[index + 2] = sumBlue / sumWeight;
                    outputData[index + 3] = inputData[index + 3];
                  }
                }

                canvasCtx?.putImageData(
                  new ImageData(outputData, canvasRef.width, canvasRef.height),
                  0,
                  0,
                );
              }}
            >
              Run
            </button>
            <button type="button" onclick={() => setImageSrc(undefined)}>
              Reset
            </button>
          </div>
        )}
      </Show>
    );
  },
  document.body,
);
