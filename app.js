(function(){
    'use strict';
    
    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)    
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', foundItemsDirective)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");
    
    function foundItemsDirective(){
        
        var ddo = {
            retrict:'AE',
            scope: {
                items: '<',
                onRemove: '&',
                title: '@'
            },
            templateUrl:'searchList.html',
            controller:ShoppingListDirectiveController,
            controllerAs:'list',
            bindToController:true
        };
        
        return ddo;
    }
    
    function ShoppingListDirectiveController(){
      var list = this;

      list.itemInList = function(){
        if(list.items.length === 0){
          return true
        }
        return false;
      }
    }
    
    NarrowItDownController.$inject=['MenuSearchService'];
    
    function NarrowItDownController(MenuSearchService){
        
        var list=this;
        
        list.items="";
        
        list.searchItem="";
        list.filterSearch = function(){
            list.items="";
            list.title = origTitle + " (" + list.items.length + " items )";
            var promise = MenuSearchService.searchItem(list.searchItem);
            
            promise.then(function(result){
                list.items = result;                
                list.title = origTitle + " (" + list.items.length + " items )";
                console.log("responseData==> ", result);
            }).catch(function(error){
                list.items ="";
                console.log(error);
            });
        };
        
        list.removeItem = function(index){
            MenuSearchService.removeItem(index);
            list.title = origTitle + " (" + list.items.length + " items )";
        };
        
        
        var origTitle = "Search List #1";
        list.title = origTitle + " (" + list.items.length + " items )";
    }
    
    MenuSearchService.$inject=['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath){
        
        var service = this;
        service.searchResult=[];
        
        service.listMenuItems = function(){
            $http({
                method: 'get',
                url: (ApiBasePath+'/menu_items.json')
            }).then(function success(responseData){
                //console.log("responseData==> ", responseData);
                return responseData.data;
            },
            function error(error){
                console.log(error);
                throw new Error(error.message);
            });
        };
        
        service.searchItem = function(searchItem){
            service.searchResult=[];
             return $http({
                method: 'get',
                url: (ApiBasePath+'/menu_items.json')
            }).then(function success(responseData){
                //console.log("responseData==> ", responseData);
                
                var menuItem = responseData.data.menu_items;
                //var searchResult = [];
                service.searchResult.splice(0, service.searchResult.length);
                angular.forEach(menuItem,function(value, key){
                    //console.log(value, " ", searchItem)
                    if(value.description.toLowerCase().indexOf(searchItem) >0)
                        service.searchResult.push(value);
                });
                //console.log("service.searchResult ",service.searchResult);
                return service.searchResult;
            },
            function error(error){
                console.log(error);
                throw new Error(error.message);
            });
        };
        
        
        service.removeItem = function(itemIndex){
            service.searchResult.splice(itemIndex, 1);
        };
    }
    
    
       
})();