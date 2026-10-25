export function createDataTransfer() {
  let data = "";
  return {
    setData: (_type: string, value: string) => {
      data = value;
    },
    getData: () => data,
    effectAllowed: "",
  };
}
