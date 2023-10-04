export const handlePromise = async (suppliedPromise: Promise<any>) => {
  try {
    const data = await suppliedPromise;
    return [data, null];
  } catch (e) {
    return [null, e];
  }
};
