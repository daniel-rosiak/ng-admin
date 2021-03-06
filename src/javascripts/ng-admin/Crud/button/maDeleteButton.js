/**
 * Link to delete
 *
 * Usage:
 * <ma-delete-button entity="entity" entry="entry" size="xs"></ma-delete-button>
 */
export default function maDeleteButtonDirective($state) {
    return {
        restrict: 'E',
        scope: {
            entity: '&',
            entityName: '@',
            entry: '&',
            size: '@',
            label: '@',
        },
        link: function (scope, element, attrs) {
            var entityName = scope.entity() ? scope.entity().name() : attrs.entityName;
            var stateParams = entityName == $state.params.entity ? { ...$state.params } : {};
            stateParams.entity = entityName;
            stateParams.id = scope.entry().identifierValue;
            scope.stateParams = stateParams;
            scope.label = scope.label || 'Delete';
        },
        template:
` <a class="btn btn-default" ng-class="size ? \'btn-\' + size : \'\'" ui-sref="delete(stateParams)">
<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>&nbsp;<span class="hidden-xs">{{ ::label | translate }}</span>
</a>`
    };
}

maDeleteButtonDirective.$inject = ['$state'];
