declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare const ISDEV: boolean
