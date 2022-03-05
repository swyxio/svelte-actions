export interface ActionReturn<Parameter = void> {
	update?: (parameter: Parameter) => void;
	destroy?: () => void;
}

export interface Action<Parameter = void> {
	<Node extends HTMLElement>(node: Node, parameter: Parameter): ActionReturn<Parameter>;
}
