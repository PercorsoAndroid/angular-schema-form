/**
 * Directive that handles the model arrays
 */
angular.module('schemaForm').directive('sfFormSelect', ['sfSelect', 'schemaForm', 'sfValidator', 'sfPath',
  function(sfSelect, schemaForm, sfValidator, sfPath) {

    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        scope.selectedForm = {value: 0};
        // Keeps the model data for each form
        var formData = [];
        // TODO: Watch the model value and pick a form to match it
        var once = scope.$parent.$watch(attrs.sfFormSelect, function(form) {
          if (!form) {
            return;
          }
          once();

          var model = sfSelect(form.key, scope.model);

          // Watch the model value and change to a form that matches it
          var key = sfPath.normalize(form.key);
          scope.$parent.$watch('model' + key, function(value) {
            model = scope.modelData = value;
            // If the selected form still validates, make sure we don't change it
            if (angular.isNumber(scope.selectedForm.value)) {
              var r = sfValidator.validate(form.items[scope.selectedForm.value], model);
              if (r.valid) {
                return;
              }
            }
            //Search for a form that is valid for the given model data
            for (var i = 0; i < form.items.length; i++) {
              var result = sfValidator.validate(form.items[i], model);
              if (result.valid) {
                scope.selectedForm.value = i;
                break;
              }
            }
          });

          // Restore data associated with selected form
          scope.$watch('selectedForm.value', function(selected, oldForm) {
            formData[oldForm] = model;
            if (formData[selected]) {
              sfSelect(form.key, scope.model, formData[selected]);
            }
            // TODO: Fill defaults if we don't have data for this form
          });
        });
      }
    };
  }
]);
