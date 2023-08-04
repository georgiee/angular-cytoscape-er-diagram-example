import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  Input,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { JsonPipe, NgForOf } from "@angular/common";
import * as cytoscape from "cytoscape";

import AngularBridge from "./cytoscape-angular-bridge";
import { EntityTableComponent } from "./entity-table.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { fromEvent, merge } from "rxjs";
import { Entity } from "./model";

cytoscape.use(AngularBridge);

@Component({
  selector: "graph-cytoscape",
  styles: [
    `
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        height: 75vh;
        width: 100%;
      }

      .cy {
        height: 100%;
        width: 100%;
      }

      .components {
        position: absolute;
        top: 0;
        left: 0;
      }

      .zoom-note {
        background-color: rgba(255, 255, 255, 0.8);
        color: #333;
        padding: 10px;
        position: absolute;
        right: 20px;
        bottom: 20px;
      }
    `,
  ],
  template: `
    <div class="cy" #cy></div>
    <div class="components">
      <ng-container #vcr></ng-container>
    </div>

    <div class="zoom-note">
      <span>
        Click Empty Space & Drag to navigate.
        <br />
        Drag Element. Press "Shift" + Scroll to zoom
      </span>
    </div>
  `,
  standalone: true,
  imports: [NgForOf, JsonPipe, EntityTableComponent],
})
export class CytoscapeComponent implements AfterViewInit {
  @ViewChild("cy", { static: true }) cyAnchor?: ElementRef;
  @ViewChild("vcr", { read: ViewContainerRef })
  renderContainer?: ViewContainerRef;

  @Input() entities: Entity[] = [];
  @Input() edges: string[][] = [];

  cy?: cytoscape.Core;

  constructor() {
    effect(() => {
      const shiftKeyPressed = this.shiftKeyPressed();
      this.cy?.zoomingEnabled(shiftKeyPressed);
    });
  }

  keypresses = toSignal(
    merge(
      fromEvent<KeyboardEvent>(document, "keydown"),
      fromEvent<KeyboardEvent>(document, "keyup"),
    ).pipe(),
    {
      initialValue: null,
    },
  );

  shiftKeyPressed = computed(() => {
    const event: any = this.keypresses();
    console.log("kk", event);
    return event?.shiftKey;
  });

  render() {
    if (this.cy || !this.renderContainer) {
      return;
    }

    const ids = this.entities.map((entity) => entity.id);
    const graph: cytoscape.ElementsDefinition = {
      nodes: this.entities.map((entity) => {
        return {
          data: {
            id: entity.id,
            name: entity.name,
            type: "node",
            entity,
          },
        };
      }),
      edges: this.edges
        .filter(
          // only refer to actual existing entities
          ([origin, target]) => ids.includes(origin) && ids.includes(target),
        )
        .map(([origin, target]) => ({
          data: {
            id: `${origin}-${target}`,
            source: origin,
            target,
            type: "bendPoint",
          },
        })),
    };

    this.cy = cytoscape({
      container: this.cyAnchor?.nativeElement,
      minZoom: 0.5,
      maxZoom: 2,
      zoomingEnabled: false,
      style: [
        {
          selector: "edge",
          style: {
            width: 5,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle",
            "curve-style": "taxi",
          },
        },
      ],
    });

    this.cy.angularBridge({
      containerRef: this.renderContainer,
      component: EntityTableComponent,
    });

    this.cy?.add(graph);

    setTimeout(() => {
      this.refresh();
    }, 100);
  }

  refresh() {
    this.cy!.layout({
      name: "cose",
      fit: true,
    }).run();
  }

  ngAfterViewInit(): void {
    // wait for the view ref then render
    setTimeout(() => {
      this.render();
    }, 0);
  }
}
