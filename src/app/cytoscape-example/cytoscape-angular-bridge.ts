import * as cytoscape from 'cytoscape';
import { ViewContainerRef } from '@angular/core';

/**
 * Loosely based on cytoscape-dom-node (https://github.com/mwri/cytoscape-dom-node)
 */
function cytoscapeAngularBridge(
  this: cytoscape.Core,
  params: DomBridgeParams
): cytoscape.Core {
  const domContainer = params.containerRef.element.nativeElement.parentElement;
  const domMap: any = {};

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const cy = this;

  const resizeObserver = new ResizeObserver((entries) => {
    for (let e of entries) {
      let node_div = e.target as HTMLElement;
      let id = node_div.dataset["cyDomId"];

      if (!id) {
        return;
      }

      let n = cy.getElementById(id);

      n?.style({
        width: node_div.offsetWidth,
        height: node_div.offsetHeight,
        shape: 'rectangle'
      });
    }
  });

  const updateNodePosition = (node: cytoscape.NodeSingular) => {
    let id = node.id();

    if (!domMap[id]) return;

    let dom = domMap[id];

    dom.style.transform = `translate(-50%, -50%) translate(${node
      .position('x')
      .toFixed(2)}px, ${node.position('y').toFixed(2)}px)`;
    dom.style.display = 'inline';
    dom.style.position = 'absolute';
    dom.style['z-index'] = 10;
  };

  const updateContainer = () => {
    let pan = cy.pan();
    let zoom = cy.zoom();

    domContainer.style.transform =
      'translate(' + pan.x + 'px,' + pan.y + 'px) scale(' + zoom + ')';
  };

  const createComponentForNode = (node: cytoscape.NodeSingular) => {
    const component = params.containerRef.createComponent(params.component);
    component.setInput('entity', node.data().entity);

    const element = component.location.nativeElement;
    element.dataset.cyDomId = node.id();

    resizeObserver.observe(element);

    return element;
  };

  const addNode = (node: cytoscape.NodeSingular) => {
    if (domMap[node.id()]) {
      return;
    }

    domMap[node.id()] = createComponentForNode(node);
    updateNodePosition(node);
  };

  cy.nodes().each((n) => addNode(n));

  cy.on('position bounds', 'node', (ev) => updateNodePosition(ev.target));
  cy.on('pan zoom', (ev) => updateContainer());
  cy.on('add', 'node', (ev) => addNode(ev.target));
  return this;
}

const register = (cy: typeof cytoscape) => {
  if (!cy) return;

  cy('core', 'angularBridge', cytoscapeAngularBridge);
};

export default register;

export interface DomBridgeParams {
  containerRef: ViewContainerRef;
  component: any;
}

declare module 'cytoscape' {
  interface Core {
    angularBridge: (props: DomBridgeParams) => cytoscape.Core;
  }
}
