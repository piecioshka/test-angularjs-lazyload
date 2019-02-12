const appModule = angular.module('app', []);

appModule.component('app', {
    template: `
        <header></header>
    `
});

appModule.component('header', {
    template: `
        <article-list list="[4, 5]"></article-list>
    `
});

appModule.component('articleList', {
    controller: ($http, $scope) => new (class {
        constructor() {
            $scope.list = [];
            this.fetchArticles();
        }

        async fetchArticles() {
            console.log('fetchArticles');
            const response = await $http.get('/data/list.json');
            const list = response.data.map((item, index) => {
                item.imageUrl += `?${index}-${Date.now()}`;
                return item;
            });

            $scope.list = $scope.list.concat(list);
            $scope.$apply();
        }
    })(),
    template: `
        <button ng-click="$ctrl.fetchArticles()">Load more</button>
        <hr/>
        <article-list-item
            ng-repeat="(key, value) in list track by $index"
            item="value"
        ></article-list-item>
    `
});

appModule.component('articleListItem', {
    bindings: {
        item: '<'
    },
    template: `
        <h2>{{ $ctrl.item.title }}</h2>
        <input ng-model="$ctrl.item.title"/>
        <hr/>
        <img ng-src="{{ $ctrl.item.imageUrl }}" alt=""/>
    `
});

angular.bootstrap(document, ['app']);
