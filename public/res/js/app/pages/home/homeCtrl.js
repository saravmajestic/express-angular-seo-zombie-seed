'use strict';

define(['appModule', 'css!cssPath/app/home'], function (app) {

        app.controller('homeController', ['$scope', '$q', '$rootScope', '$routeParams', '$location', '$http', 'ajaxService',
            function ($scope, $q, $rootScope, $routeParams, $location, $http, ajaxService) {
                    $scope.welcomeMessage = 'Welcome World';

                    $rootScope.page.setMeta({title : "Dynamic title from controller"});

                    $scope.loadImageFileAsURL = function(fileToLoad){
	                    $scope.fileName = fileToLoad.name;
	                    var fileReader = new FileReader();
	                    fileReader.onload = function(fileLoadedEvent)
	                    {
	                        $scope.$apply(function() {
	                            $scope.imageData = fileLoadedEvent.target.result;
	                            ajaxService.triggerAjax('api/image', {image : $scope.imageData, fileName : $scope.fileName}, true).then(function(resp){
	                            	$scope.imageFile = resp.data;
	                            }, function(err){
	                            	alert("Error!");
	                            });
	                        });
	                    };
	                    fileReader.readAsDataURL(fileToLoad);
	                };

	                $scope.progressVisible = false;
	                $scope.saveFile = function(files){
	                    var fd = new FormData();
	                    fd.append("uploadedFile", files[0]);

	                    var xhr = new XMLHttpRequest();
	                    $scope.progressVisible = true;
	                    $scope.progress = 0;
	                    xhr.upload.addEventListener("progress", function(evt){
	                        $scope.$apply(function(){
	                            if (evt.lengthComputable) {
	                                $scope.progress = Math.round(evt.loaded * 100 / evt.total)
	                            }
	                        });
	                    }, false);
	                    xhr.addEventListener("loadend", function(event){
	                        $scope.$apply(function(){
	                            var resp = event.target.response;
	                            if(resp){
	                                resp = JSON.parse(resp);
	                                if(resp.isSuccess){
	                                    $scope.file = resp.fileName;
	                                }
	                            }
	                            $scope.progressVisible = false;
	                        });
	                    }, false);
	                    xhr.addEventListener("error", function(){alert("Error!");}, false);
	                    xhr.addEventListener("abort", function(){console.log(arguments);}, false);
	                    xhr.open("POST", "/api/file");
	                    
	                    xhr.send(fd);

	                };
            }
        ]);
});
