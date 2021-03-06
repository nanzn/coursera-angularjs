(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'controller',
    bindToController: true
  };

  return ddo;
}

function FoundItemsDirectiveController() {
  var controller = this;

  controller.checkEmpty = function () {
    if(controller.items.length == 0){
      return true;
    }
    return false; 
  }
}

NarrowItDownController.$inject = ['MenuSearchService', '$q'];
function NarrowItDownController(MenuSearchService) {
  var controller = this;

  controller.searchTerm = "";
  controller.found = [];

  controller.narrowItDown = function () {
    MenuSearchService.getMatchedMenuItems(controller.searchTerm)
    .then(function (response) {
      controller.found = response;
    });

  };

  controller.removeItem = function (itemIndex) {
    controller.found.splice(itemIndex, 1);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath', '$q'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function (response) {
      // process result and only keep items that match
      var foundItems = [];
      if(searchTerm == ""){
        return foundItems;
      }
      var menuItems = response.data.menu_items;
      for(var i = 0; i < menuItems.length; i++){
        if(menuItems[i].description.includes(searchTerm)){
          foundItems.push(menuItems[i]);
        }
      }
      // return processed items
      return foundItems;
    });
  }
}

})();
