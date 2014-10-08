'use strict';

describe('Directive: module', function() {

  beforeEach(module('angularcolApp', 'templates/directives/module.html', 'templates/directives/tag.html'));

  var $compile, dom, scope, template1, template2;

  beforeEach(inject(function ($rootScope, _$compile_, $templateCache){
    scope = $rootScope.$new();
    scope.repository = {
      'id': 4282788,
      'name': 'facebook-sdk',
      'owner': {
        'login': 'clearcode',
      },
      'description': 'Facebook Platform Python SDK',
    };

    template1 = $templateCache.get('templates/directives/module.html');
    template2 = $templateCache.get('templates/directives/tag.html');
    $templateCache.put('/templates/directives/module.html', template1);
    $templateCache.put('/templates/directives/tag.html', template2);

    $compile = _$compile_;
    dom = $compile('<div class="module" repo="repository"></div>')(scope);
    scope.$digest();
  }));

  it('should show name from the loaded repo', function(){
    expect(dom.find('.name').text()).toEqual('facebook-sdk — clearcode');
  });

  it('should show tags from the loaded repo', function(){
    expect(dom.find('.tagList').text().trim()).toEqual('Tags:');
  });

  it('should show description from the loaded repo', function(){
    expect(dom.find('.description').text()).toEqual('Description: Facebook Platform Python SDK');
  });

  it('demo button should be active', function(){
    expect(dom.find('label:contains("Demo")').hasClass('disabled')).toEqual(false);
  });
});
