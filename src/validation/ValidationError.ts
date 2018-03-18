/**
 * Validation error description.
 */
export class ValidationError {

    /**
     * Object that was validated.
     */
    target: Object;

    /**
     * Object's property that haven't pass validation.
     */
    property: string;

    /**
     * Value that haven't pass a validation.
     */
    value: any;

    /**
     * Constraints that failed validation with error messages.
     */
    constraints: {
        [type: string]: string
    };

    /**
     * Contains all nested validation errors of the property.
     */
    children: ValidationError[];

    /**
     *
     * @param shouldDecorate decorate the message with ANSI formatter escape codes for better readability
     * @param hasParent true when the error is a child of an another one
     * @param parentPath path as string to the parent of this property
     */
    toString(shouldDecorate: boolean = false, hasParent: boolean = false, parentPath: string = ``): string {
        const boldStart = shouldDecorate ? `\x1b[1m` : ``;
        const boldEnd = shouldDecorate ? `\x1b[22m` : ``;
        const propConstraintFailed = (propertyName: string): string => ` - property ${boldStart}${parentPath}${propertyName}${boldEnd} has failed the following constraints: ${boldStart}${Object.keys(this.constraints).join(`, `)}${boldEnd} \n`;

        if (!hasParent) {
            return `An instance of ${boldStart}${this.target.constructor.name}${boldEnd} has failed the validation:\n` +
                (this.constraints ? propConstraintFailed(this.property) : ``) +
                this.children
                    .map(childError => childError.toString(shouldDecorate, true, this.property))
                    .join(``);
        } else {
            // we format numbers as array indexes for better readability.
            const formattedProperty = Number.isInteger(+this.property) ? `[${this.property}]` : `${parentPath ? `.` : ``}${this.property}`;

            if (this.constraints) {
                return propConstraintFailed(formattedProperty);
            } else {
                return this.children
                    .map(childError => childError.toString(shouldDecorate, true, `${parentPath}${formattedProperty}`, ))
                    .join(``);
            }
        }
    }
}
