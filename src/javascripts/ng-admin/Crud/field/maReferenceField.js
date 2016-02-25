export default function maReferenceField(ReferenceRefresher) {
    return {
        scope: {
            'field': '&',
            'value': '=',
            'entry':  '=?',
            'datastore': '&?'
        },
        restrict: 'E',
        link: function(scope) {
            const field = scope.field();
            const identifierName = field.targetEntity().identifier().name()
            scope.name = field.name();
            scope.v = field.validation();

            if (!field.remoteComplete()) {
                // fetch choices from the datastore
                let initialEntries = scope.datastore()
                    .getEntries(field.targetEntity().uniqueId + '_choices');
                const isCurrentValueInInitialEntries = initialEntries.filter(e => e.identifierValue === scope.value).length > 0;
                if (scope.value && !isCurrentValueInInitialEntries) {
                    console.log('maReferenceField 3');
                    initialEntries.push(scope.datastore()
                        .getEntries(field.targetEntity().uniqueId + '_values')
                        .filter(entry => entry.values[identifierName] == scope.value)
                        .pop()
                    );
                }
                const initialChoices = initialEntries.map(entry => ({
                    value: entry.values[identifierName],
                    label: entry.values[field.targetField().name()]
                }));
                console.log('maReferenceField 1',initialChoices);

                scope.$broadcast('choices:update', { choices: initialChoices });
            } else {
                // ui-select doesn't allow to prepopulate autocomplete selects, see https://github.com/angular-ui/ui-select/issues/1197
                // let ui-select fetch the options using the ReferenceRefresher
                scope.refresh = function refresh(search) {
                    return ReferenceRefresher.refresh(field, scope.value, search)
                        .then(formattedResults => {
                            scope.$broadcast('choices:update', { choices: formattedResults });
                        });
                };
            }
            console.log('maReferenceField 2',scope);
        },
        template: `<ma-choice-field
                field="field()"
                datastore="datastore()"
                refresh="refresh($search)"
                value="value">
            </ma-choice-field>`
    };
}

maReferenceField.$inject = ['ReferenceRefresher'];
