
export interface Acronym {
    id: number;
    acronym: string;
    refersTo: string;
    definition: string;
    areaKey: string;
    active: boolean;
   // tags:  string[];
    tagString: string;
    createdBy: string;
    created: string;
    lastUpdatedBy: string;
    lastUpdated: string;
    display: boolean;
}
