export interface ActionReturn<Parameter = any> {
	update?: (parameter: Parameter) => void;
	destroy?: () => void;
}

export interface Action<Parameter = any> {
	<Node extends HTMLElement>(node: Node, parameter?: Parameter): void | ActionReturn<Parameter>;
}

