declare module 'nepalify' {
  interface Nepalify {
    format(input: string | number): string;
    // Add other methods if you use them
  }

  const nepalify: Nepalify;
  export default nepalify;
}
