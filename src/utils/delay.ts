const delay = (duration: number) => new Promise<void>(resolve => setTimeout(resolve, duration));

export default delay;
