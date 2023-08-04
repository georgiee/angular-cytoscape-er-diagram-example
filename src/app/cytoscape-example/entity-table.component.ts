import { Component, Input } from "@angular/core";
import { NgForOf } from "@angular/common";
import { Entity } from "./model";

@Component({
  template: `
    <h4 class="header">{{ entity.name }}</h4>

    <div class="attributes">
      <div *ngFor="let attribute of entity.attributes ?? []; let i = index">
        {{ attribute?.name }}:{{ attribute?.type }}
      </div>
    </div>
  `,
  standalone: true,
  imports: [NgForOf],
  styles: [
    `
      :host {
        min-width: 200px;
        background-color: #c2f0ff;
        pointer-events: none;
        display: inline-block;
        color: #333;
      }

      .header {
        background-color: #6495ed;
        padding: 5px;
        text-align: center;
        margin: 0;
      }

      .attributes {
        padding: 5px;
        font-size: 16px;
      }
    `,
  ],
})
export class EntityTableComponent {
  @Input({ required: true }) entity!: Entity;
}
