export type Action<Params = any> = (
	node: HTMLElement,
	parameters: Params
) => {
	update?: (parameters: Params) => void;
	destroy?: () => void;
};
