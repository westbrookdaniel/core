type ApiInput = {
  [key: string]: ((...args: any[]) => Promise<any>) | ApiInput;
};

export type Result<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: any };

type Api<T> = {
  [K in keyof T]: {
    [K2 in keyof T[K]]: T[K][K2] extends (...args: any[]) => Promise<any>
      ? (
          ...args: Parameters<T[K][K2]>
        ) => Promise<Result<Awaited<ReturnType<T[K][K2]>>>>
      : Api<T[K][K2]>;
  };
};

export function createApi<T extends ApiInput>(api: T): Api<T> {
  const newApi: any = {};
  Object.entries(api).forEach(([key, value]) => {
    newApi[key] = Object.entries(value).reduce((acc: any, [key, value]) => {
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
  return newApi;
}
