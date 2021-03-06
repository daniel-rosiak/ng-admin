export default function maField(FieldViewConfiguration, $compile) {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '=',
            value: '=',
            entity: '&',
            form: '&',
            datastore: '&'
        },
        link: function(scope, element) {
            const field = scope.field();
            const type = field.type();
            scope.field = field;
            scope.type = type;
            scope.entity = scope.entity();
            scope.form = scope.form();
            scope.datastore = scope.datastore();
            scope.getCssClasses = function(entry) {
                return 'ng-admin-field-' + field.name().replace('.', '_') + ' ng-admin-type-' + type + ' ' + (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7');
            };

            scope.getInput = function() {
                return scope.form[field.name()];
            };

            /**
             * Should validation status be displayed for a given field?
             *
             * - No for non-editable fields, or template fields which not have a corresponding input
             * - No for non-altered input
             * - Yes otherwise
             */
            scope.fieldHasValidation = function() {
                var input = this.getInput();
                // if(scope) {
                //     if(scope.type != 'reference' && scope.type != 'choices' && scope.type != 'choice' && scope.type != 'wysiwyg') {
                //       return input && input.$dirty;  
                //     }
                //     return input;
                // }
                return input; //&& input.$dirty;
            };

            scope.fieldIsValid = function() {
                var input = this.getInput();
                return input && input.$valid;
            };

            scope.getFieldValidationClass = function() {
                if (this.fieldHasValidation()) {
                    //return this.fieldIsValid() ? 'has-success' : 'has-error';
                    return this.fieldIsValid() ? '' : 'has-error';
                }
            };

            var fieldTemplate;
            if (scope.field.editable()) {
                fieldTemplate =
`<div ng-class="getCssClasses(entry)">
    ${(!field.templateIncludesLabel() && field.getTemplateValue(scope.entry)) || FieldViewConfiguration[type].getWriteWidget()}
    <span ng-show="fieldHasValidation()" class="glyphicon form-control-feedback"></span>
</div>`;
            } else {
                fieldTemplate =
`<div ng-class="field.getCssClasses(entry)||'col-sm-10'">
    <p class="form-control-static">
        <ma-column field="::field" entry="::entry" entity="::entity" datastore="::datastore"></ma-column>
    </p>
</div>`;
            }

            const template =
`<div id="row-{{ field.name() }}" class="form-field form-group has-feedback" ng-class="getFieldValidationClass()">
    <label for="{{ field.name() }}" class="col-sm-2 control-label">
        {{ field.label() }}<span ng-if="field.validation().required">&nbsp;*</span>&nbsp;
    </label>
    ${fieldTemplate}
</div>`;

            element.append(template);
            $compile(element.contents())(scope);
        }
    };
}

maField.$inject = ['FieldViewConfiguration', '$compile'];
