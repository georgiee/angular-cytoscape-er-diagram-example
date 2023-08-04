import { Component } from '@angular/core';
import { CytoscapeExampleComponent } from './cytoscape-example/cytoscape-example.component';

@Component({
  selector: 'app-root',
  template: `
      <cytoscape-example/>
  `,
  styles: [],
  imports: [CytoscapeExampleComponent],
  standalone: true
})
export class AppComponent {
}
