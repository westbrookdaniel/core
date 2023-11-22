type LayerInput = {
  [key: string]: ((...args: any[]) => Promise<any>) | LayerInput;
};

export type Result<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: any };

type Layer<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<any>
    ? (...args: Parameters<T[K]>) => Promise<Result<Awaited<ReturnType<T[K]>>>>
    : Layer<T[K]>;
};

export function createLayer<T extends LayerInput>(layerInput: T): Layer<T> {
  const layer: any = {};
  Object.entries(layerInput).forEach(([key, value]) => {
    layer[key] = Object.entries(value).reduce((acc: any, [key, value]) => {
      acc[key] = async (...args: any[]) => {
        try {
          const data = await value(...args);
          return { data };
        } catch (error) {
          return { error };
        }
      };
      return acc;
    }, {});
  });
  return layer;
}
