type ApiInut = {
  [key: string]: ((...args: any[]) => Promise<any>) | ApiInut;
};

export type Result<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: any };

type Api<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<any>
    ? (...args: Parameters<T[K]>) => Promise<Result<Awaited<ReturnType<T[K]>>>>
    : Api<T[K]>;
};

export function createApi<T extends ApiInut>(layerInput: T): Api<T> {
  const api: any = {};
  Object.entries(layerInput).forEach(([key, value]) => {
    api[key] = Object.entries(value).reduce((acc: any, [key, value]) => {
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
  return api;
}
