//*** Backup site ****//

app.controller('createIncrementalBackups', function ($scope, $http, $timeout) {

    $scope.destination = true;
    $scope.backupButton = true;
    $scope.cyberpanelLoading = true;
    $scope.runningBackup = true;
    $scope.restoreSt = true;


    $scope.fetchDetails = function () {
        getBackupStatus();
        $scope.populateCurrentRecords();
        $scope.destination = false;
        $scope.runningBackup = true;
    };

    function getBackupStatus() {

        $scope.cyberpanelLoadingBottom = false;

        url = "/IncrementalBackups/getBackupStatus";

        var data = {
            websiteToBeBacked: $scope.websiteToBeBacked,
            tempPath: $scope.tempPath
        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {


            if (response.data.backupStatus === 1) {

                if (response.data.abort === 1) {
                    $timeout.cancel();
                    $scope.cyberpanelLoadingBottom = true;
                    $scope.destination = false;
                    $scope.runningBackup = false;
                    $scope.backupButton = false;
                    $scope.cyberpanelLoading = true;
                    $scope.fileName = response.data.fileName;
                    $scope.status = response.data.status;
                    $scope.populateCurrentRecords();
                    return;
                } else {
                    $scope.destination = true;
                    $scope.backupButton = true;
                    $scope.runningBackup = false;

                    $scope.fileName = response.data.fileName;
                    $scope.status = response.data.status;
                    $timeout(getBackupStatus, 2000);

                }
            } else {
                $timeout.cancel();
                $scope.cyberpanelLoadingBottom = true;
                $scope.cyberpanelLoading = true;
                $scope.backupButton = false;
            }

        }

        function cantLoadInitialDatas(response) {
        }

    }

    $scope.destinationSelection = function () {
        $scope.backupButton = false;
    };

    $scope.populateCurrentRecords = function () {

        url = "/IncrementalBackups/fetchCurrentBackups";

        var data = {
            websiteToBeBacked: $scope.websiteToBeBacked,
        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            if (response.data.status === 1) {
                $scope.records = response.data.data;
            } else {
                new PNotify({
                    title: 'Error!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };

    $scope.createBackup = function () {

        $scope.status = '';

        $scope.cyberpanelLoading = false;


        url = "/IncrementalBackups/submitBackupCreation";

        var data = {
            websiteToBeBacked: $scope.websiteToBeBacked,
            backupDestinations: $scope.backupDestinations,
            websiteData: $scope.websiteData,
            websiteEmails: $scope.websiteEmails,
            websiteSSLs: $scope.websiteSSLs,
            websiteDatabases: $scope.websiteDatabases

        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {

            if (response.data.status === 1) {
                $scope.tempPath = response.data.tempPath;
                getBackupStatus();
            } else {
                $scope.cyberpanelLoading = true;
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
        }

    };

    // $scope.RestoreV2Backup = function () {
    //
    //     // $scope.status = '';
    //     //
    //     // $scope.cyberpanelLoading = false;
    //     //
    //     //
    //     // url = "/IncrementalBackups/submitBackupCreation";
    //
    //
    //     console.log($scope.websiteToBeBacked)
    //     console.log($scope.websiteData)
    //     var websites = document.getElementById('create-backup-select');
    //     var selected_website = websites.options[websites.selectedIndex].innerHTML;
    //     console.log(selected_website);
    //
    //     var data = {
    //         websiteToBeBacked: $scope.websiteToBeBacked,
    //         backupDestinations: $scope.backupDestinations,
    //         websiteData: $scope.websiteData,
    //         websiteEmails: $scope.websiteEmails,
    //         websiteSSLs: $scope.websiteSSLs,
    //         websiteDatabases: $scope.websiteDatabases
    //
    //     };
    //
    //     // var config = {
    //     //     headers: {
    //     //         'X-CSRFToken': getCookie('csrftoken')
    //     //     }
    //     // };
    //     //
    //     //
    //     // $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);
    //     //
    //     //
    //     // function ListInitialDatas(response) {
    //     //
    //     //     if (response.data.status === 1) {
    //     //         $scope.tempPath = response.data.tempPath;
    //     //         getBackupStatus();
    //     //     } else {
    //     //         $scope.cyberpanelLoading = true;
    //     //         new PNotify({
    //     //             title: 'Operation Failed!',
    //     //             text: response.data.error_message,
    //     //             type: 'error'
    //     //         });
    //     //     }
    //     //
    //     // }
    //     //
    //     // function cantLoadInitialDatas(response) {
    //     // }
    //
    // };

    $scope.deleteBackup = function (id) {


        url = "/IncrementalBackups/deleteBackup";

        var data = {
            backupID: id,
            websiteToBeBacked: $scope.websiteToBeBacked
        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {


            if (response.data.status === 1) {

                $scope.populateCurrentRecords();

            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
        }


    };

    $scope.restore = function (id) {

        $scope.cyberpanelLoading = false;


        url = "/IncrementalBackups/fetchRestorePoints";

        var data = {
            id: id,
            websiteToBeBacked: $scope.websiteToBeBacked
        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            if (response.data.status === 1) {
                $scope.jobs = response.data.data;
            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };

    $scope.restorePoint = function (id, reconstruct) {

        $scope.status = '';

        $scope.cyberpanelLoading = false;
        $scope.restoreSt = false;


        url = "/IncrementalBackups/restorePoint";

        var data = {
            websiteToBeBacked: $scope.websiteToBeBacked,
            jobid: id,
            reconstruct: reconstruct

        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {

            if (response.data.status === 1) {
                $scope.tempPath = response.data.tempPath;
                getBackupStatus();
            }

        }

        function cantLoadInitialDatas(response) {
        }

    };


});

///** Backup site ends **///


app.controller('incrementalDestinations', function ($scope, $http) {
    $scope.cyberpanelLoading = true;
    $scope.sftpHide = true;
    $scope.awsHide = true;

    $scope.fetchDetails = function () {

        if ($scope.destinationType === 'SFTP') {
            $scope.sftpHide = false;
            $scope.awsHide = true;
            $scope.populateCurrentRecords();
        } else {
            $scope.sftpHide = true;
            $scope.awsHide = false;
            $scope.populateCurrentRecords();
        }
    };

    $scope.populateCurrentRecords = function () {

        $scope.cyberpanelLoading = false;


        url = "/IncrementalBackups/populateCurrentRecords";

        var type = 'SFTP';
        if ($scope.destinationType === 'SFTP') {
            type = 'SFTP';
        } else {
            type = 'AWS';
        }

        var data = {
            type: type
        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            if (response.data.status === 1) {
                $scope.records = response.data.data;
            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };

    $scope.addDestination = function (type) {
        $scope.cyberpanelLoading = false;


        url = "/IncrementalBackups/addDestination";

        if (type === 'SFTP') {
            var data = {
                type: type,
                IPAddress: $scope.IPAddress,
                password: $scope.password,
                backupSSHPort: $scope.backupSSHPort
            };
        } else {
            var data = {
                type: type,
                AWS_ACCESS_KEY_ID: $scope.AWS_ACCESS_KEY_ID,
                AWS_SECRET_ACCESS_KEY: $scope.AWS_SECRET_ACCESS_KEY,
            };
        }

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            $scope.populateCurrentRecords();
            if (response.data.status === 1) {
                new PNotify({
                    title: 'Success!',
                    text: 'Destination successfully added.',
                    type: 'success'
                });
            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };

    $scope.removeDestination = function (type, ipAddress) {
        $scope.cyberpanelLoading = false;


        url = "/IncrementalBackups/removeDestination";

        var data = {
            type: type,
            IPAddress: ipAddress,
        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            $scope.populateCurrentRecords();
            if (response.data.status === 1) {
                new PNotify({
                    title: 'Success!',
                    text: 'Destination successfully removed.',
                    type: 'success'
                });
            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };


});


app.controller('scheduleBackupInc', function ($scope, $http) {

    var globalPageNumber;
    $scope.scheduleFreq = true;
    $scope.cyberpanelLoading = true;
    $scope.getFurtherWebsitesFromDB = function (pageNumber) {
        $scope.cyberpanelLoading = false;
        globalPageNumber = pageNumber;

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };

        var data = {page: pageNumber};


        dataurl = "/CloudLinux/submitWebsiteListing";

        $http.post(dataurl, data, config).then(ListInitialData, cantLoadInitialData);


        function ListInitialData(response) {
            $scope.cyberpanelLoading = true;
            if (response.data.listWebSiteStatus === 1) {
                var finalData = JSON.parse(response.data.data);
                $scope.WebSitesList = finalData;
                $scope.pagination = response.data.pagination;
                $scope.default = response.data.default;
                $("#listFail").hide();
            } else {
                $("#listFail").fadeIn();
                $scope.errorMessage = response.data.error_message;
                console.log(response.data);

            }
        }

        function cantLoadInitialData(response) {
            $scope.cyberpanelLoading = true;
        }


    };

    var websitesToBeBacked = [];
    var websitesToBeBackedTemp = [];

    var index = 0;
    var tempTransferDir = "";
    $scope.addRemoveWebsite = function (website, websiteStatus) {

        if (websiteStatus === true) {
            var check = 1;
            for (var j = 0; j < websitesToBeBacked.length; j++) {
                if (websitesToBeBacked[j] == website) {
                    check = 0;
                    break;
                }
            }
            if (check == 1) {
                websitesToBeBacked.push(website);
            }

        } else {

            var tempArray = [];

            for (var j = 0; j < websitesToBeBacked.length; j++) {
                if (websitesToBeBacked[j] != website) {
                    tempArray.push(websitesToBeBacked[j]);
                }
            }
            websitesToBeBacked = tempArray;
        }
    };

    $scope.allChecked = function (webSiteStatus) {
        if (webSiteStatus === true) {

            websitesToBeBacked = websitesToBeBackedTemp;
            $scope.webSiteStatus = true;
        } else {
            websitesToBeBacked = [];
            $scope.webSiteStatus = false;
        }
    };

    $scope.scheduleFreqView = function () {
        $scope.scheduleFreq = false;
        $scope.getFurtherWebsitesFromDB(1);

    };
    $scope.addSchedule = function () {
        $scope.cyberpanelLoading = false;


        url = "/IncrementalBackups/submitBackupSchedule";

        var data = {
            backupDestinations: $scope.backupDest,
            backupFreq: $scope.backupFreq,
            backupRetention: $scope.backupRetention,
            websiteData: $scope.websiteData,
            websiteEmails: $scope.websiteEmails,
            websiteDatabases: $scope.websiteDatabases,
            websitesToBeBacked: websitesToBeBacked
        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            $scope.populateCurrentRecords();
            if (response.data.status === 1) {
                new PNotify({
                    title: 'Success!',
                    text: 'Operation successful.',
                    type: 'success'
                });
            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };

    $scope.populateCurrentRecords = function () {

        $scope.cyberpanelLoading = false;


        url = "/IncrementalBackups/getCurrentBackupSchedules";


        var data = {};

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            if (response.data.status === 1) {
                let data = response.data.data;
                $scope.records = data;
                data.forEach(item => {
                    websitesToBeBackedTemp.push(item.website)
                })
            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };
    $scope.populateCurrentRecords();

    $scope.delSchedule = function (id) {

        $scope.cyberpanelLoading = false;

        url = "/IncrementalBackups/scheduleDelete";


        var data = {id: id};

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;

            if (response.data.status === 1) {
                $scope.populateCurrentRecords();
            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };

    $scope.editInitial = function (id) {

        $scope.jobID = id;

        $scope.cyberpanelLoading = false;


        url = "/IncrementalBackups/fetchSites";


        var data = {id: id};

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            if (response.data.status === 1) {
                $scope.websites = response.data.data;

                if (response.data.websiteData === 1) {
                    $scope.websiteData = true;
                }
                if (response.data.websiteDatabases === 1) {
                    $scope.websiteDatabases = true;
                }
                if (response.data.websiteEmails === 1) {
                    $scope.websiteEmails = true;
                }

            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };

    $scope.saveChanges = function () {

        $scope.cyberpanelLoading = false;

        url = "/IncrementalBackups/saveChanges";


        var data = {
            id: $scope.jobID,
            websiteData: $scope.websiteData,
            websiteDatabases: $scope.websiteDatabases,
            websiteEmails: $scope.websiteEmails

        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;

            if (response.data.status === 1) {
                $scope.editInitial($scope.jobID);
                new PNotify({
                    title: 'Success!',
                    text: 'Operation successful.',
                    type: 'success'
                });
            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };

    $scope.removeSite = function (website) {

        $scope.cyberpanelLoading = false;

        url = "/IncrementalBackups/removeSite";


        var data = {
            id: $scope.jobID,
            website: website
        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;

            if (response.data.status === 1) {
                $scope.editInitial($scope.jobID);
                new PNotify({
                    title: 'Success!',
                    text: 'Operation successful.',
                    type: 'success'
                });
            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };

    $scope.cyberpanelLoading = true;

    $scope.addWebsite = function () {

        $scope.cyberpanelLoading = false;

        url = "/IncrementalBackups/addWebsite";


        var data = {
            id: $scope.jobID,
            website: $scope.websiteToBeAdded
        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;

            if (response.data.status === 1) {
                $scope.editInitial($scope.jobID);
                new PNotify({
                    title: 'Success!',
                    text: 'Operation successful.',
                    type: 'success'
                });
            } else {
                new PNotify({
                    title: 'Operation Failed!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };


});


app.controller('restoreRemoteBackupsInc', function ($scope, $http, $timeout) {

    $scope.destination = true;
    $scope.backupButton = true;
    $scope.cyberpanelLoading = true;
    $scope.runningBackup = true;
    $scope.restoreSt = true;

    $scope.showThings = function () {
        $scope.destination = false;
        $scope.runningBackup = true;
    };

    $scope.fetchDetails = function () {
        $scope.populateCurrentRecords();
    };

    function getBackupStatus() {

        $scope.cyberpanelLoadingBottom = false;

        url = "/IncrementalBackups/getBackupStatus";

        var data = {
            websiteToBeBacked: $scope.websiteToBeBacked,
            tempPath: $scope.tempPath
        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {


            if (response.data.backupStatus === 1) {

                if (response.data.abort === 1) {
                    $timeout.cancel();
                    $scope.cyberpanelLoadingBottom = true;
                    $scope.destination = false;
                    $scope.runningBackup = false;
                    $scope.backupButton = false;
                    $scope.cyberpanelLoading = true;
                    $scope.fileName = response.data.fileName;
                    $scope.status = response.data.status;
                    $scope.populateCurrentRecords();
                    return;
                } else {
                    $scope.destination = true;
                    $scope.backupButton = true;
                    $scope.runningBackup = false;

                    $scope.fileName = response.data.fileName;
                    if (response.data.status === 1) {
                        $scope.status = 'Fetching status..'
                    } else {
                        $scope.status = response.data.status;
                    }

                    $timeout(getBackupStatus, 2000);

                }
            } else {
                $timeout.cancel();
                $scope.cyberpanelLoadingBottom = true;
                $scope.cyberpanelLoading = true;
                $scope.backupButton = false;
            }

        }

        function cantLoadInitialDatas(response) {
        }

    }

    $scope.populateCurrentRecords = function () {
        $scope.cyberpanelLoading = false;

        url = "/IncrementalBackups/fetchCurrentBackups";

        var data = {
            websiteToBeBacked: $scope.websiteToBeBacked,
            backupDestinations: $scope.backupDestinations,
            password: $scope.password
        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            if (response.data.status === 1) {
                $scope.records = response.data.data;
            } else {
                new PNotify({
                    title: 'Error!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.cyberpanelLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }

    };

    $scope.restorePoint = function (id, path) {

        $scope.status = '';

        $scope.cyberpanelLoading = false;
        $scope.restoreSt = false;


        url = "/IncrementalBackups/restorePoint";

        var data = {
            websiteToBeBacked: $scope.websiteToBeBacked,
            jobid: id,
            reconstruct: 'remote',
            path: path,
            backupDestinations: $scope.backupDestinations,
            password: $scope.password

        };

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {

            if (response.data.status === 1) {
                $scope.tempPath = response.data.tempPath;
                getBackupStatus();
            }

        }

        function cantLoadInitialDatas(response) {
        }

    };


});


app.controller('restorev2backupoage', function ($scope, $http, $timeout, $compile) {


    $scope.backupLoading = true;

    $scope.selectwebsite = function () {
        document.getElementById('reposelectbox').innerHTML = "";
        $scope.backupLoading = false;

        var url = "/IncrementalBackups/selectwebsiteRetorev2";

        var data = {
            Selectedwebsite: $scope.selwebsite,

        };
        //alert( $scope.selwebsite);

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.backupLoading = true;
            if (response.data.status === 1) {


                const selectBox = document.getElementById('reposelectbox');


                const options = response.data.data;
                const option = document.createElement('option');


                option.value = 1;
                option.text = 'Choose Repooo';

                selectBox.appendChild(option);

                if (options.length >= 1) {
                    for (let i = 0; i < options.length; i++) {

                        const option = document.createElement('option');


                        option.value = options[i];
                        option.text = options[i];

                        selectBox.appendChild(option);
                    }

                } else {
                    new PNotify({
                        title: 'Error!',
                        text: 'file empty',
                        type: 'error'
                    });
                }


            } else {
                new PNotify({
                    title: 'Error!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.backupLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }
    }

    $scope.RestorePathV2 = function (SnapshotId, Path) {

        console.log("SnapshotId: " + SnapshotId)
        console.log("Path: " + Path)
        var url = "/IncrementalBackups/RestorePathV2";
        var data = {
            snapshotid: SnapshotId,
            path: Path
        }

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {

            if (response.data.status === 1) {
                $scope.SnapShotId = response.data.SnapShotId;
                $scope.tempPath = response.data.Path;

                console.log("Returned ID on ListInitialDatas: " + $scope.SnapShotId)
                console.log("Returned PATH on ListInitialDatas: " + $scope.tempPath)

            }

        }

        function cantLoadInitialDatas(response) {
        }


    }


    $scope.selectrepo = function () {
        $scope.backupLoading = false;

        var url = "/IncrementalBackups/selectreporestorev2";

        var data = {
            Selectedrepo: $('#reposelectbox').val(),
            Selectedwebsite: $scope.selwebsite,
        }
        //alert( $scope.selwebsite);

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.backupLoading = true;
            if (response.data.status === 1) {

                var data = response.data.data

                console.log(response.data.data)
                console.log(response.data.data[0][1])
                var snaphots = response.data.data[0][1]

                for (var i = 0; i < snaphots.length; i++) {
                    var tml = ' <tr style="">\n' +
                        '                                <td>' + snaphots[i].id + '</td>' +
                        '                                <td><button  type="button" \n' +
                        '                                    class="btn btn-danger">Delete</button></td>\n' +
                        '                                \n' +
                        '                            </tr>' +
                        '<tr style="border: none!important;"> <td colspan="2" style="display: inherit;max-height: 10px;background-color: transparent; border: none">\n' +
                        '                                            <button id="' + snaphots[i].id + '" class="my-4 mx-4 btn " style="margin-bottom: 15px;margin-top: -8px;background-color: #161a69; color: white;border-radius: 6px" onclick=listpaths("' + i + '","' + snaphots[i].id + '")>+</button>\n' +
                        '                                        </td></tr>' +
                        '<tr style="border: none!important;">' +
                        ' <td colspan="2" style="display: none;border: none"  id="' + i + '">' +
                        ' <table id="inside" style="margin: 0 auto;">\n';

                    for (var j = 0; j < snaphots[i].paths.length; j++) {
                        tml += '<tr style="border-top: 1px #cccccc solid;display: flex;padding: 15px; justify-content: space-between;">\n' +
                            '<td style="">' + snaphots[i].paths[j] + '</td>\n' +
                            '<td style="">' +
                            '<button id="' + snaphots[i].paths[j] + '" style="margin-inline: 30px; color: white!important; background-color: #3051be; border-radius: 6px;" class="btn" ng-click=\'RestorePathV2("' + snaphots[i].id + '","' + snaphots[i].paths[j] + '")\'>Restore</button></td>\n' +
                            '</tr>\n';
                    }

                    tml += '</table>\n' +
                        '</td>\n' +
                        '</tr>\n' +
                        '</tr>\n';
                    var mp = $compile(tml)($scope);

                    $('#listsnapshots').append(mp);
                }

                // $scope.Snaphot_ID

                // var table = document.getElementById("snapshotstable");
                //
                //  // Loop through the data and create a new row for each item
                //  for (var i = 0; i < data.length; i++) {
                //    // Create a new row element
                //    var row = table.insertRow();
                //
                //    // Create the first cell and set its value to the current item in the data array
                //    var idCell = row.insertCell(0);
                //    idCell.innerHTML = data[i];
                //
                //    // Create the second cell and add a delete button to it
                //    var deleteCell = row.insertCell(1);
                //    var deleteButton = document.createElement("button");
                //    deleteButton.innerHTML = "Delete";
                //    deleteButton.addEventListener("click", function() {
                //      // Call your delete function here
                //      console.log("Deleting item:", data[i]);
                //    });
                //    deleteCell.appendChild(deleteButton);
                //  }
            } else {
                new PNotify({
                    title: 'Error!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.backupLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }
    }


});

app.controller('CreateV2Backup', function ($scope, $http, $timeout, $compile) {


    $scope.backupLoading = true;

    $scope.selectwebsite = function () {
        document.getElementById('reposelectbox').innerHTML = "";
        $scope.backupLoading = false;
        // document.getElementById('CreateV2BackupButton').style.display = "block";
        var url = "/IncrementalBackups/selectwebsiteRetorev2";

        var data = {
            Selectedwebsite: $scope.selwebsite,
            Selectedrepo: $('#reposelectbox').val(),
        };
        //alert( $scope.selwebsite);

        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };


        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.backupLoading = true;
            if (response.data.status === 1) {


                const selectBox = document.getElementById('reposelectbox');


                const options = response.data.data;
                const option = document.createElement('option');


                option.value = 1;
                option.text = 'Choose Repooo';

                selectBox.appendChild(option);

                if (options.length >= 1) {
                    for (let i = 0; i < options.length; i++) {

                        const option = document.createElement('option');


                        option.value = options[i];
                        option.text = options[i];

                        selectBox.appendChild(option);
                    }

                } else {
                    new PNotify({
                        title: 'Error!',
                        text: 'file empty',
                        type: 'error'
                    });
                }


            } else {
                new PNotify({
                    title: 'Error!',
                    text: response.data.error_message,
                    type: 'error'
                });
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.backupLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }
    }





    $scope.CreateV2BackupButton = function () {
        $scope.backupLoading = false;

        var url = "/IncrementalBackups/CreateV2BackupButton";

        var data = {
            Selectedwebsite: $scope.selwebsite,
            Selectedrepo: $('#reposelectbox').val(),
        };


        var config = {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        };

        //alert('Done..........')
        $http.post(url, data, config).then(ListInitialDatas, cantLoadInitialDatas);


        function ListInitialDatas(response) {
            $scope.backupLoading = true;
            if (response.data.status === 1) {

                alert("....................."+response.data.status);

            }
            else {
                alert('fail..........'+response.data.status);
            }

        }

        function cantLoadInitialDatas(response) {
            $scope.backupLoading = true;
            new PNotify({
                title: 'Operation Failed!',
                text: 'Could not connect to server, please refresh this page',
                type: 'error'
            });
        }
    }


});

app.controller('ConfigureV2Backup', function ($scope, $http, $timeout){
    $scope.cyberpanelLoading = true;
    $scope.selectbackuptype = function () {

        $scope.cyberpanelLoading = false;

        var backuptype = $scope.v2backuptype
        if (backuptype === 'GDrive')
        {
            $scope.cyberpanelLoading = true;
            $('#GdriveModal').modal('show');
        }
    }


    $scope.setupAccount = function(){
        window.open("https://platform.cyberpersons.com/gDrive?name=" + $scope.accountName + '&server=' + window.location.href);
    };
});
function listpaths(pathid, button) {

    console.log("LIST PAYH FUNCTIOB CALLED WITH ID " + pathid);
    var pathlist = document.getElementById(pathid)
    if (pathlist.style.display === "none") {
        pathlist.style.display = "revert";

        document.getElementById(button).innerText = "-"

    } else {
        pathlist.style.display = "none";

        document.getElementById(button).innerText = "+"

    }
}

