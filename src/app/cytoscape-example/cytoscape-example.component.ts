import { Component } from "@angular/core";
import { CytoscapeComponent } from "./cytoscape.component";
import { Entity } from "./model";

@Component({
  selector: "cytoscape-example",
  template: ` <graph-cytoscape [edges]="edges" [entities]="entities" /> `,
  standalone: true,
  imports: [CytoscapeComponent],
  styles: [
    `
      :host {
        display: block;
        background-color: #e5e5f7;
        background-image: radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px);
        background-size: 10px 10px;
      }
    `,
  ],
})
export class CytoscapeExampleComponent {
  edges = [
    ["A", "B"],
    ["A", "C"],
  ];
  entities: Entity[] = [
    {
      id: "A",
      name: "Entity A",
      attributes: [
        { name: "Attribute 1", type: "PK" },
        { name: "Attribute 2", type: "FK" },
        { name: "Attribute 3", type: "bool" },
        { name: "Attribute 4", type: "text" },
        { name: "Attribute 5", type: "text" },
      ],
    },
    {
      id: "B",
      name: "Entity B",
      attributes: [
        { name: "Attribute 1", type: "PK" },
        { name: "Attribute 3", type: "bool" },
        { name: "Attribute 5", type: "text" },
      ],
    },
    {
      id: "C",
      name: "Entity C",
      attributes: [
        { name: "Attribute 1", type: "PK" },
        { name: "Attribute 4", type: "text" },
        { name: "Attribute 5", type: "text" },
      ],
    },
  ];
}
