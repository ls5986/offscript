import type { RelationshipTemplate } from "./contracts";

export function relationshipRoleText(
  template: RelationshipTemplate,
  index: number,
): string {
  return (
    template.namedRoles[index] ?? `${template.expandableRole} ${index + 1}`
  );
}
