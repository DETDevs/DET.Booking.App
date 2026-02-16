export interface EntitySchema {
    entity: string;
    title: string;
    columns: ColumnDef[];
    fields: FieldDef[];
}

export interface ColumnDef {
    key: string;
    label: string;
    type: "text" | "badge" | "date" | "currency" | "boolean";
}

export interface FieldDef {
    key: string;
    label: string;
    type: "text" | "email" | "tel" | "number" | "date" | "select" | "textarea" | "checkbox";
    required?: boolean;
    placeholder?: string;
    options?: string[];
}
