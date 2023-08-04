export interface EntityAttribute {
  name: string;
  type: string;
}

export interface Entity {
  id: string;
  name: string;
  attributes: EntityAttribute[];
}
